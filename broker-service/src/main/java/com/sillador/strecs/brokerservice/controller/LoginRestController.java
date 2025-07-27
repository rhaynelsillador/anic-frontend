package com.sillador.strecs.brokerservice.controller;

import com.sillador.strecs.brokerservice.authentication.JwtUtil;
import com.sillador.strecs.brokerservice.dto.BaseResponse;
import com.sillador.strecs.brokerservice.dto.LoginInfo;
import com.sillador.strecs.brokerservice.dto.ResponseCode;

import jakarta.servlet.http.HttpServletRequest;

import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class LoginRestController {

    private final AuthenticationManager authenticationManager;
    @Autowired
    private JwtUtil jwtUtil;

    public LoginRestController(AuthenticationManager authenticationManager){
        this.authenticationManager = authenticationManager;

    }

    @PostMapping("/login")
    public BaseResponse doLogin(@RequestBody LoginInfo loginInfo, HttpServletRequest request) {
        try {
            Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(loginInfo.getIdentifier(), loginInfo.getPassword())
            );

            System.out.println("auth.getPrincipal() : " + authentication.getPrincipal());
            System.out.println("auth.getAuthorities() : " + authentication.getAuthorities());
            SecurityContextHolder.getContext().setAuthentication(authentication);

            String jwt = jwtUtil.generateToken(loginInfo.getIdentifier(), authentication.getAuthorities());

            
            // request.getSession(true); // Start session if needed
            return new BaseResponse().build(jwt).success();
        } catch (AuthenticationException ex) {
            return new BaseResponse().build(ResponseCode.ERROR, "Login failed");
        }
    }

    @GetMapping("/loginStatus")
    public Object loginStatus(HttpServletRequest request){
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || !auth.isAuthenticated()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        return ResponseEntity.ok(true);

    }

    @GetMapping("/logout")
    public Object doLogout(HttpServletRequest request){
        request.getSession().invalidate();
        
        return new BaseResponse().success();
    }
}
