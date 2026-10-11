package com.example.farmrental.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;

public record PaymentVerification(
    @NotBlank(message = "Order ID is required")
    String razorpayOrderId,

    @NotBlank(message = "Payment ID is required")
    String razorpayPaymentId,

    @NotBlank(message = "Payment signature is required")
    @Pattern(regexp = "^[a-fA-F0-9]{64}$", message = "Payment signature is invalid")
    String razorpaySignature
) {}
