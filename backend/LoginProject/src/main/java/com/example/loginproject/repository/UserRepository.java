package com.example.loginproject.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.example.loginproject.model.User;

public interface UserRepository extends JpaRepository<User, Integer> {

    User findFirstByEmailAndPassword(String email, String password);

    User findFirstByEmail(String email);
}