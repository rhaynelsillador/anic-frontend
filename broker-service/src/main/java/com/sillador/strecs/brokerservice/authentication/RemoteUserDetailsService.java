package com.sillador.strecs.brokerservice.authentication;

import java.util.LinkedHashMap;
import java.util.List;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.User.UserBuilder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;
import org.springframework.web.client.HttpStatusCodeException;

import com.sillador.strecs.brokerservice.config.ExternalServiceClient;
import com.sillador.strecs.brokerservice.dto.BaseResponse;
import com.sillador.strecs.brokerservice.dto.LoginInfo;

@Service
public class RemoteUserDetailsService {

    private final ExternalServiceClient externalServiceClient;

    private static final String LOGIN_PATH = "/api/auth/login";

    public RemoteUserDetailsService(ExternalServiceClient externalServiceClient) {
        this.externalServiceClient = externalServiceClient;
    }
    // Optional: helper to call remote auth API directly
    /**
     * @param username
     * @param password
     * @return
     */
    public UserDetails authenticate(String username, String password) {
        try {
            
            LoginInfo loginInfo = new LoginInfo();
            loginInfo.setIdentifier(username);
            loginInfo.setPassword(password);
            BaseResponse response = externalServiceClient.postForward(LOGIN_PATH, loginInfo);
            if(response.getCode() == 20){

                UserBuilder user =  User
                        .withUsername(username)
                        .password("N/A");
                try {
                    LinkedHashMap account = (LinkedHashMap<String, Object>)response.getData();
                    Object rolesObj = account.get("roles");

                    if (rolesObj instanceof List<?> rolesList) {
                    String[] roles = rolesList.stream()
                        .map(item -> "ROLE_"+item)
                        .toArray(String[]::new);
                    user.authorities(roles);
                }
                    
                } catch (Exception e) {
                    e.printStackTrace();
                }
                
                    return user.build();
            } else {
                throw new BadCredentialsException("Invalid credentials");
            }
        } catch (HttpStatusCodeException ex) {
            throw new BadCredentialsException("Authentication failed: " + ex.getStatusCode());
        }
    }
}
