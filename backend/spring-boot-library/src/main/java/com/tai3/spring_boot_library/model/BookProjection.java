package com.tai3.spring_boot_library.model;

import org.springframework.data.rest.core.config.Projection;

@Projection(name = "bookView", types = { Book.class })
public interface BookProjection {
    Long getId();
    String getTitle();
    String getAuthor();
    String getDescription();
    int getCopies();
    int getCopiesAvailable();
    String getCategory();
    String getImg();
}

//https://docs.spring.io/spring-data/rest/docs/current-SNAPSHOT/reference/html/#reference
