package com.vijaybrothers.store.controller;

import com.vijaybrothers.store.model.ContactMessage;
import com.vijaybrothers.store.service.ContactMessageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/contact-messages")
public class ContactMessageController {

    @Autowired
    private ContactMessageService contactMessageService;

    @PostMapping
    public ContactMessage createMessage(@RequestBody ContactMessage message) {
        return contactMessageService.saveMessage(message);
    }

    @GetMapping
    public List<ContactMessage> getMessages(@RequestParam(required = false) Boolean unread) {
        if (unread != null && unread) {
            return contactMessageService.getUnreadMessages();
        }
        return contactMessageService.getAllMessages();
    }

    @PutMapping("/{id}/read")
    public ResponseEntity<ContactMessage> markAsRead(@PathVariable Long id) {
        return ResponseEntity.ok(contactMessageService.markAsRead(id));
    }
}
