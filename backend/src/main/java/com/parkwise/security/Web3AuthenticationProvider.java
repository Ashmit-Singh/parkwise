package com.parkwise.security;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.stereotype.Component;
import org.web3j.crypto.Keys;
import org.web3j.crypto.Sign;
import org.web3j.utils.Numeric;

import java.math.BigInteger;
import java.util.Arrays;
import java.util.List;

/**
 * Web3 Authentication Provider
 * Authenticates users via wallet signature verification
 */
@Slf4j
@Component
@RequiredArgsConstructor
public class Web3AuthenticationProvider implements AuthenticationProvider {

    /**
     * Authenticates a Web3 authentication token
     * Verifies the signature matches the wallet address
     */
    @Override
    public Authentication authenticate(Authentication authentication) throws AuthenticationException {
        if (!(authentication instanceof Web3AuthenticationToken)) {
            return null;
        }

        Web3AuthenticationToken token = (Web3AuthenticationToken) authentication;
        String walletAddress = token.getWalletAddress();
        String message = token.getMessage();
        String signature = token.getSignature();

        try {
            // Verify the signature
            String recoveredAddress = recoverAddress(message, signature);
            
            if (!recoveredAddress.equalsIgnoreCase(walletAddress)) {
                throw new BadCredentialsException("Invalid wallet signature");
            }

            // Create authenticated token with authorities
            List<SimpleGrantedAuthority> authorities = Arrays.asList(
                new SimpleGrantedAuthority("ROLE_DONOR")
            );

            Web3AuthenticationToken authenticatedToken = new Web3AuthenticationToken(
                walletAddress,
                signature,
                authorities
            );
            authenticatedToken.setAuthenticated(true);

            log.info("Web3 authentication successful for wallet: {}", walletAddress);
            return authenticatedToken;

        } catch (Exception e) {
            log.error("Web3 authentication failed: {}", e.getMessage());
            throw new BadCredentialsException("Invalid wallet credentials", e);
        }
    }

    @Override
    public boolean supports(Class<?> authentication) {
        return Web3AuthenticationToken.class.isAssignableFrom(authentication);
    }

    /**
     * Recovers the Ethereum address from a signed message
     */
    private String recoverAddress(String message, String signature) throws Exception {
        // Add Ethereum signed message prefix
        String prefix = "\u0019Ethereum Signed Message:\n" + message.length();
        String messageHash = org.web3j.crypto.Hash.sha3String(prefix + message);

        // Parse signature
        byte[] signatureBytes = Numeric.hexStringToByteArray(signature);
        byte v = signatureBytes[64];
        if (v < 27) {
            v += 27;
        }

        Sign.SignatureData signatureData = new Sign.SignatureData(
            v,
            Arrays.copyOfRange(signatureBytes, 0, 32),
            Arrays.copyOfRange(signatureBytes, 32, 64)
        );

        // Recover public key
        BigInteger publicKey = Sign.signedMessageHashToKey(
            Numeric.hexStringToByteArray(messageHash),
            signatureData
        );

        // Derive address from public key
        return "0x" + Keys.getAddress(publicKey);
    }
}
