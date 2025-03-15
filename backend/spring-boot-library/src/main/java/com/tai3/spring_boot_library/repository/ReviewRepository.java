package com.tai3.spring_boot_library.repository;

import com.tai3.spring_boot_library.model.Review;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.web.bind.annotation.RequestParam;

public interface ReviewRepository extends JpaRepository<Review, Long> {
    //Derived methods
    Page<Review> findByBookId(@RequestParam(name = "book_id") Long bookId, Pageable pageable);

    Review findByUserEmailAndBookId(@RequestParam(name = "user_email") String userEmail, @RequestParam(name = "book_id") Long bookId);

    @Modifying
    @Query(value = "DELETE FROM Review as r where r.bookId in :book_id")
    void deleteAllByBookId(@Param(value = "book_id") Long bookId);
}

