package com.Major.Online.Exam.Service;

import com.Major.Online.Exam.Entity.Courses;
import com.Major.Online.Exam.Entity.Users;
import com.Major.Online.Exam.Repository.CourseRepo;
import com.Major.Online.Exam.Repository.UserRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class CourseService {
    @Autowired
    private CourseRepo courseRepo;

    @Autowired
    private UserRepo userRepo;

    public List<Map<String, Object>> getCoursesByTeacherId(Long teacherId) {
        List<Courses> courses = courseRepo.findByTeacherId(teacherId);

        return courses.stream().map(course -> {
            Map<String, Object> courseMap = new HashMap<>();
            courseMap.put("id", course.getId());
            courseMap.put("coursename", course.getCoursename());
            courseMap.put("courseCode", course.getCourseCode());
            courseMap.put("description", course.getDesc());
            System.out.println(courseMap);
            return courseMap;
        }).collect(Collectors.toList());
    }

    public Map<String, Object> createCourse(Map<String, Object> request) {
        String name = (String) request.get("name");
        String code = (String) request.get("code");
        String description = (String) request.get("description");
        Long teacherId = Long.parseLong(request.get("teacherId").toString());

        Users teacher = userRepo.findById(teacherId).orElseThrow(() -> new RuntimeException("Teacher not found"));

        Courses course = new Courses();
        course.setCoursename(name);
        course.setCourseCode(code);
        course.setDesc(description);
        course.setTeacher(teacher);

        Courses saved = courseRepo.save(course);

        Map<String, Object> response = new HashMap<>();
        response.put("id", saved.getId());
        response.put("name", saved.getCoursename());
        response.put("code", saved.getCourseCode());
        response.put("description", saved.getDesc());

        return response;
    }

}
