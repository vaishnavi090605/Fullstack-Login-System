package com.example.loginproject.service;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.List;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.example.loginproject.model.User;
import com.example.loginproject.repository.UserRepository;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    public User saveNewUser(User user) {
        User existingUser =
                userRepository.findFirstByEmail(user.getEmail());

        if (existingUser != null) {
            return null;
        }

        user.setPassword(
                passwordEncoder.encode(user.getPassword())
        );

        return userRepository.save(user);
    }

    public User authUserEmailAndPassword(User user) {
        User existingUser =
                userRepository.findFirstByEmail(user.getEmail());

        if (
            existingUser != null
            && passwordEncoder.matches(
                    user.getPassword(),
                    existingUser.getPassword()
            )
        ) {
            return existingUser;
        }

        return null;
    }

    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    public User updateProfile(User updatedUser) {
        User existingUser =
                userRepository.findFirstByEmail(
                        updatedUser.getEmail()
                );

        if (existingUser != null) {
            existingUser.setName(updatedUser.getName());
            return userRepository.save(existingUser);
        }

        return null;
    }

    public User uploadProfileImage(
            String email,
            MultipartFile file
    ) throws IOException {

        User existingUser =
                userRepository.findFirstByEmail(email);

        if (existingUser == null) {
            return null;
        }

        if (file == null || file.isEmpty()) {
            throw new IllegalArgumentException(
                    "Please select an image"
            );
        }

        String contentType = file.getContentType();

        if (
            contentType == null
            || !contentType.startsWith("image/")
        ) {
            throw new IllegalArgumentException(
                    "Only image files are allowed"
            );
        }

        Path uploadDirectory = Paths.get("uploads");

        if (!Files.exists(uploadDirectory)) {
            Files.createDirectories(uploadDirectory);
        }

        String originalName = file.getOriginalFilename();
        String extension = "";

        if (
            originalName != null
            && originalName.contains(".")
        ) {
            extension = originalName.substring(
                    originalName.lastIndexOf(".")
            );
        }

        String fileName =
                UUID.randomUUID().toString() + extension;

        Path destination =
                uploadDirectory.resolve(fileName);

        Files.copy(
                file.getInputStream(),
                destination,
                StandardCopyOption.REPLACE_EXISTING
        );

        existingUser.setProfileImage(
                "/uploads/" + fileName
        );

        return userRepository.save(existingUser);
    }

    public boolean changePassword(
            String email,
            String oldPassword,
            String newPassword
    ) {
        User existingUser =
                userRepository.findFirstByEmail(email);

        if (existingUser == null) {
            return false;
        }

        boolean oldPasswordCorrect =
                passwordEncoder.matches(
                        oldPassword,
                        existingUser.getPassword()
                );

        if (!oldPasswordCorrect) {
            return false;
        }

        existingUser.setPassword(
                passwordEncoder.encode(newPassword)
        );

        userRepository.save(existingUser);

        return true;
    }
    public boolean forgotPassword(
            String email,
            String newPassword
    ) {
        User existingUser =
                userRepository.findFirstByEmail(email);

        if (existingUser == null) {
            return false;
        }

        if (newPassword == null || newPassword.length() < 4) {
            return false;
        }

        existingUser.setPassword(
                passwordEncoder.encode(newPassword)
        );

        userRepository.save(existingUser);

        return true;
    }
}
