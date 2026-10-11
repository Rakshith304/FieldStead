package com.example.farmrental.controller;

import com.example.farmrental.service.PaymentService;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/payments")
public class PaymentController {
    public record CheckoutOrder(String keyId, String orderId, long amount, String currency,
                                String description, String customerName, String customerEmail) {}
    public record PaymentVerification(
        @NotBlank(message = "Order ID is required") String razorpayOrderId,
        @NotBlank(message = "Payment ID is required") String razorpayPaymentId,
        @NotBlank(message = "Payment signature is required")
        @Pattern(regexp = "^[a-fA-F0-9]{64}$", message = "Payment signature is invalid") String razorpaySignature
    ) {}
    public record PaymentResult(String paymentStatus) {}

    private final PaymentService service;
    public PaymentController(PaymentService service) { this.service = service; }

    @PostMapping("/rentals/{rentalId}/order")
    public CheckoutOrder createOrder(
        @org.springframework.security.core.annotation.AuthenticationPrincipal Long uid,
        @PathVariable Long rentalId
    ) {
        return service.createOrder(uid, rentalId);
    }

    @PostMapping("/rentals/{rentalId}/verify")
    public PaymentResult verifyPayment(
        @org.springframework.security.core.annotation.AuthenticationPrincipal Long uid,
        @PathVariable Long rentalId,
        @Valid @RequestBody PaymentVerification request
    ) {
        service.verifyPayment(uid, rentalId, request);
        return new PaymentResult("PAID");
    }
}
