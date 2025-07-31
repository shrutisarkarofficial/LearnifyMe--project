package com.Major.Online.Exam.DTO;

import lombok.Data;

@Data
public class RegisterRequest {
    private String name;
    private String email;
    private String countryCode;
    private String mobile;
    private String role;
    private String password;
    private String confirmPassword;
}
