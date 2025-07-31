package com.Major.Online.Exam.Config;
import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;

import java.util.Date;
import java.util.Map;
import java.util.HashMap;
import java.security.Key;

import org.springframework.stereotype.Component;

@Component
public class JwtUtil {

    private final Key key = Keys.secretKeyFor(SignatureAlgorithm.HS256);

    public String generateOtpToken(String email, String otp, int expireSeconds) {
        Map<String, Object> claims = new HashMap<>();
        claims.put("email", email);
        claims.put("otp", otp);

        return Jwts.builder()
                .setClaims(claims)
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + expireSeconds * 1000L))
                .signWith(key)
                .compact();
    }

    public Claims validateAndExtractClaims(String token) {
        return Jwts.parser()
                .setSigningKey(key)
                .build()
                .parseClaimsJws(token)
                .getBody();
    }
}

