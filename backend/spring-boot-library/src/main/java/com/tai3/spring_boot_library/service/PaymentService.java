package com.tai3.spring_boot_library.service;

import com.tai3.spring_boot_library.utils.ExtractJWT;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.text.SimpleDateFormat;
import java.time.Instant;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.time.temporal.ChronoUnit;
import java.util.TreeMap;

@Service
public class PaymentService {
    @Value("${vnpay_url}")
    StringBuilder VNPAY_URL;
    @Value("${vnpay_version}")
    String VNPAY_VERSION;
    @Value("${vnpay_code}")
    String VNPAY_CODE;

    /** CREATE VNPAY URL
     * STEP 1: need create account, and they will give essential value
     * STEP 2: must put require key-value
     * STEP 3: url encode these value to avoid special character or whitespace
     * STEP 4: need hash these data
     * ENJOY
     * */
    public String createPaymentUrl(String amount, String orderInfo) {
        Map<String, String> vnp_Params = new TreeMap<>();
        vnp_Params.put("vnp_Version", VNPAY_VERSION);
        vnp_Params.put("vnp_Command", "pay");
        vnp_Params.put("vnp_TmnCode", VNPAY_CODE);
        vnp_Params.put("vnp_Amount", String.valueOf(Integer.parseInt(amount) * 100));
        vnp_Params.put("vnp_CurrCode", "VND");
        vnp_Params.put("vnp_TxnRef", String.valueOf((int) (Math.random() * 99999)));
        vnp_Params.put("vnp_OrderInfo", orderInfo);
        vnp_Params.put("vnp_OrderType", "other");
        vnp_Params.put("vnp_Locale", "vn");
        vnp_Params.put("vnp_ReturnUrl", "https://www.w3schools.com");
        vnp_Params.put("vnp_IpAddr", "127.0.0.1");
        vnp_Params.put("vnp_CreateDate", new SimpleDateFormat("yyyyMMddHHmmss").format(Date.from(Instant.now())));
        vnp_Params.put("vnp_ExpireDate", new SimpleDateFormat("yyyyMMddHHmmss").format(Date.from(Instant.now().plus(30, ChronoUnit.MINUTES))));
        StringBuilder query = new StringBuilder();
        // Lọc các param có giá trị hợp lệ và xử lý encoding
        vnp_Params.entrySet().stream()
                .filter(entry -> entry.getValue() != null && !entry.getValue().isEmpty())
//                .sorted(Map.Entry.comparingByKey())
                .forEach(entry -> {
                    String encodedKey = URLEncoder.encode(entry.getKey(), StandardCharsets.UTF_8);
                    String encodedValue = URLEncoder.encode(entry.getValue(), StandardCharsets.UTF_8);
                    query.append(encodedKey).append("=").append(encodedValue).append("&");
                });
        // Xóa ký tự '&' cuối cùng
        if (query.length() > 0) {
            query.setLength(query.length() - 1);
        }
        String secureHash = ExtractJWT.hmacSHA512(query.toString());
        return VNPAY_URL.append("?").append(query).append("&vnp_SecureHash=").append(secureHash).toString();
    }

//    public String createPaymentUrl2(String amount, String orderInfo) {
//        String vnp_Url = "https://sandbox.vnpayment.vn/paymentv2/vpcpay.html";
//        //Các bạn có thể tham khảo tài liệu hướng dẫn và điều chỉnh các tham số
//        String vnp_Version = "2.1.0";
//        String vnp_Command = "pay";
//        String vnp_TxnRef = String.valueOf((int) (Math.random() * 999999));
//        String vnp_IpAddr = "127.0.0.1";
//        String vnp_TmnCode = "P8MLOPY2";
//        String orderType = "other";
//
//        Map<String, String> vnp_Params = new HashMap<>();
//        vnp_Params.put("vnp_Version", vnp_Version);
//        vnp_Params.put("vnp_Command", vnp_Command);
//        vnp_Params.put("vnp_TmnCode", vnp_TmnCode);
//        vnp_Params.put("vnp_Amount", String.valueOf(Integer.parseInt(amount) * 100));
//        vnp_Params.put("vnp_CurrCode", "VND");
//
//        vnp_Params.put("vnp_TxnRef", vnp_TxnRef);
//        vnp_Params.put("vnp_OrderInfo", orderInfo);
//        vnp_Params.put("vnp_OrderType", orderType);
//
//        String locate = "vn";
//        vnp_Params.put("vnp_Locale", locate);
//
//        vnp_Params.put("vnp_ReturnUrl", "https://www.w3schools.com");
//        vnp_Params.put("vnp_IpAddr", vnp_IpAddr);
//
//        Calendar cld = Calendar.getInstance(TimeZone.getTimeZone("Etc/GMT+7"));
//        SimpleDateFormat formatter = new SimpleDateFormat("yyyyMMddHHmmss");
//        String vnp_CreateDate = formatter.format(cld.getTime());
//        vnp_Params.put("vnp_CreateDate", vnp_CreateDate);
//
//        cld.add(Calendar.MINUTE, 30);
//        String vnp_ExpireDate = formatter.format(cld.getTime());
//        vnp_Params.put("vnp_ExpireDate", vnp_ExpireDate);
//
//        List fieldNames = new ArrayList(vnp_Params.keySet());
//        Collections.sort(fieldNames);
//        StringBuilder hashData = new StringBuilder();
//        StringBuilder query = new StringBuilder();
//        Iterator itr = fieldNames.iterator();
//        while (itr.hasNext()) {
//            String fieldName = (String) itr.next();
//            String fieldValue = (String) vnp_Params.get(fieldName);
//            if ((fieldValue != null) && (!fieldValue.isEmpty())) {
//                //Build hash data
//                hashData.append(fieldName);
//                hashData.append('=');
//                hashData.append(URLEncoder.encode(fieldValue, StandardCharsets.UTF_8));
//                //Build query
//                query.append(URLEncoder.encode(fieldName, StandardCharsets.UTF_8));
//                query.append('=');
//                query.append(URLEncoder.encode(fieldValue, StandardCharsets.UTF_8));
//                if (itr.hasNext()) {
//                    query.append('&');
//                    hashData.append('&');
//                }
//            }
//        }
//        String queryUrl = query.toString();
////        String salt = "NYNDX9S1O6LEP2F6Y3H45FEOU5YTW4H6";
////        String vnp_SecureHash = ExtractJWT.hmacSHA512(salt, hashData.toString());
//        String vnp_SecureHash = ExtractJWT.hmacSHA512(hashData.toString());
//        queryUrl += "&vnp_SecureHash=" + vnp_SecureHash;
//        return "https://sandbox.vnpayment.vn/paymentv2/vpcpay.html" + "?" + queryUrl;
//    }
}
