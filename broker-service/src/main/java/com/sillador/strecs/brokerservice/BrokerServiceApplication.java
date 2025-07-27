package com.sillador.strecs.brokerservice;

import com.sillador.strecs.brokerservice.config.ClientSslProperties;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.properties.EnableConfigurationProperties;

//@EnableConfigurationProperties(ClientSslProperties.class)
@SpringBootApplication
public class BrokerServiceApplication {

	public static void main(String[] args) {
		SpringApplication.run(BrokerServiceApplication.class, args);
	}

}
