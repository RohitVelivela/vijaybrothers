// src/main/java/com/vijaybrothers/store/service/impl/GuestCheckoutServiceImpl.java
package com.vijaybrothers.store.service.impl;

import com.vijaybrothers.store.dto.checkout.GuestCheckoutRequest;
import com.vijaybrothers.store.dto.checkout.GuestCheckoutResponse;
import com.vijaybrothers.store.model.GuestCheckoutDetails;
import com.vijaybrothers.store.repository.GuestCheckoutDetailsRepository;
import com.vijaybrothers.store.service.GuestCheckoutService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.OffsetDateTime;

@Service
@RequiredArgsConstructor
public class GuestCheckoutServiceImpl implements GuestCheckoutService {

    private final GuestCheckoutDetailsRepository repository;

    @Override
    public GuestCheckoutResponse createGuest(String cartId, GuestCheckoutRequest request) {
        GuestCheckoutDetails entity = new GuestCheckoutDetails();
        entity.setName(request.name());
        entity.setEmail(request.email());
        entity.setPhone(request.phone());
        entity.setAddress(request.address());
        entity.setCity(request.city());
        entity.setState(request.state());
        entity.setPostalCode(request.postalCode());
        entity.setCreatedAt(OffsetDateTime.now());

        repository.save(entity);
        return GuestCheckoutResponse.fromEntity(entity);
    }

    @Override
    public GuestCheckoutResponse getGuest(String guestId) {
        var entity = repository.findById(Integer.parseInt(guestId))
            .orElseThrow(() -> new IllegalArgumentException("Guest not found: " + guestId));
        return GuestCheckoutResponse.fromEntity(entity);
    }
}
