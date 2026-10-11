package com.example.farmrental.controller;

import com.example.farmrental.dto.CheckoutOrder;
import com.example.farmrental.dto.PaymentResult;
import com.example.farmrental.dto.PaymentVerification;
import com.example.farmrental.service.PaymentService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/payments")
public class PaymentController {
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
