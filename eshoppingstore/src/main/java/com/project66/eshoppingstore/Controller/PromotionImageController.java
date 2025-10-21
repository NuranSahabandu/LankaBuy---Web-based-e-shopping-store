package com.project66.eshoppingstore.Controller;

import com.project66.eshoppingstore.Service.PromotionService;
import com.project66.eshoppingstore.entity.Promotion;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

@Controller
public class PromotionImageController {

    private final PromotionService service;

    public PromotionImageController(PromotionService service) {
        this.service = service;
    }

    // Public endpoint (not inside /admin)
    @GetMapping("/promotions/{id}/image")
    public ResponseEntity<byte[]> getImage(@PathVariable Long id) {
        Promotion promo = service.get(id);
        if (promo != null && promo.getBannerImage() != null) {
            HttpHeaders headers = new HttpHeaders();
            headers.add("Content-Type", "image/jpeg"); // or detect PNG/JPEG dynamically
            return new ResponseEntity<>(promo.getBannerImage(), headers, HttpStatus.OK);
        }
        return new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }
}
