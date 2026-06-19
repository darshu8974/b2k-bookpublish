package com.publishflow.domain.customer;

import com.publishflow.common.exception.ResourceNotFoundException;
import com.publishflow.common.response.PagedResponse;
import com.publishflow.domain.customer.dto.CustomerResponse;
import com.publishflow.domain.user.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Map;

@Service
@RequiredArgsConstructor
public class CustomerService {

    private final CustomerRepository customerRepository;
    private final UserService userService;

    @Transactional(readOnly = true)
    public PagedResponse<CustomerResponse> getAll(String search, int page, int size) {
        var pageable = PageRequest.of(page, size, Sort.by("name").ascending());
        return PagedResponse.from(customerRepository.findAllActive(search, pageable).map(CustomerResponse::from));
    }

    @Transactional(readOnly = true)
    public CustomerResponse getById(String id) {
        return CustomerResponse.from(findById(id));
    }

    @Transactional
    public CustomerResponse create(Map<String, String> body, String createdById) {
        var creator = userService.findActiveById(createdById);
        Customer customer = Customer.builder()
            .name(body.get("name"))
            .contactEmail(body.get("contactEmail"))
            .contactPhone(body.get("contactPhone"))
            .address(body.get("address"))
            .createdBy(creator)
            .build();
        return CustomerResponse.from(customerRepository.save(customer));
    }

    @Transactional
    public void delete(String id) {
        Customer c = findById(id);
        c.softDelete();
        customerRepository.save(c);
    }

    public Customer findById(String id) {
        return customerRepository.findByIdAndDeletedAtIsNull(id)
            .orElseThrow(() -> new ResourceNotFoundException("Customer", "id", id));
    }
}
