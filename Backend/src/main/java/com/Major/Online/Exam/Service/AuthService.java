package com.Major.Online.Exam.Service;

import java.lang.String;

import com.Major.Online.Exam.Config.JwtUtil;
import com.Major.Online.Exam.Entity.Admin;
import com.Major.Online.Exam.Entity.Role;
import com.Major.Online.Exam.Entity.Users;
import com.Major.Online.Exam.Repository.AdminRepo;
import com.Major.Online.Exam.Repository.UserRepo;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

@Service
@RequiredArgsConstructor
@Transactional
public class AuthService {

    @Autowired
    private UserRepo userRepo;

    @Autowired
    private AdminRepo adminRepo;

    @Autowired
    private PasswordEncoder passwordEncoder;
    @Autowired
    private JwtUtil jwtUtil;

    public Map<String, Object> register(Map<String, Object> request) {
        //Validate password and confirm password
        System.out.println(request);
        Map<String, Object> ob= new HashMap<>();
        String name= (String) request.get("name");
        String email= (String) request.get("email");
        Role role = Role.valueOf(((String) request.get("role")).toUpperCase());
        String profile= (String) request.get("profile");
        String password= (String) request.get("password");
        String confirmpassword= (String) request.get("confirmpassword");

        if (!password.equals(confirmpassword)) {
            ob.put("status", "Fail");
            ob.put("message", "Password not matched");
            return ob;
        }
        // Check if email already exists, etc. (optional but good)
        if (userRepo.findByEmail(email) != null) {
            ob.put("status", "Fail");
            ob.put("message", "email already exits");
            return ob;
        }
        System.out.println(ob);
        // Convert AuthRequest to Users entity
        Users user = new Users();
        user.setName(name);
        user.setEmail(email);
        user.setRole(role);
        user.setPassword(passwordEncoder.encode(password));
        user.setCreatedAt(LocalDateTime.now());


        userRepo.save(user);

        //Wrap user into CustomUsrDetails and generate token

        ob.put("status", "Success");
        ob.put("message", "Registered successfully");

        System.out.println(ob);
        return ob;
    }

    public Map<String, Object> login(Map<String, Object> request) {

        Map<String, Object> response = new HashMap<>();
        try {
            String email = (String) request.get("email");
            String password = (String) request.get("password");

            Users existinguser = userRepo.findByEmail(email);
            if (existinguser != null && passwordEncoder.matches(password, existinguser.getPassword())) {
                response.put("status", "Success");
                response.put("message", "Login successful");

                Map<String, Object> userdata = new HashMap<>();
                userdata.put("userid", existinguser.getId());
                userdata.put("name", existinguser.getName());
                userdata.put("email", existinguser.getEmail());
                userdata.put("role", existinguser.getRole());
                userdata.put("profile", existinguser.getProfile());

                response.put("userdata", userdata);
                return response;
            }

            Admin existingAdmin = adminRepo.findByEmail(email);

            if (existingAdmin != null && passwordEncoder.matches(password, existingAdmin.getPasswordHash())) {
                response.put("status", "Success");
                response.put("message", "Admin login successful");

                Map<String, Object> userdata = new HashMap<>();
                userdata.put("userid", existingAdmin.getId());
                userdata.put("name", existingAdmin.getUsername());
                userdata.put("email", existingAdmin.getEmail());
                userdata.put("role", "ADMIN");
                userdata.put("profile", existingAdmin.getProfileImageUrl());

                response.put("userdata", userdata);
                return response;
            }
            response.put("status", "Failed");
            response.put("message", "Invalid email or password");

        } catch (Exception e) {
            e.printStackTrace(); // Log the real error
            response.put("status", "Error");
            response.put("message", "Exception occurred: " + e.getMessage());
        }
        return response;
    }

}
