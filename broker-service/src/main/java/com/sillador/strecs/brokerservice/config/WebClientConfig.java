package com.sillador.strecs.brokerservice.config;

import io.netty.handler.ssl.SslContext;
import io.netty.handler.ssl.SslContextBuilder;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.client.reactive.ReactorClientHttpConnector;
import org.springframework.util.ResourceUtils;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.netty.http.client.HttpClient;

import javax.net.ssl.KeyManagerFactory;
import javax.net.ssl.SSLException;
import javax.net.ssl.TrustManagerFactory;
import java.io.File;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.nio.file.Files;
import java.security.*;
import java.security.cert.Certificate;
import java.security.cert.CertificateException;
import java.security.cert.CertificateFactory;
import java.security.cert.X509Certificate;
import java.util.Collection;

@Configuration
public class WebClientConfig {

    @Bean
    public WebClient webClient(ClientSslProperties sslProps) throws IOException, CertificateException, KeyStoreException, NoSuchAlgorithmException {
        Security.addProvider(new org.bouncycastle.jce.provider.BouncyCastleProvider());

        File certFile = ResourceUtils.getFile(sslProps.getKeyCertPath());
        File keyFile = ResourceUtils.getFile(sslProps.getKeyPath());
        File trustFile = ResourceUtils.getFile(sslProps.getTrustCertPath());
        String passphrase = sslProps.getKeyPassword(); // Your PEM private key passphrase
        System.out.println("passphrase "+ passphrase);

        SslContextBuilder sslContextBuilder = SslContextBuilder.forClient()
                .keyManager(certFile, keyFile)
                .trustManager(trustFile);

        HttpClient httpClient = HttpClient.create()
                .secure(ssl -> {
                    try {
                        ssl.sslContext(sslContextBuilder.build());
                    } catch (SSLException e) {
                        throw new RuntimeException(e);
                    }
                });



        return WebClient.builder()
                .clientConnector(new ReactorClientHttpConnector(httpClient))
                .build();

    }
}
