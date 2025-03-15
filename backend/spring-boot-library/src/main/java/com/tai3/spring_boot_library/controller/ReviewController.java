package com.tai3.spring_boot_library.controller;

import com.tai3.spring_boot_library.request.models.ReviewReq;
import com.tai3.spring_boot_library.service.ReviewService;
import com.tai3.spring_boot_library.utils.ExtractJWT;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/reviews")
public class ReviewController {
    private final ReviewService reviewService;

    public ReviewController(ReviewService reviewService) {
        this.reviewService = reviewService;
    }

    @GetMapping(path = "/secure/user/book")
    public boolean reviewBookByUser(@RequestHeader(name = "Authorization") String token,
                                    @RequestParam(name = "bookId") Long bookId){
        String userEmail = ExtractJWT.payLoadJWTExtraction(token, "\"sub\"");
        return reviewService.userReviewListed(userEmail, bookId);
    }

    @PostMapping(path = "/secure")
    public void postReview(@RequestHeader(value = "Authorization") String token,
                           @RequestBody ReviewReq reviewReq) throws Exception{
        String userEmail = ExtractJWT.payLoadJWTExtraction(token, "\"sub\"");
        if(userEmail == null){
            throw new Exception("User email is missing");
        }
        reviewService.postReview(userEmail, reviewReq);
    }
}
