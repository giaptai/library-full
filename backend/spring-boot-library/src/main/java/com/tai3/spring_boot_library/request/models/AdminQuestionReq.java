package com.tai3.spring_boot_library.request.models;

import lombok.AccessLevel;
import lombok.Data;
import lombok.experimental.FieldDefaults;

@Data
@FieldDefaults(level = AccessLevel.PRIVATE)
public class AdminQuestionReq {
    Long id;
    String response;
}
