package com.example.contact;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.bind.annotation.CrossOrigin;
import java.util.regex.Pattern;

@RestController
@CrossOrigin(origins = "*")
public class ContactController {
    @Autowired
    private JavaMailSender mailSender;

    // Email validation pattern
    private static final Pattern EMAIL_PATTERN = Pattern.compile(
        "^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$"
    );
    
    // Phone validation pattern (exactly 10 digits only)
    private static final Pattern PHONE_PATTERN = Pattern.compile(
        "^[0-9]{10}$"
    );

    @PostMapping("/send-inquiry")
    public ResponseEntity<String> sendInquiry(
            @RequestParam String contactName,
            @RequestParam String contactEmail,
            @RequestParam String contactPhone,
            @RequestParam String contactType,
            @RequestParam String contactMessage
    ) {
        // Validate email format
        if (contactEmail == null || contactEmail.trim().isEmpty()) {
            return ResponseEntity.badRequest().body("Email is required");
        }
        
        if (!EMAIL_PATTERN.matcher(contactEmail.trim()).matches()) {
            return ResponseEntity.badRequest().body("Invalid email format. Please enter a valid email address.");
        }
        
        // Validate required fields
        if (contactName == null || contactName.trim().isEmpty()) {
            return ResponseEntity.badRequest().body("Name is required");
        }
        
        if (contactPhone == null || contactPhone.trim().isEmpty()) {
            return ResponseEntity.badRequest().body("Phone number is required");
        }
        
        if (!PHONE_PATTERN.matcher(contactPhone.trim()).matches()) {
            return ResponseEntity.badRequest().body("Phone number must be exactly 10 digits. Only numbers are allowed.");
        }
        
        if (contactType == null || contactType.trim().isEmpty()) {
            return ResponseEntity.badRequest().body("Photography type is required");
        }
        
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setTo("ga9582619@gmail.com");
            message.setSubject("New Inquiry from " + contactName);
            message.setText(
                "Name: " + contactName + "\n" +
                "Email: " + contactEmail + "\n" +
                "Phone: " + contactPhone + "\n" +
                "Session Type: " + contactType + "\n" +
                "Message: " + contactMessage
            );
            mailSender.send(message);
            System.out.println("Inquiry sent successfully from: " + contactEmail);
            return ResponseEntity.ok("Inquiry sent successfully!");
        } catch (Exception e) {
            System.err.println("Error sending email: " + e.getMessage());
            return ResponseEntity.internalServerError().body("Failed to send inquiry. Please try again later.");
        }
    }
}
