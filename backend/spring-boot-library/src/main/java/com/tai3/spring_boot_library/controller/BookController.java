package com.tai3.spring_boot_library.controller;

import com.tai3.spring_boot_library.model.Book;
import com.tai3.spring_boot_library.response.models.ShelfCurrentLoansResponse;
import com.tai3.spring_boot_library.service.BookService;
import com.tai3.spring_boot_library.service.PaymentService;
import com.tai3.spring_boot_library.utils.ExtractJWT;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.Enumeration;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/books")
public class BookController {
    private final BookService bookService;

    //constructor dependency injection
    public BookController(BookService bookService) {
        this.bookService = bookService;
    }

    @GetMapping("/secure/currentloans")
    public List<ShelfCurrentLoansResponse> currentLoans(@RequestHeader(name = "Authorization") String token) throws Exception {
        String userEmail = ExtractJWT.payLoadJWTExtraction(token, "\"sub\"");
        return bookService.currentLoans(userEmail);
    }

    @GetMapping(path = "/secure/currentloans/count")
    public Integer currentLoansCount(@RequestHeader(name = "Authorization") String token) {
        String userEmail = ExtractJWT.payLoadJWTExtraction(token, "\"sub\"");
        return bookService.currentLoansCount(userEmail);
    }

    @GetMapping(path = "/secure/ischeckout/byuser")
    public Boolean checkoutBookByUser(@RequestHeader(name = "Authorization") String token, @RequestParam(value = "bookId") Long bookId) {
        String userEmail = ExtractJWT.payLoadJWTExtraction(token, "\"sub\"");
        return bookService.checkoutBookByUser(userEmail, bookId);
    }

    @PutMapping(path = "/secure/checkout")
    public Book checkoutBook(@RequestHeader(name = "Authorization") String token, @RequestParam(name = "bookId") Long bookId) throws Exception {
        String userEmail = ExtractJWT.payLoadJWTExtraction(token, "\"sub\"");
        return bookService.checkoutBook(userEmail, bookId);
    }

    @PutMapping(path = "/secure/return")
    public void returnBook(@RequestHeader(name = "Authorization") String token,
                           @RequestParam(name = "bookId") Long bookId) throws Exception {
        String userEmail = ExtractJWT.payLoadJWTExtraction(token, "\"sub\"");
        bookService.returnBook(userEmail, bookId);
    }

    @PutMapping(path = "/secure/renew/loan")
    public void renewLoan(@RequestHeader(name = "Authorization") String token,
                          @RequestParam(name = "bookId") Long bookId) throws Exception {
        String userEmail = ExtractJWT.payLoadJWTExtraction(token, "\"sub\"");
        bookService.renewLoan(userEmail, bookId);
    }
}
