package com.publishflow.config;

import lombok.Getter;
import lombok.Setter;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

@Getter
@Setter
@Component
@ConfigurationProperties(prefix = "app.storage")
public class StorageProperties {

    private String strategy = "local";

    private Local local = new Local();

    @Getter
    @Setter
    public static class Local {
        private String uploadDir = "./uploads";
    }
}
