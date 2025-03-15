package com.tai3.spring_boot_library.repository;

import com.tai3.spring_boot_library.model.Checkout;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CheckoutRepository extends JpaRepository<Checkout, Long> {
    //Derived method
    //wih using spring date rest, it will auto get entity, and automatically create
    //path urls
    public abstract Checkout findByUserEmailAndBookId(String userEmail, Long bookId);

    abstract List<Checkout> findBooksByUserEmail(String userEmail);

    @Modifying
    @Query(value = "DELETE FROM Checkout AS c WHERE c.bookId IN :book_id")
    void deleteAllByBookId(@Param(value = "book_id") Long bookId);

    @Query(nativeQuery = true, value = "SELECT COUNT(c.id) from checkout as c WHERE c.user_email = ?1 AND STR_TO_DATE(c.return_date, '%Y-%m-%d') < CURRENT_DATE()")
    Integer findCheckoutByUserEmailHasReturnDateExpired(String userEmail);
}
