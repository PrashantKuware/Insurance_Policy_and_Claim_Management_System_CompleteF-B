package com.monocept.demo.service;

public interface SmsService {

    void sendOtp(String mobileNumber, String otp);
}