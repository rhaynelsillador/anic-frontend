package com.sillador.strecs.brokerservice.config;

import com.sillador.strecs.brokerservice.BrokerConfig;
import com.sillador.strecs.brokerservice.dto.BaseResponse;

import lombok.extern.slf4j.Slf4j;

import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

@Service
@Slf4j
public class ExternalServiceClient {

    private final WebClient webClient;
    private final BrokerConfig brokerConfig;

    public ExternalServiceClient(WebClient webClient, BrokerConfig brokerConfig){
        this.webClient = webClient;
        this.brokerConfig = brokerConfig;
    }

    private String getEndpoint(String path){
        String endpoint;
        if(path.startsWith("/bluefolder")) {
            endpoint = brokerConfig.getBluefolder() + path;
        }else{
            endpoint = brokerConfig.getEdutrack() + path;
        }
        System.out.print("Forwarding request to: {}" + endpoint);
        return endpoint;
    }

    public BaseResponse postForward(String path, Object body) {

        System.out.println("Forwarding POST request to: " + AuthUtils.getLoggedInUsername() + " | Path: " + path);

        return webClient
            .post()
            .uri(getEndpoint(path)) // Replace with real URL
            .header(HttpHeaders.CONTENT_TYPE, MediaType.APPLICATION_JSON_VALUE) // Set JSON header
            .header("Account-ID", AuthUtils.getLoggedInUsername())
            .header("Request-ID", AuthUtils.generateUUIDString())
            .bodyValue(body)
            .retrieve()
            .bodyToMono(BaseResponse.class)
            .block(); // block() to make it sync (use only in non-reactive code)

    }

    public BaseResponse putForward(String path, String body) {
        return webClient
                .put()
                .uri(getEndpoint(path)) // Replace with real URL
                .header(HttpHeaders.CONTENT_TYPE, MediaType.APPLICATION_JSON_VALUE) // Set JSON header
                .header("Account-ID", AuthUtils.getLoggedInUsername())
                .header("Request-ID", AuthUtils.generateUUIDString())
                .bodyValue(body)
                .retrieve()
                .bodyToMono(BaseResponse.class)
                .block(); // block() to make it sync (use only in non-reactive code)

    }

    public BaseResponse getForward(String path, String queryString) {

        return webClient
            .get()
            .uri(getEndpoint(path) + "?" + queryString) // Replace with real URL
            .header("Account-ID", AuthUtils.getLoggedInUsername())
            .header("Request-ID", AuthUtils.generateUUIDString())
            .retrieve()
            .bodyToMono(BaseResponse.class)
            .block(); // block() to make it sync (use only in non-reactive code)

    }
}
