package com.tai3.spring_boot_library.request.models;

import lombok.AccessLevel;
import lombok.Data;
import lombok.experimental.FieldDefaults;

@Data
@FieldDefaults(level = AccessLevel.PRIVATE)
public class AddBookReq {
    String title;
    String author;
    String description;
    int copies;
    String category;
    String img;
}
