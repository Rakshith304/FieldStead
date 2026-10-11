package com.example.farmrental.repository;
import com.example.farmrental.entity.User; import java.util.Optional; import org.springframework.data.jpa.repository.JpaRepository;
public interface UserRepository extends JpaRepository<User, Long> { Optional<User> findByEmail(String email); }
