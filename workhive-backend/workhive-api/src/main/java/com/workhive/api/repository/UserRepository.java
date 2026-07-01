package com.workhive.api.repository;

import com.workhive.api.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    
    // Custom query helper to find a user by their email (great for email-based login)
    Optional<User> findByEmail(String email);
    
    // Custom query helper to find a user by their username (needed for our current login endpoint)
    Optional<User> findByUsername(String username);
    
    // Custom query helper to check if a username already exists during signup
    boolean existsByUsername(String username);
    
    // Custom query helper to check if an email already exists during signup
    boolean existsByEmail(String email);
}