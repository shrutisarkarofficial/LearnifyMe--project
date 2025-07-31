package com.Major.Online.Exam.Controller;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.RestTemplate;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/gemini")
public class GeminiController {

    @Value("${gemini.api.key}")
    private String geminiApiKey;

    private final String GEMINI_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=";

    @PostMapping("/generate")
    public ResponseEntity<Map<String, Object>> generateCourseChat(
            @RequestBody Map<String, String> payload
    ) {
        String courseName = payload.get("courseName");
        String courseDescription = payload.get("courseDescription");
        String userQuery = payload.get("query");

        // SYSTEM prompt to restrict chatbot scope
        String systemPrompt = "You are a course assistant chatbot for the course '" + courseName + "'. "
                + "Your job is to answer any doubts, provide brief explanations, or reply to queries **strictly related to this course only**. "
                + "Course Description: " + courseDescription + ". "
                + "If a question is irrelevant or outside the scope of this course, politely refuse to answer.";

        // User query prompt
        Map<String, Object> systemPart = new HashMap<>();
        systemPart.put("text", systemPrompt);

        Map<String, Object> userPart = new HashMap<>();
        userPart.put("text", userQuery);

        Map<String, Object> systemContent = new HashMap<>();
        systemContent.put("role", "model");  // system-level instruction
        systemContent.put("parts", List.of(systemPart));

        Map<String, Object> userContent = new HashMap<>();
        userContent.put("role", "user");
        userContent.put("parts", List.of(userPart));

        Map<String, Object> requestBody = new HashMap<>();
        requestBody.put("contents", List.of(systemContent, userContent));

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        HttpEntity<Map<String, Object>> entity = new HttpEntity<>(requestBody, headers);

        RestTemplate restTemplate = new RestTemplate();

        try {
            ResponseEntity<Map> response = restTemplate.exchange(
                    GEMINI_URL + geminiApiKey,
                    HttpMethod.POST,
                    entity,
                    Map.class
            );

            Map<String, Object> body = response.getBody();
            String textResponse = "";

            if (body != null && body.containsKey("candidates")) {
                List<Map<String, Object>> candidates = (List<Map<String, Object>>) body.get("candidates");
                if (!candidates.isEmpty() && candidates.get(0).containsKey("content")) {
                    Map<String, Object> content = (Map<String, Object>) candidates.get(0).get("content");
                    List<Map<String, Object>> parts = (List<Map<String, Object>>) content.get("parts");
                    if (!parts.isEmpty() && parts.get(0).containsKey("text")) {
                        textResponse = (String) parts.get(0).get("text");
                    }
                }
            }

            Map<String, Object> result = new HashMap<>();
            result.put("status", "success");
            result.put("text", textResponse);

            return ResponseEntity.ok(result);


        } catch (Exception e) {
            Map<String, Object> error = new HashMap<>();
            error.put("status", "error");
            error.put("message", e.getMessage());

            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
        }
    }

    @PostMapping("/generate-teacher-assist")
    public ResponseEntity<Map<String, Object>> generateTeacherAssistantResponse(
            @RequestBody Map<String, String> payload
    ) {
        String courseName = payload.get("courseName");
        String courseDescription = payload.get("courseDescription");
        String teacherPrompt = payload.get("query");

        // SYSTEM prompt tailored for a teacher-assistant chatbot
        String systemPrompt = "You are a teacher assistant chatbot for the course titled '" + courseName + "'. "
                + "Your responsibilities include helping the teacher with: creating lecture notes, planning course modules, designing exams, and addressing teaching-related queries. "
                + "All guidance should strictly relate to the course subject and remain professional, educational, and structured. "
                + "Course Description: " + courseDescription + ". "
                + "If a query is unrelated to the course or outside the domain of educational planning or content development, politely refuse to answer.";

        // Create message parts
        Map<String, Object> systemPart = new HashMap<>();
        systemPart.put("text", systemPrompt);

        Map<String, Object> userPart = new HashMap<>();
        userPart.put("text", teacherPrompt);

        Map<String, Object> systemContent = new HashMap<>();
        systemContent.put("role", "model");  // model/system-level directive
        systemContent.put("parts", List.of(systemPart));

        Map<String, Object> userContent = new HashMap<>();
        userContent.put("role", "user");
        userContent.put("parts", List.of(userPart));

        Map<String, Object> requestBody = new HashMap<>();
        requestBody.put("contents", List.of(systemContent, userContent));

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        HttpEntity<Map<String, Object>> entity = new HttpEntity<>(requestBody, headers);
        RestTemplate restTemplate = new RestTemplate();

        try {
            ResponseEntity<Map> response = restTemplate.exchange(
                    GEMINI_URL + geminiApiKey,
                    HttpMethod.POST,
                    entity,
                    Map.class
            );

            Map<String, Object> body = response.getBody();
            String textResponse = "";

            if (body != null && body.containsKey("candidates")) {
                List<Map<String, Object>> candidates = (List<Map<String, Object>>) body.get("candidates");
                if (!candidates.isEmpty() && candidates.get(0).containsKey("content")) {
                    Map<String, Object> content = (Map<String, Object>) candidates.get(0).get("content");
                    List<Map<String, Object>> parts = (List<Map<String, Object>>) content.get("parts");
                    if (!parts.isEmpty() && parts.get(0).containsKey("text")) {
                        textResponse = (String) parts.get(0).get("text");
                    }
                }
            }

            Map<String, Object> result = new HashMap<>();
            result.put("status", "success");
            result.put("text", textResponse);

            return ResponseEntity.ok(result);

        } catch (Exception e) {
            Map<String, Object> error = new HashMap<>();
            error.put("status", "error");
            error.put("message", "Failed to generate teacher assistant response: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
        }
    }

}