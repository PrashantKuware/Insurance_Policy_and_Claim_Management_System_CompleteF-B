package com.monocept.demo.service.impl;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import com.monocept.demo.service.SmsService;
import com.twilio.Twilio;
import com.twilio.rest.api.v2010.account.Message;
import com.twilio.type.PhoneNumber;

@Service
public class SmsServiceImpl implements SmsService {

    @Value("${twilio.account.sid}")
    private String accountSid;

    @Value("${twilio.auth.token}")
    private String authToken;

    @Value("${twilio.phone.number}")
    private String twilioNumber;

    @Override
    public void sendOtp(String mobileNumber, String otp) {

        mobileNumber = mobileNumber.trim();

        if (!mobileNumber.startsWith("+")) {
            mobileNumber = "+91" + mobileNumber;
        }

        System.out.println("Sending to = " + mobileNumber);

        Twilio.init(accountSid, authToken);

        Message.creator(
                new PhoneNumber(mobileNumber),
                new PhoneNumber(twilioNumber),
                "Your OTP is: " + otp)
                .create();
    }
}