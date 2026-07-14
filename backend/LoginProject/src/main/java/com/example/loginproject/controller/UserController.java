package com.example.loginproject.controller;

import java.io.IOException;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.example.loginproject.model.User;
import com.example.loginproject.service.UserService;

@RestController

public class UserController {

    @Autowired
    private UserService userService;

    @PostMapping("/register")
    public User register(@RequestBody User user) {
        return userService.saveNewUser(user);
    }

    @PostMapping("/login")
    public User login(@RequestBody User user) {
        return userService.authUserEmailAndPassword(user);
    }

    @GetMapping("/allUsers")
    public List<User> getAllUsers() {
        return userService.getAllUsers();
    }

    @PutMapping("/update-profile")
    public User updateProfile(@RequestBody User user) {
        return userService.updateProfile(user);
    }

    @PostMapping(
        value = "/upload-profile-image",
        consumes = MediaType.MULTIPART_FORM_DATA_VALUE
    )
    public User uploadProfileImage(
            @RequestParam("email") String email,
            @RequestParam("file") MultipartFile file
    ) throws IOException {

        return userService.uploadProfileImage(
                email,
                file
        );
    }

    @PutMapping("/change-password")
    public boolean changePassword(
            @RequestBody Map<String, String> request
    ) {
        String email = request.get("email");
        String oldPassword = request.get("oldPassword");
        String newPassword = request.get("newPassword");

        return userService.changePassword(
                email,
                oldPassword,
                newPassword
        );
    }
    @PutMapping("/forgot-password")
    public boolean forgotPassword(@RequestBody Map<String, String> request) {

        String email = request.get("email");
        String newPassword = request.get("newPassword");

        return userService.forgotPassword(email, newPassword);
    }
}