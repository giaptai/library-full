package com.tai3.spring_boot_library.repository;

import com.tai3.spring_boot_library.model.History;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.web.bind.annotation.RequestParam;

public interface HistoryRepository extends JpaRepository<History, Long> {
    //Derived methods
    Page<History> findBooksByUserEmail(@RequestParam(name = "user_email") String userEmail, Pageable pageable);
}
