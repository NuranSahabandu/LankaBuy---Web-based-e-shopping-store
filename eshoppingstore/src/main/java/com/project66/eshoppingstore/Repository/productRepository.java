package com.project66.eshoppingstore.Repository;

import com.project66.eshoppingstore.entity.Product;
import org.springframework.data.jpa.repository.JpaRepository;

public interface productRepository extends JpaRepository <Product , String> {
}
