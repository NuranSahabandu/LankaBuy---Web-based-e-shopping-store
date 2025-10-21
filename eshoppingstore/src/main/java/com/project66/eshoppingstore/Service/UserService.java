package com.project66.eshoppingstore.Service;

import com.project66.eshoppingstore.Repository.UserRepository;
import com.project66.eshoppingstore.entity.User;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class UserService {

    private final UserRepository userRepository;

    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    /**
     * Register a new user
     */
    public String registerUser(User user) {
        try {
            // Check if username already exists
            if (userRepository.existsByUsername(user.getUsername())) {
                return "Username already exists!";
            }

            // Check if email already exists
            if (userRepository.existsByEmail(user.getEmail())) {
                return "Email already exists!";
            }

            // Validate input
            if (user.getUsername() == null || user.getUsername().trim().isEmpty()) {
                return "Username cannot be empty!";
            }

            if (user.getEmail() == null || user.getEmail().trim().isEmpty()) {
                return "Email cannot be empty!";
            }

            if (user.getPassword() == null || user.getPassword().length() < 6) {
                return "Password must be at least 6 characters!";
            }

            if (user.getFullName() == null || user.getFullName().trim().isEmpty()) {
                return "Full name cannot be empty!";
            }

            // For production, you should hash the password here
            // For now, we'll store it as plain text (NOT SECURE - just for learning)
            // TODO: Add password hashing in production

            // Save user to database
            userRepository.save(user);
            return "Registration successful!";

        } catch (Exception e) {
            return "Registration failed: " + e.getMessage();
        }
    }

    /**
     * Login user
     */
    public User loginUser(String usernameOrEmail, String password) {
        try {
            // Find user by username or email
            Optional<User> userOptional = userRepository.findByUsernameOrEmail(usernameOrEmail, usernameOrEmail);

            if (userOptional.isPresent()) {
                User user = userOptional.get();

                // Check password (in production, you'd compare hashed passwords)
                if (user.getPassword().equals(password)) {
                    return user; // Login successful
                }
            }

            return null; // Login failed

        } catch (Exception e) {
            System.out.println("Login error: " + e.getMessage());
            return null;
        }
    }

    /**
     * Find user by ID
     */
    public User findUserById(Long id) {
        return userRepository.findById(id).orElse(null);
    }

    /**
     * Find user by username
     */
    public User findUserByUsername(String username) {
        return userRepository.findByUsername(username).orElse(null);
    }

    /**
     * Check if user exists
     */
    public boolean userExists(String username) {
        return userRepository.existsByUsername(username);
    }

    /**
     * Update user profile
     */
    public String updateUser(User user) {
        try {
            if (userRepository.existsById(user.getId())) {
                userRepository.save(user);
                return "Profile updated successfully!";
            } else {
                return "User not found!";
            }
        } catch (Exception e) {
            return "Update failed: " + e.getMessage();
        }
    }
}
