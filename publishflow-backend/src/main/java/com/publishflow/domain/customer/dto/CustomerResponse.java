package com.publishflow.domain.customer.dto;

import com.publishflow.domain.customer.Customer;
import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
@Builder
public class CustomerResponse {

    private String id;
    private String name;
    private String contactEmail;
    private String contactPhone;
    private String address;
    private LocalDateTime createdAt;

    public static CustomerResponse from(Customer c) {
        return CustomerResponse.builder()
            .id(c.getId())
            .name(c.getName())
            .contactEmail(c.getContactEmail())
            .contactPhone(c.getContactPhone())
            .address(c.getAddress())
            .createdAt(c.getCreatedAt())
            .build();
    }
}
