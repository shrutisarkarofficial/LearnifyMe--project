package com.Major.Online.Exam.Controller;

import com.Major.Online.Exam.Config.JwtUtil;
import com.Major.Online.Exam.DTO.UserDto;
import com.Major.Online.Exam.Entity.Users;
import com.Major.Online.Exam.Helper.ImageUploadHelper;
import com.Major.Online.Exam.Repository.UserRepo;
import com.Major.Online.Exam.Service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/users")
public class UserController {
    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private UserService userService;

    @Autowired
    private UserRepo userRepo;

    @Autowired
    private ImageUploadHelper imageUploadHelper;


    @GetMapping("/me")
    public ResponseEntity<Map<String, Object>> getCurrentUser(Authentication authentication) {
        String email = authentication.getName(); // Extracted from JWT
        Map<String, Object> userData = userService.getUserInfoByEmail(email);
        return ResponseEntity.ok(userData);
    }


    @GetMapping("/all")
    public ResponseEntity<List<Map<String, Object>>> getAllUsers() {
        List<Map<String, Object>> users = userService.getAllUserDetails();
        return ResponseEntity.ok(users);
    }


    @DeleteMapping("/{userId}")
    public ResponseEntity<String> deleteUser(@PathVariable Long userId) {
        boolean deleted = userService.deleteUserById(userId);
        if (deleted) {
            return ResponseEntity.ok("User deleted successfully");
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found or could not be deleted");
        }
    }

//    @PostMapping("/{userId}/update-profilePic")
//    public ResponseEntity<String> updateProfilePic(
//            @PathVariable Long userId,
//            @RequestParam("profilePic") MultipartFile file) {
//
//        try {
//            Optional<Users> optionalUser = userRepo.findById(userId);
//            if (optionalUser.isEmpty()) {
//                return new ResponseEntity<>("User not found", HttpStatus.NOT_FOUND);
//            }
//
//            Users user = optionalUser.get();
//
//            // Validate image type
//            if (!file.getContentType().startsWith("image/")) {
//                return new ResponseEntity<>("Only image files are allowed", HttpStatus.BAD_REQUEST);
//            }
//
//            // Upload file
//            boolean isUploaded = imageUploadHelper.uploadFile(file);
//            if (!isUploaded) {
//                return new ResponseEntity<>("File upload failed", HttpStatus.INTERNAL_SERVER_ERROR);
//            }
//
//            // Save filename (or URL path) to DB
//            user.setProfile("/uploads/" + file.getOriginalFilename());
//            userRepo.save(user);
//
//            return new ResponseEntity<>("Profile picture updated successfully", HttpStatus.OK);
//        } catch (Exception e) {
//            return new ResponseEntity<>("Error: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
//        }
//    }
//
//    @GetMapping("/{userId}/profile-image-url")
//    public ResponseEntity<Map<String, String>> getProfileImageUrl(@PathVariable Long userId) {
//        Optional<Users> userOpt = userRepo.findById(userId);
//
//        if (userOpt.isEmpty()) {
//            return ResponseEntity.status(HttpStatus.NOT_FOUND)
//                    .body(Map.of("message", "User not found"));
//        }
//
//        Users user = userOpt.get();
//        String imagePath = "/src/main/resources/static" + user.getProfile(); // e.g., /upload/myimage.jpg
//
//        if (imagePath == null || imagePath.isBlank()) {
//            return ResponseEntity.status(HttpStatus.NOT_FOUND)
//                    .body(Map.of("message", "Profile image not set"));
//        }
//
//        Map<String, String> response = new HashMap<>();
//        response.put("imageUrl", imagePath); // return only relative path
//
//        return ResponseEntity.ok(response);
//    }


    @PostMapping("/send-otp")
    public ResponseEntity<Map<String, Object>> receiveOtp(@RequestBody Map<String, Object> entity) {
        try {
            String email = (String) entity.get("email");
            Map<String, Object> otpData = userService.sendOtp(email); // already sends the OTP

            String token = jwtUtil.generateOtpToken(email, otpData.get("otp").toString(),360);

            Map<String, Object> response = new HashMap<>();
            response.put("token", token);
            response.put("message", "OTP sent to " + email);
            response.put("status", "success");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("status", "error");
            errorResponse.put("message", "An error occurred while sending OTP: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
        }
    }

    @PostMapping("/verify-otp")
    public ResponseEntity<Map<String, Object>> verifyOtp(@RequestBody Map<String, Object> entity) {
        try {
            String userEnteredOtp = (String) entity.get("otp");
            String token = (String) entity.get("token");

            Map<String, Object> claims = jwtUtil.validateAndExtractClaims(token);
            String sessionOtp = claims.get("otp").toString();
            String email = claims.get("email").toString();

            Map<String, Object> response = new HashMap<>();
            if (sessionOtp.equals(userEnteredOtp)) {
                response.put("status", "success");
                response.put("message", "OTP verified successfully.");
                response.put("email", email);
                return ResponseEntity.ok(response);
            } else {
                response.put("status", "failure");
                response.put("message", "Invalid OTP.");
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
            }
        } catch (Exception e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("status", "error");
            errorResponse.put("message", "Error verifying OTP: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
        }
    }

    @PutMapping("/update-password")
    public ResponseEntity<String> updatePassword(@RequestBody Map<String,Object> entity) {
        //TODO: process PUT request
        try {
            String email=(String)entity.get("email");
            String password=(String)entity.get("password");
            String response=userService.updatePassword(email, password);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            // TODO: handle exception
            return ResponseEntity.status(500).body("Error updating password: " + e.getMessage());
        }

    }

}
