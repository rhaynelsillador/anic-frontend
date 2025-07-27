//package com.sillador.strecs.brokerservice.config;
//
//import io.netty.handler.ssl.SslContext;
//import io.netty.handler.ssl.SslContextBuilder;
//import org.springframework.context.annotation.Bean;
//import org.springframework.context.annotation.Configuration;
//import org.springframework.http.client.reactive.ReactorClientHttpConnector;
//import org.springframework.util.ResourceUtils;
//import org.springframework.web.reactive.function.client.WebClient;
//import reactor.netty.http.client.HttpClient;
//
//import javax.net.ssl.KeyManagerFactory;
//import javax.net.ssl.TrustManagerFactory;
//import java.io.IOException;
//import java.security.KeyStore;
//import java.security.KeyStoreException;
//import java.security.NoSuchAlgorithmException;
//import java.security.UnrecoverableKeyException;
//import java.security.cert.CertificateException;
//
//@Configuration
//public class WebClientConfig2 {
//
//    @Bean
//    public WebClient webClient(ClientSslProperties sslProps) throws NoSuchAlgorithmException, IOException, KeyStoreException, CertificateException, UnrecoverableKeyException {
//        KeyStore keyStore = KeyStore.getInstance(sslProps.getKeyStoreType());
//        keyStore.load(ResourceUtils.getURL(sslProps.getKeyStore()).openStream(),
//                sslProps.getKeyStorePassword().toCharArray());
//
//        KeyManagerFactory kmf = KeyManagerFactory.getInstance(KeyManagerFactory.getDefaultAlgorithm());
//        kmf.init(keyStore, sslProps.getKeyStorePassword().toCharArray());
//
//        KeyManagerFactory kmf = KeyManagerFactory.getInstance(KeyManagerFactory.getDefaultAlgorithm());
//        kmf.init(keyStore, sslProps.getKeyPassword().toCharArray()); // use passphrase
//
//
//        KeyStore trustStore = KeyStore.getInstance(sslProps.getTrustStoreType());
//        trustStore.load(ResourceUtils.getURL(sslProps.getTrustStore()).openStream(),
//                sslProps.getTrustStorePassword().toCharArray());
//
//        TrustManagerFactory tmf = TrustManagerFactory.getInstance(TrustManagerFactory.getDefaultAlgorithm());
//        tmf.init(trustStore);
//
//        SslContext sslContext = SslContextBuilder.forClient()
//                .keyManager(kmf)
//                .trustManager(tmf)
//                .build();
//
//        HttpClient httpClient = HttpClient.create()
//                .secure(ssl -> ssl.sslContext(sslContext));
//
//        return WebClient.builder()
//                .clientConnector(new ReactorClientHttpConnector(httpClient))
//                .build();
//
//    }
//}
