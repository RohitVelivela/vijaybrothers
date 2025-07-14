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
        ContactMessage cm = new ContactMessage();
        cm.setName(     req.name());
        cm.setEmail(    req.email());
        cm.setPhone(    req.phone());
        cm.setMessage(  req.message());
        cm.setCreatedAt(Instant.now());
        repo.save(cm);
    }
}