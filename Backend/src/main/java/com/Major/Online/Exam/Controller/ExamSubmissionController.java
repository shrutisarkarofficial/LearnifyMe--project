package com.Major.Online.Exam.Controller;

import com.Major.Online.Exam.DTO.ExamStatusDTO;
import com.Major.Online.Exam.DTO.ExamSubDTO;
import com.Major.Online.Exam.Entity.Exam_Submissions;
import com.Major.Online.Exam.Service.ExamSubService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/exams")
public class ExamSubmissionController {
    @Autowired
    private ExamSubService service;

    @PostMapping("/submit")
    public ResponseEntity<Map<String, Object>> submitExam(@RequestBody Map<String, Object> payload) {
        return service.submitExam(payload);
    }

    @GetMapping("/status/{courseId}")
    public ResponseEntity<List<Map<String, Object>>> getExamStatusByCourse(@PathVariable Long courseId) {
        List<Map<String, Object>> statusList = service.getExamStatusForCourse(courseId);
        return ResponseEntity.ok(statusList);
    }


}
