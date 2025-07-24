package com.vijaybrothers.store.service;

import com.vijaybrothers.store.model.ContactMessage;
import com.vijaybrothers.store.repository.ContactMessageRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ContactMessageService {

    @Autowired
    private ContactMessageRepository contactMessageRepository;

    public ContactMessage saveMessage(ContactMessage message) {
        return contactMessageRepository.save(message);
    }

    public List<ContactMessage> getAllMessages() {
        return contactMessageRepository.findAll();
    }

    public List<ContactMessage> getUnreadMessages() {
        return contactMessageRepository.findByIsRead(false);
    }

    public ContactMessage markAsRead(Long id) {
        ContactMessage message = contactMessageRepository.findById(id).orElseThrow(() -> new RuntimeException("Message not found"));
        message.setRead(true);
        return contactMessageRepository.save(message);
    }
}
