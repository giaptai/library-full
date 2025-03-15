package com.tai3.spring_boot_library.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

import lombok.AccessLevel;

import lombok.Data;
import lombok.experimental.FieldDefaults;

@Entity
@Table(name = "history")
@Data
@FieldDefaults(level = AccessLevel.PRIVATE)
public class History {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    Long id;
    @Column(name = "user_email")
    String userEmail;
    String checkoutDate;
    String returnedDate;
    String title;
    String author;
    String description;
    String img;
    public History(){}
    public History(String userEmail, String checkoutDate, String returnedDate, String title,
                   String author, String description, String img){
        this.userEmail = userEmail;
        this.checkoutDate = checkoutDate;
        this.returnedDate = returnedDate;
        this.title = title;
        this.author=author;
        this.description = description;
        this.img = img;
    }
}
