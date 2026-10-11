package com.example.farmrental.controller;
import com.example.farmrental.entity.Rental; import com.example.farmrental.service.*;
import jakarta.validation.Valid; import jakarta.validation.constraints.*; import java.time.LocalDate; import java.util.List;
import org.springframework.http.HttpStatus; import org.springframework.web.bind.annotation.*;
@RestController @RequestMapping("/api/rentals")
public class RentalController {
    public record RentalRequest(@NotNull(message = "Equipment is required") Long equipmentId, @NotNull(message = "Start date is required") @FutureOrPresent(message = "Start date cannot be in the past") LocalDate startDate,
                                @NotNull(message = "End date is required") @FutureOrPresent(message = "End date cannot be in the past") LocalDate endDate) {}
    private final RentalService service; private final UserService users;
    public RentalController(RentalService s, UserService u) { service = s; users = u; }
    @PostMapping @ResponseStatus(HttpStatus.CREATED)
    public Rental create(@org.springframework.security.core.annotation.AuthenticationPrincipal Long uid, @Valid @RequestBody RentalRequest r) { return service.create(users.requireUser(uid), r.equipmentId(), r.startDate(), r.endDate()); }
    @GetMapping("/my") public List<Rental> mine(@org.springframework.security.core.annotation.AuthenticationPrincipal Long uid) { return service.mine(users.requireUser(uid).getId()); }
    @GetMapping public List<Rental> all(@org.springframework.security.core.annotation.AuthenticationPrincipal Long uid) { users.requireAdmin(uid); return service.all(); }
    @PatchMapping("/{id}/{action}")
    public Rental change(@org.springframework.security.core.annotation.AuthenticationPrincipal Long uid, @PathVariable Long id, @PathVariable String action) { return service.change(users.requireUser(uid), id, action); }
}
