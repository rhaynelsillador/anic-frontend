package com.sillador.strecs.brokerservice.authentication;

import java.util.Collection;
import java.util.Collections;
import java.util.Date;
import java.util.List;
import java.util.stream.Collectors;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.stereotype.Component;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import lombok.Setter;

@Component
public class JwtUtil {

    @Setter
    @Value("${jwt.key}")
    private String secret; // keep this safe

    public String generateToken(String username, Collection<? extends GrantedAuthority> roles) {
        return Jwts.builder()
                .setSubject(username)
                .claim("roles", roles.stream()
                    .map(GrantedAuthority::getAuthority)
                    .toList()
                )
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + 86400000)) // 1 day
                .signWith(Keys.hmacShaKeyFor(secret.getBytes()), SignatureAlgorithm.HS256)
                .compact();
    }

    public String extractUsername(String token) {
        return getClaims(token).getSubject();
    }

    public Collection<GrantedAuthority>  getAuth(String token) {    
        Object rolesObj = getClaims(token).get("roles");

       if (rolesObj instanceof List<?> rawList) {
        return rawList.stream()
            .filter(String.class::isInstance)
            .map(item -> new SimpleGrantedAuthority((String) item))
            .collect(Collectors.toList());

       }

    return Collections.emptyList();

    }

    public boolean isTokenValid(String token, String username) {
        return extractUsername(token).equals(username) && !isTokenExpired(token);
    }

    private boolean isTokenExpired(String token) {
        return getClaims(token).getExpiration().before(new Date());
    }

    private Claims getClaims(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(secret.getBytes())
                .build()
                .parseClaimsJws(token)
                .getBody();
    }
}
