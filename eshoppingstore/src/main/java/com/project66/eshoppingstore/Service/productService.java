package com.project66.eshoppingstore.Service;

import com.project66.eshoppingstore.entity.Product;

import java.util.List;

public interface productService {
    public String createProduct(Product product);
    public String updateProduct(Product product);
    public String deleteProduct(String productId);
    public Product findProductById(String productId);
    public List<Product> getAllProducts();
}
