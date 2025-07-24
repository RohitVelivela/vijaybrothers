package com.vijaybrothers.store.service;

import com.vijaybrothers.store.dto.ContactFormRequest;
import com.vijaybrothers.store.model.ContactMessage;
import com.vijaybrothers.store.repository.ContactMessageRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;

@Service
@RequiredArgsConstructor
public class ContactService {

    private final ContactMessageRepository repo;

    /**
     * Persist a new contact_message row.
     */
    @Transactional
    public void submitForm(ContactFormRequest req) {
        ContactMessage cm = ContactMessage.builder()
                .name(req.name())
                .email(req.email())
                .subject(req.subject())
                .message(req.message())
                .contactNo(req.contactNo())
                .createdAt(Instant.now())
                .build();
        repo.save(cm);
    }
}