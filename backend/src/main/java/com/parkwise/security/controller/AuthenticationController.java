package com.parkwise.security.controller;

import com.parkwise.integration.entity.User;
import com.parkwise.security.JwtService;
import com.parkwise.security.Web3AuthenticationToken;
import com.parkwise.security.dto.AuthResponse;
import com.parkwise.security.dto.LoginRequest;
import com.parkwise.security.dto.RegisterRequest;
import com.parkwise.security.dto.Web3LoginRequest;
import com.parkwise.security.service.AuthenticationService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.web.bind.annotation.*;

/**
 * Authentication Controller
 * Handles both traditional JWT and Web3 wallet authentication
 */
@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@Tag(name = "Authentication", description = "User authentication endpoints")
public class AuthenticationController {

    private final AuthenticationService authService;
    private final AuthenticationManager authenticationManager;
    private final JwtService jwtService;

    @PostMapping("/register")
    @Operation(summary = "Register new user", description = "Create a new user account with email/password")
    public ResponseEntity<AuthResponse> register(@RequestBody RegisterRequest request) {
        return ResponseEntity.ok(authService.register(request));
    }

    @PostMapping("/login")
    @Operation(summary = "Login with email/password", description = "Authenticate using email and password")
    public ResponseEntity<AuthResponse> login(@RequestBody LoginRequest request) {
        return ResponseEntity.ok(authService.login(request));
    }

    @PostMapping("/web3/login")
    @Operation(summary = "Login with Web3 wallet", description = "Authenticate using wallet signature")
    public ResponseEntity<AuthResponse> web3Login(@RequestBody Web3LoginRequest request) {
        try {
            // Create authentication token
            Web3AuthenticationToken authToken = new Web3AuthenticationToken(
                request.getWalletAddress(),
                request.getMessage(),
                request.getSignature()
            );

            // Authenticate
            authenticationManager.authenticate(authToken);

            // Get or create user
            User user = authService.getOrCreateWeb3User(request.getWalletAddress());

            // Generate JWT
            String jwt = jwtService.generateToken(user);
            String refreshToken = jwtService.generateRefreshToken(user);

            return ResponseEntity.ok(AuthResponse.builder()
                .accessToken(jwt)
                .refreshToken(refreshToken)
                .tokenType("Bearer")
                .expiresIn(86400L) // 24 hours
                .user(AuthResponse.UserInfo.builder()
                    .id(user.getId())
                    .email(user.getEmail())
                    .walletAddress(user.getWalletAddress())
                    .role(user.getRole().name())
                    .build())
                .build());

        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @PostMapping("/web3/register")
    @Operation(summary = "Register with Web3 wallet", description = "Create account using wallet address")
    public ResponseEntity<AuthResponse> web3Register(@RequestBody Web3LoginRequest request) {
        return ResponseEntity.ok(authService.registerWeb3User(request));
    }

    @PostMapping("/refresh")
    @Operation(summary = "Refresh access token", description = "Get new access token using refresh token")
    public ResponseEntity<AuthResponse> refreshToken(@RequestHeader("Authorization") String refreshToken) {
        String token = refreshToken.substring(7);
        return ResponseEntity.ok(authService.refreshToken(token));
    }

    @GetMapping("/verify")
    @Operation(summary = "Verify token", description = "Check if JWT token is valid")
    public ResponseEntity<Boolean> verifyToken(@RequestHeader("Authorization") String token) {
        try {
            String jwt = token.substring(7);
            jwtService.extractUsername(jwt); // Will throw exception if invalid
            return ResponseEntity.ok(true);
        } catch (Exception e) {
            return ResponseEntity.ok(false);
        }
    }
}
