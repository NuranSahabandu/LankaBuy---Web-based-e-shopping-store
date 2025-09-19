package com.project66.eshoppingstore.Controller;

import com.project66.eshoppingstore.Service.productService;
import com.project66.eshoppingstore.entity.Product;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/products")
public class ProductController {

    productService productService;

    public ProductController(productService productService) {
        this.productService = productService;
    }

    //Read specific product details.
    @GetMapping("/{productId}")
    public Product getProductDetails(@PathVariable("productId") String productId) {
        return productService.findProductById(productId);
    }

    //Read all product details in DB.
    @GetMapping()
    public List<Product> getAllProductDetails() {
        return productService.getAllProducts();
    }

    @PostMapping("/create")
    public String createProduct(@RequestBody Product product) {
        productService.createProduct(product);
        return "Product created successfully";
    }

    @PutMapping("/update")
    public String updateProduct(@RequestBody Product product) {
        productService.updateProduct(product);
        return "Product updated successfully";
    }

    @DeleteMapping("/delete/{productId}")
    public String deleteProduct(@PathVariable("productId") String productId) {
        productService.deleteProduct(productId);
        return "Product deleted successfully";
    }

}
