package com.tai3.spring_boot_library.controller;

import com.tai3.spring_boot_library.service.PaymentService;
import jakarta.servlet.http.HttpServletRequest;
import lombok.AccessLevel;
import lombok.experimental.FieldDefaults;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/payment")
@FieldDefaults(level = AccessLevel.PRIVATE)
public class PaymentController {
    final PaymentService paymentService;

    public PaymentController(PaymentService paymentService) {
        this.paymentService = paymentService;
    }

    @GetMapping(path = "/secure/vnpay/create-url")
    public String vnpayReturn(HttpServletRequest request) {
        return paymentService.createPaymentUrl(request.getParameter("vnp_Amount"), request.getParameter("vnp_OrderInfo"));
    }

    @GetMapping(path = "/secure/vnpay/ipn")
    public String vnpayIpn(HttpServletRequest request){
        return "";
    }
}
