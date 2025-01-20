package com.tai3.spring_boot_library.repository;

import com.tai3.spring_boot_library.model.Review;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.web.bind.annotation.RequestParam;

public interface ReviewRepository extends JpaRepository<Review, Long> {
    //Derived methods
    Page<Review> findByBookId(@RequestParam(name = "book_id") Long bookId, Pageable pageable);
}

