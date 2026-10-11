package com.example.farmrental.dto;

public record CheckoutOrder(
    String keyId,
    String orderId,
    long amount,
    String currency,
    String description,
    String customerName,
    String customerEmail
) {}
