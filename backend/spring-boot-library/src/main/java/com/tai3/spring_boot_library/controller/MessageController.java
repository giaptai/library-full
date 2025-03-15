package com.tai3.spring_boot_library.controller;

import com.tai3.spring_boot_library.model.Message;
import com.tai3.spring_boot_library.request.models.AdminQuestionReq;
import com.tai3.spring_boot_library.service.MessageService;
import com.tai3.spring_boot_library.utils.ExtractJWT;
import lombok.AccessLevel;
import lombok.experimental.FieldDefaults;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping(path = "/api/messages")
@FieldDefaults(level = AccessLevel.PRIVATE)
public class MessageController {
    final MessageService messageService;

    public MessageController(MessageService messageService) {
        this.messageService = messageService;
    }

    @PostMapping(path = "/secure/add/message")
    public void postMessage(@RequestHeader(name = "Authorization") String token, @RequestBody Message req) {
        String userEmail = ExtractJWT.payLoadJWTExtraction(token, "\"sub\"");
        messageService.postMessage(req, userEmail);
    }

    @PutMapping("/secure/admin/message")
    public void putMessage(@RequestHeader(name = "Authorization") String token,
                           @RequestBody AdminQuestionReq req) throws Exception {
        String userEmail = ExtractJWT.payLoadJWTExtraction(token, "\"sub\"");
        String admin = ExtractJWT.payLoadJWTExtraction(token, "\"userType\"");
        if(admin == null || !admin.equals("admin")){
            throw new Exception("Administration page only !!!");
        }
        messageService.putMessage(req, userEmail);
    }
}
