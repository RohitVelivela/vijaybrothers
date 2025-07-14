package com.vijaybrothers.store.repository;

import com.vijaybrothers.store.model.ContactMessage;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ContactMessageRepository
    extends JpaRepository<ContactMessage,Integer> {
}