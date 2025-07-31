package com.Major.Online.Exam.Repository;

import com.Major.Online.Exam.Entity.Courses;
import com.Major.Online.Exam.Entity.Exam_Questions;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface Exam_QuestionRepo extends JpaRepository<Exam_Questions, Long> {
    List<Exam_Questions> findByExamId(Long examId);

}
