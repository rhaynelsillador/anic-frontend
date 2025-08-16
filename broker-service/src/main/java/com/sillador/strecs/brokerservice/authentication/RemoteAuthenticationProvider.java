package com.sillador.strecs.brokerservice.authentication;

import java.util.LinkedHashMap;

import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;

import com.sillador.strecs.brokerservice.config.ExternalServiceClient;
import com.sillador.strecs.brokerservice.dto.BaseResponse;

import lombok.AllArgsConstructor;

@Component
@AllArgsConstructor
public class RemoteAuthenticationProvider implements AuthenticationProvider {

    private final RemoteUserDetailsService userDetailsService;

    private final ExternalServiceClient externalServiceClient;
    private static final String ACCOUNT_INFO_PATH = "/api/v1/account/";


    @Override
    public Authentication authenticate(Authentication authentication) throws AuthenticationException {
        String username = authentication.getName();
        String password = authentication.getCredentials().toString();

        UserDetails user = userDetailsService.authenticate(username, password);

        BaseResponse accountInfoResponse = externalServiceClient.getForward(ACCOUNT_INFO_PATH + user.getUsername(), "");
        long accountDataId = 0;
        if (accountInfoResponse.getCode() == 20) {
            // Successfully retrieved account info
            LinkedHashMap<String, Object> accountData = (LinkedHashMap<String, Object>) accountInfoResponse.getData();
            // You can use accountData to enrich the user details if needed

            System.out.println("Account information retrieved successfully: " + accountData);
            accountDataId = Long.parseLong(accountData.get("id").toString());
        } else {
            throw new BadCredentialsException("Failed to retrieve account information");
        }
        
        return new UsernamePasswordAuthenticationToken(accountDataId, username, user.getAuthorities());
    }

    @Override
    public boolean supports(Class<?> authentication) {
        return UsernamePasswordAuthenticationToken.class.isAssignableFrom(authentication);
    }
}
