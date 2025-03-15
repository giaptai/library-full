package com.tai3.spring_boot_library.service;

import com.tai3.spring_boot_library.model.Review;
import com.tai3.spring_boot_library.repository.ReviewRepository;
import com.tai3.spring_boot_library.request.models.ReviewReq;
import lombok.AccessLevel;
import lombok.experimental.FieldDefaults;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.sql.Date;
import java.time.LocalDate;
import java.util.Objects;
import java.util.Optional;

@Service
@Transactional
@FieldDefaults(level = AccessLevel.PRIVATE)
public class ReviewService {

    final ReviewRepository reviewRepository;

    public ReviewService(ReviewRepository reviewRepository){
        this.reviewRepository = reviewRepository;
    }

    public void postReview(String useEmail, ReviewReq reviewReq) throws Exception{
        Review validateReview = reviewRepository.findByUserEmailAndBookId(useEmail, reviewReq.getBookId());
        if(validateReview != null){
            throw new Exception("Review already created");
        }
        Review review = new Review();
        review.setBookId(reviewReq.getBookId());
        review.setRating(reviewReq.getRating());
        review.setUserEmail(useEmail);
        if(Optional.ofNullable(reviewReq.getReviewDescription()).isPresent()){
            review.setReviewDescription(reviewReq.getReviewDescription());
        } else review.setReviewDescription(null);
        review.setDate(Date.valueOf(LocalDate.now()));
        reviewRepository.save(review);
    }

    public boolean userReviewListed(String userEmail, Long bookId){
        Review validateReview = reviewRepository.findByUserEmailAndBookId(userEmail,bookId);
        if(Objects.nonNull(validateReview)){
            return true;
        }else return false;
    }
}
