package com.publishflow;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableAsync;

@SpringBootApplication
@EnableAsync
public class PublishFlowApplication {

    public static void main(String[] args) {
        SpringApplication.run(PublishFlowApplication.class, args);
    }
}
