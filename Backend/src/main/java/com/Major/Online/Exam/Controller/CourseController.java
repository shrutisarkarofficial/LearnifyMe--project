package com.Major.Online.Exam.Controller;

import com.Major.Online.Exam.Entity.Courses;
import com.Major.Online.Exam.Service.CourseService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/courses")
public class CourseController {
    @Autowired
    private CourseService courseService;

    public CourseController(CourseService courseService) {
        this.courseService = courseService;
    }

    @GetMapping("/teacher/{teacherId}")
    public ResponseEntity<List<Map<String, Object>>> getCoursesByTeacher(@PathVariable Long teacherId) {
        List<Map<String, Object>> courses = courseService.getCoursesByTeacherId(teacherId);
        return ResponseEntity.ok(courses);
    }

    @PostMapping("/create")
    public ResponseEntity<Map<String, Object>> createCourse(@RequestBody Map<String, Object> request) {
        Map<String, Object> course = courseService.createCourse(request);
        return ResponseEntity.ok(course);
    }


}
