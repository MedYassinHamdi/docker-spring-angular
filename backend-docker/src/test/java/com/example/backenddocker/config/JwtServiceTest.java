package com.example.backenddocker.config;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
class JwtServiceTest {

    @Autowired
    private JwtService jwtService;

    @Test
    void shouldGenerateNonNullToken() {
        String token = jwtService.generateToken("testuser");
        assertNotNull(token, "Generated token should not be null");
        assertFalse(token.isBlank(), "Generated token should not be blank");
    }

    @Test
    void shouldExtractSameUsernameFromGeneratedToken() {
        String username = "alice";
        String token = jwtService.generateToken(username);
        String extracted = jwtService.extractUsername(token);
        assertEquals(username, extracted, "Extracted username should match the original");
    }

    @Test
    void shouldValidateTokenImmediatelyAfterGeneration() {
        String user = "bob";
        String token = jwtService.generateToken(user);
        assertTrue(jwtService.isTokenValid(token, user), "Token should be valid for the given user");
    }
}