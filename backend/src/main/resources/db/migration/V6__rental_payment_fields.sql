ALTER TABLE rental
    ADD COLUMN payment_status VARCHAR(20) NOT NULL DEFAULT 'UNPAID',
    ADD COLUMN razorpay_order_id VARCHAR(100),
    ADD COLUMN razorpay_payment_id VARCHAR(100);
