package com.Major.Online.Exam.Service;

import com.Major.Online.Exam.Entity.Courses;
import com.Major.Online.Exam.Entity.Enrollments;
import com.Major.Online.Exam.Entity.Users;
import com.Major.Online.Exam.Repository.CourseRepo;
import com.Major.Online.Exam.Repository.EnrollRepo;
import com.Major.Online.Exam.Repository.UserRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class EnrollmentService {

    @Autowired
    private UserRepo userRepo;

    @Autowired
    private CourseRepo courseRepo;

    @Autowired
    private EnrollRepo enrollmentRepo;

    public Map<String, Object> joinCourse(Map<String, Object> request) {
        Map<String, Object> response = new HashMap<>();
        System.out.println(request);
        Long studentId = Long.valueOf(request.get("studentId").toString());
        String courseCode = (String) request.get("courseCode");

        Optional<Users> studentOpt = userRepo.findById(studentId);
        if (studentOpt.isEmpty()) {
            response.put("status", "fail");
            response.put("message", "Student not found.");
            return response;
        }

        Courses course = courseRepo.findByCourseCode(courseCode); // Assuming code is unique
        if (course == null) {
            response.put("status", "fail");
            response.put("message", "Course not found with the given code.");
            return response;
        }

        boolean alreadyEnrolled = enrollmentRepo.existsByStudentIdAndCourseId(studentId, course.getId());
        if (alreadyEnrolled) {
            response.put("status", "fail");
            response.put("message", "Student already enrolled in this course.");
            return response;
        }

        Enrollments enrollment = new Enrollments();
        enrollment.setStudent(studentOpt.get());
        enrollment.setCourse(course);
        enrollment.setEnrolledAt(LocalDateTime.now());

        enrollmentRepo.save(enrollment);

        response.put("status", "success");
        response.put("message", "Enrollment successful.");
        response.put("courseTitle", course.getCoursename());
        return response;
    }

    public List<Map<String, Object>> getCoursesByStudentId(Long studentId) {
        List<Object[]> results = enrollmentRepo.findCoursesByStudentIdNative(studentId);
        List<Map<String, Object>> courseList = new ArrayList<>();

        for (Object[] row : results) {
            Map<String, Object> courseMap = new HashMap<>();
            courseMap.put("id", row[0]);
            courseMap.put("course_name", row[1]);
            courseMap.put("course_code", row[2]);
            courseMap.put("description", row[3]);
            courseMap.put("createdAt", row[4]);
            courseMap.put("teacherName", row[5]);
            courseList.add(courseMap);
        }

        return courseList;
    }

    public ResponseEntity<Map<String, Object>> getStudentsByCourseId(Long courseId) {
        List<Object[]> results = enrollmentRepo.findStudentsByCourseId(courseId);

        List<Map<String, Object>> students = new ArrayList<>();
        for (Object[] row : results) {
            Map<String, Object> student = new HashMap<>();
            student.put("studentId", row[0]);
            student.put("studentName", row[1]);
            student.put("enrolledAt", row[2]);
            students.add(student);
        }

        Map<String, Object> response = new HashMap<>();
        response.put("status", "success");
        response.put("total", students.size());
        response.put("data", students);

        return new ResponseEntity<>(response, HttpStatus.OK);
    }

//    public void deleteEnrollment(Long courseId, Long studentId) {
//        enrollmentRepo.deleteByCourseIdAndStudentId(courseId, studentId);
//    }
}
