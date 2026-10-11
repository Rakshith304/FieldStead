package com.example.farmrental.controller;
import com.example.farmrental.entity.Equipment; import com.example.farmrental.service.*;
import com.example.farmrental.exception.MyException;
import jakarta.validation.Valid; import jakarta.validation.constraints.*; import java.math.BigDecimal;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus; import org.springframework.web.bind.annotation.*;
@RestController @RequestMapping("/api/equipment")
public class EquipmentController {
    public record EquipmentRequest(@NotBlank(message = "Name is required") @Size(max = 120) String name, @NotBlank(message = "Category is required") @Size(max = 80) String category,
                                   @NotNull(message = "Rate is required") @Positive(message = "Rate must be positive") BigDecimal dailyRate, @Min(value = 0, message = "Quantity cannot be negative") int quantity,
                                   @NotBlank(message = "Description is required") @Size(max = 2000) String description, @NotBlank(message = "Uses are required") @Size(max = 2000) String uses,
                                   @Size(max = 500) String imageUrl) {}
    private final EquipmentService service; private final UserService users;
    public EquipmentController(EquipmentService s, UserService u) { service = s; users = u; }
    @GetMapping public Page<Equipment> all(@RequestParam(defaultValue = "0") int page, @RequestParam(defaultValue = "20") int size,
                                          @RequestParam(defaultValue = "") String search, @RequestParam(defaultValue = "") String category) {
        if (page < 0 || size < 1 || size > 100) throw new MyException(HttpStatus.BAD_REQUEST, "Page must be non-negative and size must be between 1 and 100");
        if (search.length() > 120 || category.length() > 80) throw new MyException(HttpStatus.BAD_REQUEST, "Search and category filters are too long");
        return service.all(page, size, search, category);
    }
    @GetMapping("/{id}") public Equipment one(@PathVariable Long id) { return service.find(id); }
    @PostMapping @ResponseStatus(HttpStatus.CREATED)
    public Equipment add(@org.springframework.security.core.annotation.AuthenticationPrincipal Long uid, @Valid @RequestBody EquipmentRequest r) { users.requireAdmin(uid); return service.add(toEquipment(r)); }
    @PutMapping("/{id}")
    public Equipment update(@org.springframework.security.core.annotation.AuthenticationPrincipal Long uid, @PathVariable Long id, @Valid @RequestBody EquipmentRequest r) { users.requireAdmin(uid); return service.update(id, toEquipment(r)); }
    @DeleteMapping("/{id}") @ResponseStatus(HttpStatus.NO_CONTENT)
    public void archive(@org.springframework.security.core.annotation.AuthenticationPrincipal Long uid, @PathVariable Long id) { users.requireAdmin(uid); service.archive(id); }
    private Equipment toEquipment(EquipmentRequest request) {
        Equipment equipment = new Equipment(request.name(), request.category(), request.dailyRate(), request.quantity());
        equipment.setDescription(request.description()); equipment.setUses(request.uses()); equipment.setImageUrl(request.imageUrl());
        return equipment;
    }
}
