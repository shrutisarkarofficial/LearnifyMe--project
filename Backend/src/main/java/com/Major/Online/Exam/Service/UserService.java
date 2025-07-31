package com.Major.Online.Exam.Service;

import com.Major.Online.Exam.Entity.Users;
import com.Major.Online.Exam.Helper.ImageUploadHelper;
import com.Major.Online.Exam.Repository.UserRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.multipart.MultipartFile;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class UserService {
    @Autowired
    private UserRepo userRepo;

    @Autowired
    private EmailService emailService;

    @Autowired
    public UserService(UserRepo userRepo) {
        this.userRepo = userRepo;
    }

    private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();
    private final RestTemplate restTemplate = new RestTemplate(); // Initialize RestTemplate once


    public Map<String, Object> getUserInfoByEmail(String email) {
        Users user = userRepo.findByEmail(email);

        Map<String, Object> userInfo = new HashMap<>();
        userInfo.put("userid", user.getId());
        userInfo.put("name", user.getName());
        userInfo.put("role", user.getRole().name());
        userInfo.put("email", user.getEmail());
        userInfo.put("profileImage", user.getProfile());

        return userInfo;
    }

    public List<Map<String, Object>> getAllUserDetails() {
        List<Object[]> rows = userRepo.findAllUserDetails();
        List<Map<String, Object>> result = new ArrayList<>();

        for (Object[] row : rows) {
            Map<String, Object> userMap = new HashMap<>();
            userMap.put("id", row[0]);
            userMap.put("name", row[1]);
            userMap.put("role", row[2]);
            userMap.put("createdAt", row[3]);
            result.add(userMap);
        }

        return result;
    }


    public boolean deleteUserById(Long userId) {
        if (userRepo.existsById(userId)) {
            userRepo.deleteById(userId);
            return true;
        } else {
            return false;
        }
    }

    public Map<String, Object> sendOtp(String email) {
        Map<String, Object> response = new HashMap<>();

        try {
            Users existingUser = userRepo.findByEmail(email);
            if(existingUser!=null){


                String otp = generateOtp();

                // Send the OTP using your EmailService

                emailService.sendEmail(email, "Your OTP Code", "Your OTP is: " + otp);

                response.put("status", "success");
                response.put("otp", otp); // For demo purposes. Remove this in production!
                response.put("message", "OTP sent to " + email);
            }
            else {
                response.put("status", "failed");
                response.put("message", "Enter Registered Email " );
            }
            return response;

        } catch (Exception e) {
            response.put("status", "error");
            response.put("message", "Failed to send OTP: " + e.getMessage());
            return response; // <-- This is important! You need to return something here
        }
    }

    public String updatePassword(String email,String password)
    {
        Users existingUser=userRepo.findByEmail(email);
        String msg="";
        if(existingUser!=null && password!=null)
        {
            String hashedPassword = passwordEncoder.encode(password);
            existingUser.setPassword(hashedPassword);
            userRepo.save(existingUser);
            msg="Password Updated Successfully";
        }
        else{
            msg="Error Updating Password";
        }
        return msg;

    }
    // Method to generate a 6-digit OTP
    private String generateOtp() {
        int otpValue = (int)(Math.random() * 900000) + 100000;
        return String.valueOf(otpValue);
    }

}
