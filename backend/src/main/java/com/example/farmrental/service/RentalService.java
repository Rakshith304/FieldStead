package com.example.farmrental.service;
import com.example.farmrental.entity.*; import com.example.farmrental.exception.MyException; import com.example.farmrental.repository.RentalRepository;
import java.math.BigDecimal; import java.time.LocalDate; import java.time.temporal.ChronoUnit; import java.util.List;
import org.springframework.http.HttpStatus; import org.springframework.stereotype.Service;
@Service
public class RentalService {
    private final RentalRepository repo; private final EquipmentService equipmentService;
    public RentalService(RentalRepository repo, EquipmentService equipmentService) { this.repo = repo; this.equipmentService = equipmentService; }
    // Days are inclusive. total = rate x days. synchronized stops two simultaneous requests passing the same availability check (single server).
    public synchronized Rental create(User farmer, Long equipmentId, LocalDate start, LocalDate end) {
        Equipment e = equipmentService.find(equipmentId);
        if (end.isBefore(start)) throw new MyException(HttpStatus.BAD_REQUEST, "End date must not be before start date");
        if (repo.countOverlapping(e.getId(), start, end) >= e.getQuantity()) throw new MyException(HttpStatus.CONFLICT, "Equipment is not available for these dates");
        BigDecimal total = e.getDailyRate().multiply(BigDecimal.valueOf(ChronoUnit.DAYS.between(start, end) + 1));
        return repo.save(new Rental(farmer, e, start, end, total));
    }
    public List<Rental> mine(Long id) { return repo.findByFarmerIdOrderByIdDesc(id); }
    public List<Rental> all() { return repo.findAllByOrderByIdDesc(); }
    public synchronized Rental change(User user, Long id, String action) {
        Rental r = repo.findById(id).orElseThrow(() -> new MyException(HttpStatus.NOT_FOUND, "Rental not found"));
        switch (action) {
            case "cancel" -> { if (!r.getFarmer().getId().equals(user.getId())) throw new MyException(HttpStatus.FORBIDDEN, "Not your request"); move(r, "PENDING", "CANCELLED"); }
            case "approve" -> { admin(user); move(r, "PENDING", "APPROVED"); }
            case "reject" -> { admin(user); move(r, "PENDING", "REJECTED"); }
            case "return" -> { admin(user); move(r, "APPROVED", "RETURNED"); }
            default -> throw new MyException(HttpStatus.BAD_REQUEST, "Unknown action");
        }
        return repo.save(r);
    }
    private void admin(User u) { if (!"ADMIN".equals(u.getRole())) throw new MyException(HttpStatus.FORBIDDEN, "Admin only"); }
    private void move(Rental r, String from, String to) {
        if (!from.equals(r.getStatus())) throw new MyException(HttpStatus.CONFLICT, "Cannot change a " + r.getStatus() + " request to " + to);
        r.setStatus(to);
    }
}
