package com.sillador.strecs.brokerservice.config;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;

@Configuration
@ConfigurationProperties(prefix = "client.ssl")
public class ClientSslProperties {

    private String keyCertPath;
    private String keyPath;
    private String trustCertPath; // passphrase



    private String keyStore;
    private String keyStorePassword;
    private String keyPassword; // passphrase
    private String keyStoreType;

    private String trustStore;
    private String trustStorePassword;
    private String trustStoreType;

    // Getters and setters


    public String getKeyStore() {
        return keyStore;
    }

    public void setKeyStore(String keyStore) {
        this.keyStore = keyStore;
    }

    public String getKeyStorePassword() {
        return keyStorePassword;
    }

    public void setKeyStorePassword(String keyStorePassword) {
        this.keyStorePassword = keyStorePassword;
    }

    public String getKeyStoreType() {
        return keyStoreType;
    }

    public void setKeyStoreType(String keyStoreType) {
        this.keyStoreType = keyStoreType;
    }

    public String getTrustStore() {
        return trustStore;
    }

    public void setTrustStore(String trustStore) {
        this.trustStore = trustStore;
    }

    public String getTrustStorePassword() {
        return trustStorePassword;
    }

    public void setTrustStorePassword(String trustStorePassword) {
        this.trustStorePassword = trustStorePassword;
    }

    public String getTrustStoreType() {
        return trustStoreType;
    }

    public void setTrustStoreType(String trustStoreType) {
        this.trustStoreType = trustStoreType;
    }

    public String getKeyPassword() {
        return keyPassword;
    }

    public void setKeyPassword(String keyPassword) {
        this.keyPassword = keyPassword;
    }

    public String getKeyCertPath() {
        return keyCertPath;
    }

    public void setKeyCertPath(String keyCertPath) {
        this.keyCertPath = keyCertPath;
    }

    public String getKeyPath() {
        return keyPath;
    }

    public void setKeyPath(String keyPath) {
        this.keyPath = keyPath;
    }

    public String getTrustCertPath() {
        return trustCertPath;
    }

    public void setTrustCertPath(String trustCertPath) {
        this.trustCertPath = trustCertPath;
    }
}
