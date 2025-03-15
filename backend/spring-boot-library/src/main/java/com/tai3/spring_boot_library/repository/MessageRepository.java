package com.tai3.spring_boot_library.repository;

import com.tai3.spring_boot_library.model.Message;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import org.springframework.web.bind.annotation.RequestParam;

@Repository
public interface MessageRepository extends JpaRepository<Message, Long> {
    Page<Message> findByUserEmail(@RequestParam(name = "user_email") String userEmail, Pageable pageable);

    Page<Message> findByClosed(@RequestParam(name = "closed") boolean closed, Pageable pageable);
}
