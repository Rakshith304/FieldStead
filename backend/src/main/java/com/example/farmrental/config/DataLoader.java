package com.example.farmrental.config;
import com.example.farmrental.entity.User; import com.example.farmrental.repository.UserRepository;
import org.springframework.beans.factory.annotation.Value; import org.springframework.boot.CommandLineRunner; import org.springframework.stereotype.Component;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
@Component
public class DataLoader implements CommandLineRunner {
    private final UserRepository users;
    @Value("${app.demo-seed-users:true}") private boolean seedDemoUsers;
    public DataLoader(UserRepository u) { users = u; }
    public void run(String... args) {
        if (seedDemoUsers && users.count() == 0) {
            BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();
            users.save(new User("Admin", "admin@gmail.com", encoder.encode("admin123"), "ADMIN"));
            users.save(new User("Sita", "sita@gmail.com", encoder.encode("farmer123"), "FARMER"));
        }
    }
}
