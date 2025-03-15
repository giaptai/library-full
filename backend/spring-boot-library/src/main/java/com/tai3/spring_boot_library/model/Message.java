package com.tai3.spring_boot_library.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.Setter;
import lombok.experimental.FieldDefaults;

@Entity
@Table(name = "messages")
@Getter
@Setter
@FieldDefaults(level = AccessLevel.PRIVATE)
public class Message {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    Long id;
    String title;
    String question;
    @Column(name = "user_email")
    String userEmail;
    @Column(name = "admin_email")
    String adminEmail;
    @Column(name = "response")
    String response;
    boolean closed;

    public Message() {
    }

    public Message(String title, String question) {
        this.title = title;
        this.question = question;
    }
}
