package com.vijaybrothers.store.controller;

import com.vijaybrothers.store.dto.ContactFormRequest;
import com.vijaybrothers.store.service.ContactService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/contact")
@RequiredArgsConstructor
public class ContactController {

    private final ContactService svc;

    /**
     * POST /api/contact
     */
    @PostMapping
    public ResponseEntity<?> submitForm(
        @Valid @RequestBody ContactFormRequest req
    ) {
        svc.submitForm(req);
        return ResponseEntity
            .status(HttpStatus.CREATED)
            .body(Map.of("message","Contact message submitted successfully"));
    }
}