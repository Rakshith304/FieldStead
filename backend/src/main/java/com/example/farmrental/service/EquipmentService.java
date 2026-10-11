package com.example.farmrental.service;
import com.example.farmrental.entity.Equipment; import com.example.farmrental.exception.MyException; import com.example.farmrental.repository.EquipmentRepository;
import org.springframework.data.domain.Page; import org.springframework.data.domain.PageRequest; import org.springframework.http.HttpStatus; import org.springframework.stereotype.Service;
@Service
public class EquipmentService {
    private final EquipmentRepository repo; public EquipmentService(EquipmentRepository repo) { this.repo = repo; }
    public Page<Equipment> all(int page, int size, String search, String category) {
        return repo.searchAvailable(search.trim(), category.trim(), PageRequest.of(page, size));
    }
    public Equipment find(Long id) { return repo.findById(id).filter(e -> !e.isArchived()).orElseThrow(() -> new MyException(HttpStatus.NOT_FOUND, "Equipment not found")); }
    public Equipment add(Equipment e) { return repo.save(e); }
    public Equipment update(Long id, Equipment in) { Equipment e = find(id); e.setName(in.getName()); e.setCategory(in.getCategory()); e.setDailyRate(in.getDailyRate()); e.setQuantity(in.getQuantity()); return repo.save(e); }
    public void archive(Long id) { Equipment e = find(id); e.setArchived(true); repo.save(e); }
}
