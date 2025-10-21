package com.project66.eshoppingstore.Controller;

import com.project66.eshoppingstore.Service.PromotionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
@RequestMapping("/Promotions")   // now under /Promotions path
public class PromotionHomeController {

    @Autowired
    private PromotionService promotionService;

    // Public promotions homepage
    @GetMapping
    public String home(Model model) {
        model.addAttribute("promotions", promotionService.listActive());
        return "promotions_home"; // loads templates/promotions_home.html
    }
}
