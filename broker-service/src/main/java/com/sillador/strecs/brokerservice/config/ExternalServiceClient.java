package com.sillador.strecs.brokerservice.config;

import com.sillador.strecs.brokerservice.BrokerConfig;
import com.sillador.strecs.brokerservice.dto.BaseResponse;
import com.sillador.strecs.brokerservice.service.BrokerService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;

@Service
public class ExternalServiceClient {

    private final WebClient webClient;
    private final BrokerConfig brokerConfig;

    public ExternalServiceClient(WebClient webClient, BrokerConfig brokerConfig){
        this.webClient = webClient;
        this.brokerConfig = brokerConfig;
    }

    public BaseResponse postForward(String path, Object body) {
        return webClient
            .post()
            .uri(brokerConfig.getEdutrack()+path) // Replace with real URL
            .header(HttpHeaders.CONTENT_TYPE, MediaType.APPLICATION_JSON_VALUE) // Set JSON header
            .bodyValue(body)
            .retrieve()
            .bodyToMono(BaseResponse.class)
            .block(); // block() to make it sync (use only in non-reactive code)

    }

    public BaseResponse putForward(String path, String body) {
        return webClient
                .put()
                .uri(brokerConfig.getEdutrack()+path) // Replace with real URL
                .header(HttpHeaders.CONTENT_TYPE, MediaType.APPLICATION_JSON_VALUE) // Set JSON header
                .bodyValue(body)
                .retrieve()
                .bodyToMono(BaseResponse.class)
                .block(); // block() to make it sync (use only in non-reactive code)

    }

    public BaseResponse getForward(String path, String queryString) {

        return webClient
            .get()
            .uri(brokerConfig.getEdutrack()+path +"?"+ queryString) // Replace with real URL
            .retrieve()
            .bodyToMono(BaseResponse.class)
            .block(); // block() to make it sync (use only in non-reactive code)

    }
}
