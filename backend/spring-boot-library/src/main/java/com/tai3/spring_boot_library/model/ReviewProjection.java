package com.tai3.spring_boot_library.model;

import org.springframework.data.rest.core.config.Projection;

import java.util.Date;

@Projection(name = "reviewView", types = { Review.class })
public interface ReviewProjection {
    abstract public Long getId();

    abstract public String getUserEmail();

    abstract public Date getDate();

    abstract public double getRating();

    abstract public Long getBookId();

    abstract public String getReviewDescription();
}
