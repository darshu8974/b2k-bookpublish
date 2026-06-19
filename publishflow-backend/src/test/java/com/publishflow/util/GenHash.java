package com.publishflow.util;

import org.junit.jupiter.api.Test;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

public class GenHash {
    @Test
    void printHash() {
        String hash = new BCryptPasswordEncoder(12).encode("Admin@1234");
        System.out.println("=== ADMIN HASH ===");
        System.out.println(hash);
        System.out.println("==================");
    }
}
