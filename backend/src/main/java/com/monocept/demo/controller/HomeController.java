package com.monocept.demo.controller;


import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@CrossOrigin("http://localhost:5173/")
public class HomeController {

    @GetMapping("/")
    public String home() {
        return "Insurance Policy and Claim Management System Running Successfully";
    }
}