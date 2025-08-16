package com.sillador.strecs.brokerservice;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

import lombok.Getter;
import lombok.Setter;

@Component
@ConfigurationProperties(prefix = "ms-server")
@Setter
@Getter
public class BrokerConfig {

    private String edutrack;
    private String bluefolder;
}
