package com.tai3.spring_boot_library.service;

import com.tai3.spring_boot_library.model.Book;
import com.tai3.spring_boot_library.model.Checkout;
import com.tai3.spring_boot_library.model.History;
import com.tai3.spring_boot_library.repository.BookRepository;
import com.tai3.spring_boot_library.repository.CheckoutRepository;
import com.tai3.spring_boot_library.repository.HistoryRepository;
import com.tai3.spring_boot_library.response.models.ShelfCurrentLoansResponse;
import lombok.AccessLevel;
import lombok.experimental.FieldDefaults;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.text.SimpleDateFormat;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Optional;
import java.util.concurrent.TimeUnit;

@Service
@Transactional
@FieldDefaults(level = AccessLevel.PRIVATE)
public class BookService {
    final BookRepository bookRepository;
    final CheckoutRepository checkoutRepository;
    final HistoryRepository historyRepository;

    //constructor dependency injection
    public BookService(BookRepository bookRepository, CheckoutRepository checkoutRepository, HistoryRepository historyRepository) {
        this.bookRepository = bookRepository;
        this.checkoutRepository = checkoutRepository;
        this.historyRepository = historyRepository;
    }

    public Book checkoutBook(String userEmail, Long bookId) throws Exception {
        // check if user
        Integer bookCheckoutsExpired =  checkoutRepository.findCheckoutByUserEmailHasReturnDateExpired(userEmail);
        if(bookCheckoutsExpired > 0){
            throw new Exception("You have book checkout expired");
        }
        Optional<Book> book = bookRepository.findById(bookId); //search bookId
        Checkout validateCheckout = checkoutRepository.findByUserEmailAndBookId(userEmail, bookId);

        if (book.isEmpty() || validateCheckout != null || book.get().getCopiesAvailable() <= 0) {
            throw new Exception("Book doesn't exist or already checked by user");
        }
        book.get().setCopiesAvailable(book.get().getCopiesAvailable() - 1); //minus copies
        bookRepository.save(book.get()); //save book entity
        //create checkout has bookId, userEmail, and return date is 7
        Checkout checkout = new Checkout(
                userEmail,
                LocalDate.now().toString(),
                LocalDate.now().plusDays(7).toString(),
                book.get().getId()
        );
        checkoutRepository.save(checkout);
        return book.get();
    }

    public Boolean checkoutBookByUser(String userEmail, Long bookId) {
        Checkout validateCheckout = checkoutRepository.findByUserEmailAndBookId(userEmail, bookId);
        return validateCheckout != null;
    }

    public int currentLoansCount(String userEmail) {
        return checkoutRepository.findBooksByUserEmail(userEmail).size();
    }

    public List<ShelfCurrentLoansResponse> currentLoans(String userEmail) throws Exception {
        List<ShelfCurrentLoansResponse> shelfCurrentLoansResponses = new ArrayList<>();
        List<Checkout> checkouts = checkoutRepository.findBooksByUserEmail(userEmail);
//        List<Long> bookIdlist =  new ArrayList<>();
        List<Book> books = bookRepository.findAllById(
                checkouts.stream().map(Checkout::getBookId).toList()
        );
        SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");

        for (Book book : books) {
            Optional<Checkout> checkout = checkouts.stream().filter(
                    ckout -> ckout.getBookId() == book.getId()).findFirst();

            if (checkout.isPresent()) {
                Date d1 = sdf.parse(checkout.get().getReturnDate());
                Date d2 = sdf.parse(LocalDate.now().toString());

                TimeUnit timeUnit = TimeUnit.DAYS;

                long different_In_Time = timeUnit.convert(d1.getTime() - d2.getTime(), TimeUnit.MILLISECONDS);

                shelfCurrentLoansResponses.add(new ShelfCurrentLoansResponse(book, (int) different_In_Time));
            }
        }

        //shit code
//        List<ShelfCurrentLoansResponse> newShelfCurrentLoansResponses = checkouts.stream()
//                .flatMap(checkout -> bookRepository.findById(checkout.getBookId()).stream()
//                        .map(book -> new ShelfCurrentLoansResponse(book,  checkout.getReturnDate().length())))
//                .toList();
        return shelfCurrentLoansResponses;
    }

    public void returnBook(String userEmail, Long bookId) throws Exception {
        Optional<Book> book = bookRepository.findById(bookId);
        Checkout validateCheckout = checkoutRepository.findByUserEmailAndBookId(userEmail, bookId);
        if (book.isEmpty() || validateCheckout == null) {
            throw new Exception("Book dose not exist or not checked out by user");
        }
        book.get().setCopiesAvailable(book.get().getCopiesAvailable() + 1);
        bookRepository.save(book.get());
        checkoutRepository.deleteById(validateCheckout.getId());
        //save in history
        History history = new History(userEmail,
                validateCheckout.getCheckoutDate(),
                LocalDate.now().toString(),
                book.get().getTitle(),
                book.get().getAuthor(),
                book.get().getDescription(),
                book.get().getImg()
        );
        historyRepository.save(history);
    }

    public void renewLoan(String userEmail, Long bookId) throws Exception{
        Checkout validateCheckout = checkoutRepository.findByUserEmailAndBookId(userEmail, bookId);
       if(validateCheckout==null){
           throw new Exception("Book dose not exist or not checked out by user");
       }

       SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");

       Date d1 = sdf.parse(validateCheckout.getReturnDate());
       Date d2 = sdf.parse(LocalDate.now().toString());

       if(d1.compareTo(d2) > 0 || d1.compareTo(d2) ==0){
           validateCheckout.setReturnDate(LocalDate.now().plusDays(7).toString());
            checkoutRepository.save(validateCheckout);
       }
    }
}
