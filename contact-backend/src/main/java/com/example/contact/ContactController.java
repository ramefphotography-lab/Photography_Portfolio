package com.example.contact;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.bind.annotation.CrossOrigin;

@RestController
@CrossOrigin(origins = "*")
public class ContactController {
    @Autowired
    private JavaMailSender mailSender;

    @PostMapping("/send-inquiry")
    public String sendInquiry(
            @RequestParam String contactName,
            @RequestParam String contactEmail,
            @RequestParam String contactPhone,
            @RequestParam String contactType,
            @RequestParam String contactMessage
    ) {
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
        System.out.println("Inquiry sent from: " + contactEmail);
        return "Inquiry sent!";
    }
}
