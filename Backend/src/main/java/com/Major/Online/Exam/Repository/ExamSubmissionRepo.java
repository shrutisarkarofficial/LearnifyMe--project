package com.Major.Online.Exam.Repository;

import com.Major.Online.Exam.Entity.Exam_Submissions;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ExamSubmissionRepo extends JpaRepository<Exam_Submissions, Long> {
       boolean existsByStudentIdAndExamId(Long studentId, Long examId);
       @Query(value = """
    SELECT 
        u.name AS student_name,
        e.title AS exam_title,
        e.total_marks,
        s.score,
        s.submitted_at,
        CASE 
            WHEN s.id IS NOT NULL THEN 'Submitted'
            ELSE 'Not Submitted'
        END AS status
    FROM users u
    JOIN enrollments en ON u.id = en.student_id
    JOIN courses c ON en.course_id = c.id
    JOIN exams e ON e.course_id = c.id
    LEFT JOIN exam_submissions s 
        ON s.exam_id = e.id AND s.student_id = u.id
    WHERE c.id = :courseId
    ORDER BY u.name, e.title
""", nativeQuery = true)
       List<Object[]> getExamStatusByCourseId(@Param("courseId") Long courseId);

}
