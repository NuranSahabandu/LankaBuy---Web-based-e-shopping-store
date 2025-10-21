package com.project66.eshoppingstore.Service;

import com.project66.eshoppingstore.entity.Promotion;
import com.project66.eshoppingstore.Repository.PromotionRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class PromotionService {
    private final PromotionRepository repo;

    public PromotionService(PromotionRepository repo) {
        this.repo = repo;
    }

    public List<Promotion> listAll() {
        return repo.findAllByOrderByPriorityDesc();
    }

    public List<Promotion> listActive() {
        return repo.findByActiveTrueOrderByPriorityDesc();
    }

    public Promotion save(Promotion p) {
        return repo.save(p);
    }

    public Promotion get(Long id) {
        return repo.findById(id).orElse(null);
    }

    public void delete(Long id) {
        repo.deleteById(id);
    }

    public void toggleActive(Long id) {
        Optional<Promotion> opt = repo.findById(id);
        opt.ifPresent(p -> {
            p.setActive(p.getActive() == null ? Boolean.TRUE : !p.getActive());
            repo.save(p);
        });
    }
}
