package com.parkwise.security;

import java.util.Collection;

import org.springframework.security.authentication.AbstractAuthenticationToken;
import org.springframework.security.core.GrantedAuthority;

import lombok.Getter;

/**
 * Web3 Authentication Token
 * Represents an authentication request or response using wallet credentials
 */
@Getter
public class Web3AuthenticationToken extends AbstractAuthenticationToken {

    private final String walletAddress;
    private final String message;
    private final String signature;

    /**
     * Constructor for unauthenticated token (authentication request)
     */
    public Web3AuthenticationToken(String walletAddress, String message, String signature) {
        super(null);
        this.walletAddress = walletAddress;
        this.message = message;
        this.signature = signature;
        setAuthenticated(false);
    }

    /**
     * Constructor for authenticated token (authentication response)
     */
    public Web3AuthenticationToken(
            String walletAddress,
            String signature,
            Collection<? extends GrantedAuthority> authorities
    ) {
        super(authorities);
        this.walletAddress = walletAddress;
        this.message = null;
        this.signature = signature;
        setAuthenticated(true);
    }

    @Override
    public Object getCredentials() {
        return signature;
    }

    @Override
    public Object getPrincipal() {
        return walletAddress;
    }
}
