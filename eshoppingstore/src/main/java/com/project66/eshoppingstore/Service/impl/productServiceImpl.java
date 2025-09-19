package com.project66.eshoppingstore.Service.impl;

import com.project66.eshoppingstore.Repository.productRepository;
import com.project66.eshoppingstore.Service.productService;
import com.project66.eshoppingstore.entity.Product;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class productServiceImpl implements productService {

    productRepository productRepository;

    public productServiceImpl(productRepository productRepository) {
        this.productRepository = productRepository;
    }

    @Override
    public String createProduct(Product product) {
        productRepository.save(product);
        return "product created successfully";
    }

    @Override
    public String updateProduct(Product product) {
        //More Business logic
        productRepository.save(product);
        return "product updated successfully";
    }

    @Override
    public String deleteProduct(String productId) {
        //More Business logic
        productRepository.deleteById(productId);
        return "product deleted successfully";
    }

    @Override
    public Product findProductById(String productId) {
        //More Business logic
        return productRepository.findById(productId).get();
    }

    @Override
    public List<Product> getAllProducts() {
        return productRepository.findAll();
    }
}
