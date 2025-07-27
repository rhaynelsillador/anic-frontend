package com.sillador.strecs.brokerservice;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

@Component
@ConfigurationProperties(prefix = "ms-server")
public class BrokerConfig {

    private String edutrack;

    public String getEdutrack() {
        return edutrack;
    }

    public void setEdutrack(String edutrack) {
        this.edutrack = edutrack;
    }
}
