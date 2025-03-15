package com.tai3.spring_boot_library.repository;

import com.tai3.spring_boot_library.model.Book;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.web.bind.annotation.RequestParam;

import java.util.List;

public interface BookRepository extends JpaRepository<Book, Long> {
    //Derived methods
    Page<Book> findByTitleContaining(@RequestParam(name = "title") String title, Pageable pageable);

    Page<Book> findByCategory(@RequestParam(name = "category") String category, Pageable pageable);
    @Query("SELECT b from Book b where b.id in :book_ids ")
    List<Book> findBooksByBookIds(@Param("book_ids") List<Long> bookIds);
}
