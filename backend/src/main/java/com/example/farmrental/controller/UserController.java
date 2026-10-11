package com.example.farmrental.controller;
import com.example.farmrental.entity.User; import com.example.farmrental.service.UserService;
import com.example.farmrental.security.JwtService;
import jakarta.validation.Valid; import jakarta.validation.constraints.*; import org.springframework.http.HttpStatus; import org.springframework.web.bind.annotation.*;
@RestController @RequestMapping("/api/users")
public class UserController {
    public record RegisterRequest(@NotBlank(message = "Name is required") String name, @NotBlank(message = "Email is required") @Email(message = "Email is invalid") String email,
                                  @NotBlank(message = "Password is required") @Size(min = 12, max = 72, message = "Password must be 12 to 72 characters") String password) {}
    public record LoginRequest(@NotBlank(message = "Email is required") String email, @NotBlank(message = "Password is required") String password) {}
    public record AuthResponse(String token, Long id, String name, String email, String role) {}
    private final UserService service; private final JwtService jwt;
    public UserController(UserService s, JwtService jwt) { service = s; this.jwt = jwt; }
    @PostMapping("/register") @ResponseStatus(HttpStatus.CREATED) public User register(@Valid @RequestBody RegisterRequest r) { return service.register(r.name(), r.email(), r.password()); }
    @PostMapping("/login") public AuthResponse login(@Valid @RequestBody LoginRequest r) {
        User user = service.login(r.email().trim().toLowerCase(), r.password());
        return new AuthResponse(jwt.createToken(user), user.getId(), user.getName(), user.getEmail(), user.getRole());
    }
}
