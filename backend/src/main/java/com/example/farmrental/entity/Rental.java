package com.example.farmrental.entity;
import jakarta.persistence.*; import java.math.BigDecimal; import java.time.*;
@Entity
public class Rental {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY) private Long id;
    @ManyToOne(optional = false) private User farmer; @ManyToOne(optional = false) private Equipment equipment;
    private LocalDate startDate; private LocalDate endDate; private BigDecimal agreedRate; private BigDecimal totalAmount;
    private String status = "PENDING"; private LocalDateTime createdAt = LocalDateTime.now();
    private String paymentStatus = "UNPAID"; private String razorpayOrderId; private String razorpayPaymentId;
    public Rental() {}
    public Rental(User f, Equipment e, LocalDate s, LocalDate en, BigDecimal total) { farmer = f; equipment = e; startDate = s; endDate = en; agreedRate = e.getDailyRate(); totalAmount = total; }
    public Long getId() { return id; } public User getFarmer() { return farmer; } public Equipment getEquipment() { return equipment; }
    public LocalDate getStartDate() { return startDate; } public LocalDate getEndDate() { return endDate; } public BigDecimal getAgreedRate() { return agreedRate; }
    public BigDecimal getTotalAmount() { return totalAmount; } public String getStatus() { return status; } public void setStatus(String s) { status = s; }
    public String getPaymentStatus() { return paymentStatus; } public void setPaymentStatus(String status) { paymentStatus = status; }
    @com.fasterxml.jackson.annotation.JsonIgnore public String getRazorpayOrderId() { return razorpayOrderId; }
    @com.fasterxml.jackson.annotation.JsonIgnore public String getRazorpayPaymentId() { return razorpayPaymentId; }
    public void setRazorpayOrderId(String id) { razorpayOrderId = id; } public void setRazorpayPaymentId(String id) { razorpayPaymentId = id; }
    public LocalDateTime getCreatedAt() { return createdAt; }
}
