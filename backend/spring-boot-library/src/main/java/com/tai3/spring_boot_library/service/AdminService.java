package com.tai3.spring_boot_library.service;

import com.tai3.spring_boot_library.model.Book;
import com.tai3.spring_boot_library.repository.BookRepository;
import com.tai3.spring_boot_library.repository.CheckoutRepository;
import com.tai3.spring_boot_library.repository.ReviewRepository;
import com.tai3.spring_boot_library.request.models.AddBookReq;
import lombok.AccessLevel;
import lombok.experimental.FieldDefaults;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

@Service
@Transactional
@FieldDefaults(level = AccessLevel.PRIVATE)
public class AdminService {
    final BookRepository bookRepository;
    final ReviewRepository reviewRepository;
    final CheckoutRepository checkoutRepository;

    public AdminService(BookRepository bookRepository, ReviewRepository reviewRepository, CheckoutRepository checkoutRepository) {
        this.bookRepository = bookRepository;
        this.reviewRepository = reviewRepository;
        this.checkoutRepository = checkoutRepository;
    }

    public void increaseBookQuantity(Long bookId) throws Exception {
        Optional<Book> book = bookRepository.findById(bookId);
        if (book.isEmpty()) {
            throw new Exception("Book not found !!!");
        }
        book.get().setCopiesAvailable(book.get().getCopiesAvailable() + 1);
        book.get().setCopies(book.get().getCopies() + 1);
        bookRepository.save(book.get());
    }

    public void decreaseBookQuantity(Long bookId) throws Exception {
        Optional<Book> book = bookRepository.findById(bookId);
        if (book.isEmpty() || book.get().getCopiesAvailable() <= 0 || book.get().getCopies() <= 0) {
            throw new Exception("Book not found or quantity locked !!!");
        }
        book.get().setCopiesAvailable(book.get().getCopiesAvailable() - 1);
        book.get().setCopies(book.get().getCopies() - 1);
        bookRepository.save(book.get());
    }

    public void postBook(AddBookReq addBookReq) {
        Book book = new Book();
        book.setTitle(addBookReq.getTitle());
        book.setAuthor(addBookReq.getAuthor());
        book.setDescription(addBookReq.getDescription());
        book.setCopies(addBookReq.getCopies());
        book.setCopiesAvailable(addBookReq.getCopies());
        book.setCategory(addBookReq.getCategory());
        book.setImg(addBookReq.getImg());
        bookRepository.save(book);
    }

    public void deleteBook(Long bookId) throws Exception {
        Optional<Book> book = bookRepository.findById(bookId);
        if (book.isEmpty()) {
            throw new Exception("Book not found !!!");
        }
        bookRepository.delete(book.get());
        reviewRepository.deleteAllByBookId(bookId);
        checkoutRepository.deleteAllByBookId(bookId);
    }
}
