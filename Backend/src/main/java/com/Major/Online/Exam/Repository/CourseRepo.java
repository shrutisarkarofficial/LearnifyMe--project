package com.Major.Online.Exam.Repository;

import com.Major.Online.Exam.Entity.Courses;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CourseRepo extends JpaRepository<Courses, Long> {
    List<Courses> findByTeacherId(Long teacherid);
    Courses findByCourseCode(String courseCode);
}
