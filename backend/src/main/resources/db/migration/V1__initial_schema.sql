CREATE TABLE IF NOT EXISTS users (
    id BIGINT NOT NULL AUTO_INCREMENT,
    email VARCHAR(255) NOT NULL,
    name VARCHAR(255),
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(255),
    PRIMARY KEY (id),
    UNIQUE KEY uk_users_email (email)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS equipment (
    id BIGINT NOT NULL AUTO_INCREMENT,
    archived BIT(1) NOT NULL,
    category VARCHAR(255),
    daily_rate DECIMAL(38,2),
    name VARCHAR(255),
    quantity INT NOT NULL,
    PRIMARY KEY (id)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS rental (
    id BIGINT NOT NULL AUTO_INCREMENT,
    agreed_rate DECIMAL(38,2),
    created_at DATETIME(6),
    end_date DATE,
    start_date DATE,
    status VARCHAR(255),
    total_amount DECIMAL(38,2),
    equipment_id BIGINT NOT NULL,
    farmer_id BIGINT NOT NULL,
    PRIMARY KEY (id),
    KEY idx_rental_equipment_dates (equipment_id, start_date, end_date),
    KEY idx_rental_farmer (farmer_id),
    CONSTRAINT fk_rental_equipment FOREIGN KEY (equipment_id) REFERENCES equipment (id),
    CONSTRAINT fk_rental_farmer FOREIGN KEY (farmer_id) REFERENCES users (id)
) ENGINE=InnoDB;