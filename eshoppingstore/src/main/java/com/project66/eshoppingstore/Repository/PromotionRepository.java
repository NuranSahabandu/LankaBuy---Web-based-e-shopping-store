package com.project66.eshoppingstore.Repository;

import com.project66.eshoppingstore.entity.Promotion;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface PromotionRepository extends JpaRepository<Promotion, Long> {
    List<Promotion> findAllByOrderByPriorityDesc();
    List<Promotion> findByActiveTrueOrderByPriorityDesc();
}
