package com.project66.eshoppingstore.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import java.time.LocalDate;

@Entity
@Table(name = "promotions")
public class Promotion {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank
    private String name;

    private String description;

    private String promoCode; // optional, for coupon-style deals

    @Min(0)
    @Max(100)
    private Integer discountPercent; // 0–100

    private LocalDate startDate; // becomes active on this date (inclusive)
    private LocalDate endDate;   // expires after this date (inclusive)

    private Boolean active = Boolean.TRUE; // quick on/off toggle

    // Option 1: store a link (optional)
    private String bannerImageUrl;

    // Option 2: store the actual file inside DB
    @Lob
    @Column(columnDefinition = "BLOB")
    private byte[] bannerImage;

    @Min(1)
    @Max(5)
    private Integer priority = 1; // now between 1–5

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getPromoCode() { return promoCode; }
    public void setPromoCode(String promoCode) { this.promoCode = promoCode; }

    public Integer getDiscountPercent() { return discountPercent; }
    public void setDiscountPercent(Integer discountPercent) { this.discountPercent = discountPercent; }

    public LocalDate getStartDate() { return startDate; }
    public void setStartDate(LocalDate startDate) { this.startDate = startDate; }

    public LocalDate getEndDate() { return endDate; }
    public void setEndDate(LocalDate endDate) { this.endDate = endDate; }

    public Boolean getActive() { return active; }
    public void setActive(Boolean active) { this.active = active; }

    public String getBannerImageUrl() { return bannerImageUrl; }
    public void setBannerImageUrl(String bannerImageUrl) { this.bannerImageUrl = bannerImageUrl; }

    public byte[] getBannerImage() { return bannerImage; }
    public void setBannerImage(byte[] bannerImage) { this.bannerImage = bannerImage; }

    public Integer getPriority() { return priority; }
    public void setPriority(Integer priority) { this.priority = priority; }

    // Helper Methods

    /** Check if promotion is active today */
    public boolean isCurrentlyActive() {
        if (active == null || !active) return false;
        LocalDate today = LocalDate.now();
        boolean startsOk = (startDate == null) || !today.isBefore(startDate);
        boolean endsOk = (endDate == null) || !today.isAfter(endDate);
        return startsOk && endsOk;
    }

    /** Decide which image to display: DB image takes priority over URL */
    public String getEffectiveImagePath() {
        if (this.bannerImage != null && this.id != null) {
            // Return endpoint serving the blob (handled in AdminPromotionController)
            return "/admin/promotions/" + this.id + "/image";
        } else if (this.bannerImageUrl != null && !this.bannerImageUrl.isBlank()) {
            return this.bannerImageUrl;
        }
        return null; // no image
    }
}
