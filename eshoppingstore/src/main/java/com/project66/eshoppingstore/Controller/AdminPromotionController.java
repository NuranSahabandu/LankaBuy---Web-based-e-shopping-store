package com.project66.eshoppingstore.Controller;

import com.project66.eshoppingstore.entity.Promotion;
import com.project66.eshoppingstore.Service.PromotionService;
import jakarta.validation.Valid;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

@Controller
@RequestMapping("/admin/promotions")
public class AdminPromotionController {

    private final PromotionService service;

    public AdminPromotionController(PromotionService service) {
        this.service = service;
    }

    // List all promotions
    @GetMapping
    public String list(Model model) {
        model.addAttribute("promotions", service.listAll());
        model.addAttribute("promotion", new Promotion()); // for create modal
        return "admin/promotions-list";
    }

    // Create new promotion with optional image upload
    @PostMapping
    public String create(@Valid @ModelAttribute("promotion") Promotion promotion,
                         BindingResult result,
                         @RequestParam(value = "imageFile", required = false) MultipartFile imageFile,
                         Model model) throws IOException {
        if (result.hasErrors()) {
            model.addAttribute("promotions", service.listAll());
            return "admin/promotions-list";
        }

        if (imageFile != null && !imageFile.isEmpty()) {
            promotion.setBannerImage(imageFile.getBytes());
            promotion.setBannerImageUrl(null); // prefer file if uploaded
        }

        service.save(promotion);
        return "redirect:/admin/promotions";
    }

    // Edit form
    @GetMapping("/{id}/edit")
    public String editForm(@PathVariable Long id, Model model) {
        Promotion p = service.get(id);
        if (p == null) return "redirect:/admin/promotions";
        model.addAttribute("promotion", p);
        return "admin/promotion-form";
    }

    // Update promotion with optional image upload/removal
    @PostMapping("/{id}")
    public String update(@PathVariable Long id,
                         @Valid @ModelAttribute("promotion") Promotion promotion,
                         BindingResult result,
                         @RequestParam(value = "imageFile", required = false) MultipartFile imageFile,
                         @RequestParam(value = "removeImage", required = false) boolean removeImage) throws IOException {
        if (result.hasErrors()) {
            return "admin/promotion-form";
        }

        Promotion existing = service.get(id);
        if (existing == null) return "redirect:/admin/promotions";

        // update fields
        existing.setName(promotion.getName());
        existing.setDescription(promotion.getDescription());
        existing.setPromoCode(promotion.getPromoCode());
        existing.setDiscountPercent(promotion.getDiscountPercent());
        existing.setStartDate(promotion.getStartDate());
        existing.setEndDate(promotion.getEndDate());
        existing.setActive(promotion.getActive());
        existing.setPriority(promotion.getPriority());
        existing.setBannerImageUrl(promotion.getBannerImageUrl());

        // handle image
        if (removeImage) {
            existing.setBannerImage(null);
            existing.setBannerImageUrl(null);
        } else if (imageFile != null && !imageFile.isEmpty()) {
            existing.setBannerImage(imageFile.getBytes());
            existing.setBannerImageUrl(null);
        }

        service.save(existing);
        return "redirect:/admin/promotions";
    }

    // Delete promotion
    @PostMapping("/{id}/delete")
    public String delete(@PathVariable Long id) {
        service.delete(id);
        return "redirect:/admin/promotions";
    }

    // Toggle promotion active status
    @PostMapping("/{id}/toggle")
    public String toggle(@PathVariable Long id) {
        service.toggleActive(id);
        return "redirect:/admin/promotions";
    }

    // Serve stored image from DB as HTTP response
    @GetMapping("/{id}/image")
    public ResponseEntity<byte[]> getImage(@PathVariable Long id) {
        Promotion p = service.get(id);
        if (p == null || p.getBannerImage() == null) {
            return ResponseEntity.notFound().build();
        }

        HttpHeaders headers = new HttpHeaders();
        headers.add("Content-Type", "image/jpeg"); // could also detect PNG vs JPEG
        return new ResponseEntity<>(p.getBannerImage(), headers, HttpStatus.OK);
    }
}
