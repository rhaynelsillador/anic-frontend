package com.sillador.strecs.brokerservice.controller;

import com.sillador.strecs.brokerservice.config.ExternalServiceClient;
import com.sillador.strecs.brokerservice.dto.BaseResponse;
import com.sillador.strecs.brokerservice.dto.ResponseCode;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1")
public class UserInfoRestController {

    private final ExternalServiceClient externalServiceClient;
    private static final String ACCOUNT_INFO_PATH = "/api/v1/account/";

    public UserInfoRestController(ExternalServiceClient externalServiceClient){
        this.externalServiceClient = externalServiceClient;
    }

    @GetMapping("/loginAccount")
    public BaseResponse loginAccount(HttpServletRequest request){
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();

        if (auth == null || !auth.isAuthenticated()) {
            return new BaseResponse().build(ResponseCode.ERROR, "Not login.");
        }

        String user = auth.getPrincipal().toString();

        return externalServiceClient.getForward(ACCOUNT_INFO_PATH+user, "");
    }
}
