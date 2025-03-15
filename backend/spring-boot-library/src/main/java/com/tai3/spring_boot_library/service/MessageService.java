package com.tai3.spring_boot_library.service;

import com.tai3.spring_boot_library.model.Message;
import com.tai3.spring_boot_library.repository.MessageRepository;
import com.tai3.spring_boot_library.request.models.AdminQuestionReq;
import lombok.AccessLevel;
import lombok.experimental.FieldDefaults;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

@Service
@Transactional
@FieldDefaults(level = AccessLevel.PRIVATE)
public class MessageService {

    final MessageRepository messageRepository;

    public MessageService(MessageRepository messageRepository) {
        this.messageRepository = messageRepository;
    }

    public void postMessage(Message messageRequest, String userEmail){
        Message message = new Message(messageRequest.getTitle(), messageRequest.getQuestion());
        message.setUserEmail(userEmail);
        messageRepository.save(message);
    }

    public void putMessage(AdminQuestionReq req, String userEmail) throws Exception {
        Optional<Message> message = messageRepository.findById(req.getId());
        if(message.isEmpty()){
            throw new Exception("Message not found !!!");
        }
        message.get().setAdminEmail(userEmail);
        message.get().setResponse(req.getResponse());
        message.get().setClosed(true);
        messageRepository.save(message.get());
    }
}
