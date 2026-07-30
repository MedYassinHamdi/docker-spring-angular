package com.example.backenddocker.config;

import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

class JwtServiceTest {

    // Hardcoded test secret (must be a valid Base64 string for HS256)
    private static final String TEST_SECRET = "404E635266556A586E3272357538782F413F4428472B4B6250645367566B5970337336763979244226452948404D635166546A576E5A7234753778214125442A47";
    private static final long TEST_EXPIRATION = 86400000; // 24 hours

    private final JwtService jwtService = new JwtService(TEST_SECRET, TEST_EXPIRATION);

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
