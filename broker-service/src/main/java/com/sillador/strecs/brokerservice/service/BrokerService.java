package com.sillador.strecs.brokerservice.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.sillador.strecs.brokerservice.config.ExternalServiceClient;
import com.sillador.strecs.brokerservice.dto.BaseResponse;
import com.sillador.strecs.brokerservice.dto.ResponseCode;

import jakarta.servlet.http.HttpServletRequest;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClientResponseException;

import java.io.BufferedReader;
import java.io.IOException;
import java.net.URLDecoder;
import java.nio.charset.StandardCharsets;
import java.util.stream.Collectors;

@Service
public class BrokerService {

    private static Logger logger = LoggerFactory.getLogger(BrokerService.class);

    private final ExternalServiceClient externalServiceClient;

    public BrokerService(ExternalServiceClient externalServiceClient){
        this.externalServiceClient = externalServiceClient;
    }

    public Object forward(HttpServletRequest request) throws IOException {
        String path = request.getRequestURI();
        BaseResponse baseResponse;
        try {
            switch (request.getMethod()){
                case "POST":
                    String body = new BufferedReader(request.getReader())
                            .lines()
                            .collect(Collectors.joining(System.lineSeparator()));

                    System.out.println("HTTP Body: " + body);


                    baseResponse = externalServiceClient.postForward(path, body);
                    break;
                case "PUT":
                    String queryString = request.getQueryString();
                    if(queryString != null && !queryString.isEmpty()){
                        queryString = URLDecoder.decode(queryString, StandardCharsets.UTF_8);
                    }
                    BufferedReader bufferedReader = request.getReader();
                    body = 
                            bufferedReader.lines()
                            .collect(Collectors.joining(System.lineSeparator()));

                    System.out.println("HTTP Body: " + body);


                    baseResponse = externalServiceClient.putForward(path +"?"+ queryString, body);
                    bufferedReader.close();
                    break;
                case "GET":
                    queryString = request.getQueryString();
                    if(queryString != null && !queryString.isEmpty()){
                        queryString = URLDecoder.decode(queryString, StandardCharsets.UTF_8);
                    }
                    baseResponse = externalServiceClient.getForward(path, queryString);
                    break;
                default:
                    baseResponse = new BaseResponse().build(ResponseCode.ERROR, request.getMethod() + " request method is not supported");
                    break;
            }

        } catch (WebClientResponseException e) {
            System.err.println("Status Code: " + e.getStatusCode());
            System.err.println("Response Body: " + e.getResponseBodyAsString());
            logger.debug("Error : {} {} {} ", path, e.getStatusCode(), e.getResponseBodyAsString());
            // optionally: map to BaseResponse from error JSON
            baseResponse = new ObjectMapper().readValue(e.getResponseBodyAsString(), BaseResponse.class);
        }

        return baseResponse;
    }
}
