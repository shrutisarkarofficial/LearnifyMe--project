package com.Major.Online.Exam.Controller;

import com.Major.Online.Exam.Entity.Courses;
import com.Major.Online.Exam.Repository.EnrollRepo;
import com.Major.Online.Exam.Service.EnrollmentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/enrollments")
public class EnrollmentController {

    @Autowired
    private EnrollmentService enrollmentService;

    @Autowired
    private EnrollRepo enrollRepo;

    @PostMapping("/join")
    public ResponseEntity<Map<String, Object>> joinCourse(@RequestBody Map<String, Object> request) {
        Map<String, Object> response = enrollmentService.joinCourse(request);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/student/{studentId}")
    public ResponseEntity<Map<String, Object>> getCoursesForStudent(@PathVariable Long studentId) {
        Map<String, Object> response = new HashMap<>();
        try {
            List<Map<String, Object>> courses = enrollmentService.getCoursesByStudentId(studentId);
            response.put("status", "success");
            response.put("courses", courses);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            response.put("status", "error");
            response.put("message", "Failed to fetch courses: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    @GetMapping("/students/{courseId}")
    public ResponseEntity<Map<String, Object>> getStudentsByCourse(@PathVariable Long courseId) {
        return enrollmentService.getStudentsByCourseId(courseId);
    }

    @DeleteMapping("/delete/{courseId}/{studentId}")
    public ResponseEntity<String> deleteEnrollment(@PathVariable Long courseId, @PathVariable Long studentId) {
        enrollRepo.deleteEnrollmentByCourseIdAndStudentId(courseId, studentId);
        return ResponseEntity.ok("Student removed from course");
    }
}

