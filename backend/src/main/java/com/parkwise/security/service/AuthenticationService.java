package com.parkwise.security.service;

import com.parkwise.integration.entity.User;
import com.parkwise.integration.repository.UserRepository;
import com.parkwise.security.JwtService;
import com.parkwise.security.dto.AuthResponse;
import com.parkwise.security.dto.LoginRequest;
import com.parkwise.security.dto.RegisterRequest;
import com.parkwise.security.dto.Web3LoginRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Optional;

/**
 * Authentication Service
 * Handles user registration, login, and JWT token generation
 */
@Service
@RequiredArgsConstructor
public class AuthenticationService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;

    @Transactional
    public AuthResponse register(RegisterRequest request) {
        // Check if email already exists
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email already registered");
        }

        // Create new user
        User user = User.builder()
            .email(request.getEmail())
            .password(passwordEncoder.encode(request.getPassword()))
            .name(request.getName())
            .walletAddress(request.getWalletAddress())
            .role(request.getRole() != null ? User.Role.valueOf(request.getRole()) : User.Role.DONOR)
            .enabled(true)
            .createdAt(LocalDateTime.now())
            .build();

        userRepository.save(user);

        // Generate tokens
        String jwt = jwtService.generateToken(user);
        String refreshToken = jwtService.generateRefreshToken(user);

        return buildAuthResponse(user, jwt, refreshToken);
    }

    @Transactional
    public AuthResponse login(LoginRequest request) {
        // Authenticate
        authenticationManager.authenticate(
            new UsernamePasswordAuthenticationToken(
                request.getEmail(),
                request.getPassword()
            )
        );

        // Get user
        User user = userRepository.findByEmail(request.getEmail())
            .orElseThrow(() -> new RuntimeException("User not found"));

        // Generate tokens
        String jwt = jwtService.generateToken(user);
        String refreshToken = jwtService.generateRefreshToken(user);

        return buildAuthResponse(user, jwt, refreshToken);
    }

    @Transactional
    public User getOrCreateWeb3User(String walletAddress) {
        Optional<User> existingUser = userRepository.findByWalletAddress(walletAddress);

        if (existingUser.isPresent()) {
            return existingUser.get();
        }

        // Auto-create user for wallet
        User newUser = User.builder()
            .walletAddress(walletAddress)
            .email(walletAddress + "@wallet.parkwise.com") // Dummy email
            .name("Wallet User")
            .role(User.Role.DONOR)
            .enabled(true)
            .createdAt(LocalDateTime.now())
            .build();

        return userRepository.save(newUser);
    }

    @Transactional
    public AuthResponse registerWeb3User(Web3LoginRequest request) {
        // Check if wallet already registered
        if (userRepository.existsByWalletAddress(request.getWalletAddress())) {
            throw new RuntimeException("Wallet already registered");
        }

        // Create new user
        User user = User.builder()
            .walletAddress(request.getWalletAddress())
            .email(request.getWalletAddress() + "@wallet.parkwise.com")
            .name(request.getName() != null ? request.getName() : "Wallet User")
            .role(User.Role.DONOR)
            .enabled(true)
            .createdAt(LocalDateTime.now())
            .build();

        userRepository.save(user);

        // Generate tokens
        String jwt = jwtService.generateToken(user);
        String refreshToken = jwtService.generateRefreshToken(user);

        return buildAuthResponse(user, jwt, refreshToken);
    }

    @Transactional(readOnly = true)
    public AuthResponse refreshToken(String refreshToken) {
        String username = jwtService.extractUsername(refreshToken);
        User user = userRepository.findByEmail(username)
            .orElseThrow(() -> new RuntimeException("User not found"));

        if (!jwtService.isTokenValid(refreshToken, user)) {
            throw new RuntimeException("Invalid refresh token");
        }

        String newAccessToken = jwtService.generateToken(user);
        String newRefreshToken = jwtService.generateRefreshToken(user);

        return buildAuthResponse(user, newAccessToken, newRefreshToken);
    }

    private AuthResponse buildAuthResponse(User user, String accessToken, String refreshToken) {
        return AuthResponse.builder()
            .accessToken(accessToken)
            .refreshToken(refreshToken)
            .tokenType("Bearer")
            .expiresIn(86400L) // 24 hours in seconds
            .user(AuthResponse.UserInfo.builder()
                .id(user.getId())
                .email(user.getEmail())
                .name(user.getName())
                .walletAddress(user.getWalletAddress())
                .role(user.getRole().name())
                .build())
            .build();
    }
}
