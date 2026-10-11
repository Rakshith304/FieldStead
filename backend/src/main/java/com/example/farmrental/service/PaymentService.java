package com.example.farmrental.service;

import com.example.farmrental.controller.PaymentController.PaymentVerification;
import com.example.farmrental.controller.PaymentController.CheckoutOrder;
import com.example.farmrental.entity.Rental;
import com.example.farmrental.exception.MyException;
import com.example.farmrental.repository.RentalRepository;
import com.fasterxml.jackson.databind.JsonNode;
import java.math.BigDecimal;
import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.util.HexFormat;
import java.util.Map;
import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.client.RestClient;
import org.springframework.web.client.RestClientException;

@Service
public class PaymentService {
    private static final String CURRENCY = "INR";
    private final RentalRepository rentals;
    private final UserService users;
    private final String keyId;
    private final String keySecret;
    private final RestClient razorpay;

    public PaymentService(
        RentalRepository rentals,
        UserService users,
        RestClient.Builder restClientBuilder,
        @Value("${app.razorpay.key-id:}") String keyId,
        @Value("${app.razorpay.key-secret:}") String keySecret
    ) {
        this.rentals = rentals;
        this.users = users;
        this.keyId = keyId;
        this.keySecret = keySecret;
        var clientBuilder = restClientBuilder.baseUrl("https://api.razorpay.com/v1");
        if (!keyId.isBlank() && !keySecret.isBlank()) {
            clientBuilder.defaultHeaders(headers -> headers.setBasicAuth(keyId, keySecret));
        }
        this.razorpay = clientBuilder.build();
    }

    @Transactional
    public CheckoutOrder createOrder(Long userId, Long rentalId) {
        var farmer = users.requireUser(userId);
        Rental rental = findRental(rentalId);
        requireOwner(farmer.getId(), rental);
        if (!"APPROVED".equals(rental.getStatus())) {
            throw new MyException(HttpStatus.CONFLICT, "Payment is available after the rental is approved");
        }
        if ("PAID".equals(rental.getPaymentStatus())) {
            throw new MyException(HttpStatus.CONFLICT, "This rental has already been paid");
        }
        requireConfigured();

        long amount = toPaise(rental.getTotalAmount());
        String orderId = rental.getRazorpayOrderId();
        if (orderId == null || orderId.isBlank()) {
            JsonNode order = providerCall(() -> razorpay.post().uri("/orders")
                .body(Map.of("amount", amount, "currency", CURRENCY, "receipt", "rental-" + rental.getId()))
                .retrieve().body(JsonNode.class));
            if (order == null || order.path("id").asText().isBlank()) {
                throw new MyException(HttpStatus.BAD_GATEWAY, "Payment provider returned an invalid order");
            }
            orderId = order.path("id").asText();
            rental.setRazorpayOrderId(orderId);
            rentals.save(rental);
        }
        return new CheckoutOrder(keyId, orderId, amount, CURRENCY,
            rental.getEquipment().getName(), farmer.getName(), farmer.getEmail());
    }

    @Transactional
    public void verifyPayment(Long userId, Long rentalId, PaymentVerification request) {
        var farmer = users.requireUser(userId);
        Rental rental = findRental(rentalId);
        requireOwner(farmer.getId(), rental);
        if (!"APPROVED".equals(rental.getStatus())) {
            throw new MyException(HttpStatus.CONFLICT, "This rental is not approved for payment");
        }
        if ("PAID".equals(rental.getPaymentStatus())) {
            if (request.razorpayPaymentId().equals(rental.getRazorpayPaymentId())) return;
            throw new MyException(HttpStatus.CONFLICT, "This rental has already been paid");
        }
        requireConfigured();
        if (rental.getRazorpayOrderId() == null
            || !rental.getRazorpayOrderId().equals(request.razorpayOrderId())) {
            throw new MyException(HttpStatus.BAD_REQUEST, "Payment order does not match this rental");
        }
        if (!MessageDigest.isEqual(signature(request).getBytes(StandardCharsets.US_ASCII),
            request.razorpaySignature().toLowerCase().getBytes(StandardCharsets.US_ASCII))) {
            throw new MyException(HttpStatus.BAD_REQUEST, "Payment signature could not be verified");
        }

        JsonNode payment = providerCall(() -> razorpay.get()
            .uri("/payments/{paymentId}", request.razorpayPaymentId())
            .retrieve().body(JsonNode.class));
        if (payment == null
            || !request.razorpayOrderId().equals(payment.path("order_id").asText())
            || payment.path("amount").asLong(-1) != toPaise(rental.getTotalAmount())
            || !CURRENCY.equals(payment.path("currency").asText())
            || !"captured".equals(payment.path("status").asText())) {
            throw new MyException(HttpStatus.CONFLICT, "Payment is not captured for the expected rental amount");
        }

        rental.setRazorpayPaymentId(request.razorpayPaymentId());
        rental.setPaymentStatus("PAID");
        rentals.save(rental);
    }

    private Rental findRental(Long id) {
        return rentals.findById(id).orElseThrow(() -> new MyException(HttpStatus.NOT_FOUND, "Rental not found"));
    }

    private void requireOwner(Long farmerId, Rental rental) {
        if (!rental.getFarmer().getId().equals(farmerId)) {
            throw new MyException(HttpStatus.FORBIDDEN, "Not your rental");
        }
    }

    private void requireConfigured() {
        if (keyId.isBlank() || keySecret.isBlank()) {
            throw new MyException(HttpStatus.SERVICE_UNAVAILABLE, "Online payments are not configured");
        }
    }

    private long toPaise(BigDecimal amount) {
        try {
            return amount.movePointRight(2).longValueExact();
        } catch (ArithmeticException exception) {
            throw new MyException(HttpStatus.BAD_REQUEST, "Rental amount cannot be processed");
        }
    }

    private String signature(PaymentVerification request) {
        try {
            Mac mac = Mac.getInstance("HmacSHA256");
            mac.init(new SecretKeySpec(keySecret.getBytes(StandardCharsets.UTF_8), "HmacSHA256"));
            byte[] digest = mac.doFinal((request.razorpayOrderId() + "|" + request.razorpayPaymentId())
                .getBytes(StandardCharsets.UTF_8));
            return HexFormat.of().formatHex(digest);
        } catch (java.security.GeneralSecurityException exception) {
            throw new IllegalStateException("HMAC-SHA256 is unavailable", exception);
        }
    }

    private <T> T providerCall(java.util.function.Supplier<T> request) {
        try {
            return request.get();
        } catch (RestClientException exception) {
            throw new MyException(HttpStatus.BAD_GATEWAY, "Payment provider request failed; please try again");
        }
    }
}
