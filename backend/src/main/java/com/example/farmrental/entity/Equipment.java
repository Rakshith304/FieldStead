package com.example.farmrental.entity;
import jakarta.persistence.*; import java.math.BigDecimal;
@Entity
public class Equipment {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY) private Long id;
    private String name; private String category; private BigDecimal dailyRate; private int quantity; private boolean archived = false;
    @Column(columnDefinition = "TEXT") private String description;
    @Column(name = "equipment_uses", columnDefinition = "TEXT") private String uses;
    private String imageUrl;
    public Equipment() {}
    public Equipment(String n, String c, BigDecimal r, int q) { name = n; category = c; dailyRate = r; quantity = q; }
    public Long getId() { return id; } public String getName() { return name; } public String getCategory() { return category; }
    public BigDecimal getDailyRate() { return dailyRate; } public int getQuantity() { return quantity; } public boolean isArchived() { return archived; }
    public String getDescription() { return description; } public String getUses() { return uses; } public String getImageUrl() { return imageUrl; }
    public void setName(String n) { name = n; } public void setCategory(String c) { category = c; } public void setDailyRate(BigDecimal r) { dailyRate = r; }
    public void setQuantity(int q) { quantity = q; } public void setArchived(boolean a) { archived = a; }
    public void setDescription(String d) { description = d; } public void setUses(String u) { uses = u; } public void setImageUrl(String i) { imageUrl = i; }
}
