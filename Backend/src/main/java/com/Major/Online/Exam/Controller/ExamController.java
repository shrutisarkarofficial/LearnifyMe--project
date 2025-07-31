package com.Major.Online.Exam.Controller;

import com.Major.Online.Exam.DTO.ExamRequest;
import com.Major.Online.Exam.Entity.Exams;
import com.Major.Online.Exam.Service.ExamService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/exams")
public class ExamController {

    @Autowired
    private ExamService examService;

    @PostMapping("/create")
    public ResponseEntity<Map<String, Object>> createExam(@RequestBody ExamRequest requestData) {
        return examService.createExam( requestData);
    }

    @GetMapping("/summary/{courseId}")
    public ResponseEntity<Map<String, Object>> getExamSummaries(@PathVariable Long courseId) {
        return examService.getExamSummariesByCourseId(courseId);
    }

    @GetMapping("/student/{courseId}/{studentId}")
    public ResponseEntity<Map<String, Object>> getExams(
            @PathVariable Long courseId,
            @PathVariable Long studentId) {
        return examService.getExamSummaries(courseId, studentId);
    }

    @GetMapping("/details/{examId}")
    public ResponseEntity<Map<String, Object>> getExamDetails(@PathVariable Long examId) {
        return examService.getExamDetails(examId);
    }
}
