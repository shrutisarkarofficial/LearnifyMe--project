package com.Major.Online.Exam.Controller;

import com.Major.Online.Exam.Service.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    @Autowired
    private  AuthService authService;

    @PostMapping("/register")
    public ResponseEntity<Map<String, Object>> register(@RequestBody Map<String, Object> request) {
        try {
            Map<String, Object> response = authService.register(request);

           return ResponseEntity.ok(response);
        }catch(Exception e){
            return ResponseEntity.badRequest().body(Map.of("status", "Error","message","exception"+e));
        }

    }

    @PostMapping("/login")
    public ResponseEntity<Map<String, Object>> login(@RequestBody Map<String, Object> request) {
        try {
            Map<String, Object> response = authService.login(request);
            return ResponseEntity.ok(response);
        }catch(Exception e){
            return ResponseEntity.badRequest().body(Map.of("status", "Error","message","exception"+e));
        }
    }
}
