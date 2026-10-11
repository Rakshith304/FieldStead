package com.example.farmrental.config;

import java.net.URI;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.BeansException;
import org.springframework.beans.factory.config.BeanPostProcessor;
import org.springframework.boot.autoconfigure.jdbc.DataSourceProperties;
import org.springframework.context.annotation.Configuration;

@Configuration
public class DatabaseConfig implements BeanPostProcessor {
    private static final Logger log = LoggerFactory.getLogger(DatabaseConfig.class);

    @Override
    public Object postProcessBeforeInitialization(Object bean, String beanName) throws BeansException {
        if (bean instanceof DataSourceProperties props) {
            configureProperties(props);
        }
        return bean;
    }

    private void configureProperties(DataSourceProperties props) {
        String rawUrl = System.getenv("MYSQL_URL");
        if (rawUrl == null || rawUrl.isBlank()) {
            rawUrl = System.getenv("DB_URL");
        }
        if (rawUrl == null || rawUrl.isBlank()) {
            rawUrl = props.getUrl();
        }

        if (rawUrl != null && rawUrl.startsWith("mysql://")) {
            try {
                URI uri = URI.create(rawUrl);
                String userInfo = uri.getUserInfo();
                if (userInfo != null && !userInfo.isBlank()) {
                    String[] parts = userInfo.split(":", 2);
                    props.setUsername(parts[0]);
                    if (parts.length > 1) {
                        props.setPassword(parts[1]);
                    }
                }
                String host = uri.getHost();
                int port = uri.getPort() > 0 ? uri.getPort() : 3306;
                String path = uri.getPath();
                if (path == null || path.isBlank() || path.equals("/")) {
                    path = "/farm_db";
                }
                String jdbcUrl = "jdbc:mysql://" + host + ":" + port + path
                    + "?serverTimezone=UTC&createDatabaseIfNotExist=true&allowPublicKeyRetrieval=true&useSSL=false";
                props.setUrl(jdbcUrl);
                log.info("Parsed mysql:// URL to JDBC URL for host: {}:{}", host, port);
                return;
            } catch (Exception ex) {
                log.warn("Failed to parse mysql:// URL, falling back to original: {}", ex.getMessage());
            }
        }

        // If MYSQLHOST is present and DB_URL wasn't explicitly supplied
        String mysqlHost = System.getenv("MYSQLHOST");
        if (mysqlHost != null && !mysqlHost.isBlank() && (props.getUrl() == null || props.getUrl().contains("localhost"))) {
            String mysqlPort = System.getenv("MYSQLPORT");
            if (mysqlPort == null || mysqlPort.isBlank()) mysqlPort = "3306";
            String mysqlDb = System.getenv("MYSQLDATABASE");
            if (mysqlDb == null || mysqlDb.isBlank()) mysqlDb = "farm_db";
            String mysqlUser = System.getenv("MYSQLUSER");
            String mysqlPass = System.getenv("MYSQLPASSWORD");

            String jdbcUrl = "jdbc:mysql://" + mysqlHost + ":" + mysqlPort + "/" + mysqlDb
                + "?serverTimezone=UTC&createDatabaseIfNotExist=true&allowPublicKeyRetrieval=true&useSSL=false";
            props.setUrl(jdbcUrl);
            if (mysqlUser != null && !mysqlUser.isBlank()) props.setUsername(mysqlUser);
            if (mysqlPass != null && !mysqlPass.isBlank()) props.setPassword(mysqlPass);
            log.info("Configured datasource from Railway MYSQLHOST: {}:{}", mysqlHost, mysqlPort);
        }
    }
}
