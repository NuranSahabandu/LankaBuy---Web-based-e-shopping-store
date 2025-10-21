package com.project66.eshoppingstore.Controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class AuthController {

    // Serves the custom login page
    @GetMapping("/promotions_login")
    public String login() {
        return "promotions_login";
    }
}

