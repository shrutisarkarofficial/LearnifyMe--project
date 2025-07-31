package com.Major.Online.Exam.Repository;

import com.Major.Online.Exam.Entity.Courses;
import com.Major.Online.Exam.Entity.Exams;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ExamRepo extends JpaRepository<Exams, Long> {
    @Query(value = """
    SELECT 
        e.title AS examName, 
        e.scheduled_date AS scheduledAt, 
        COUNT(es.id) AS totalSubmissions
    FROM 
        exams e
    LEFT JOIN 
        exam_submissions es ON e.id = es.exam_id
    WHERE 
        e.course_id = :courseId
    GROUP BY 
        e.id, e.title, e.scheduled_date
    """, nativeQuery = true)
    List<Object[]> findExamSummaryByCourseId(@Param("courseId") Long courseId);

    @Query(value = """
    SELECT 
        e.id AS examId,
        e.title AS examName,
        e.scheduled_date AS scheduledAt,
        e.total_marks AS examTotal,
        COALESCE(es.score, 0) AS score,
        CASE 
            WHEN es.id IS NOT NULL THEN 'submitted'
            ELSE 'not submitted'
        END AS submissionStatus
    FROM 
        exams e
    LEFT JOIN 
        exam_submissions es 
        ON e.id = es.exam_id AND es.student_id = :studentId
    WHERE 
        e.course_id = :courseId
    """, nativeQuery = true)
    List<Object[]> findExamStatusByCourseAndStudent(@Param("courseId") Long courseId, @Param("studentId") Long studentId);


    @Query(value = """
        SELECT 
            e.id AS examId,
            e.title AS examName,
            c.course_name AS courseName,
            c.description AS courseDescription,
            e.total_marks AS totalMarks,
            q.id AS questionId,
            q.question_text AS questionText,
            q.option_a AS optionA,
            q.option_b AS optionB,
            q.option_c AS optionC,
            q.option_d AS optionD,
            q.correct_option AS correctOption,
            q.marks AS marks
        FROM 
            exams e
        JOIN 
            courses c ON e.course_id = c.id
        JOIN 
            questions q ON q.exam_id = e.id
        WHERE 
            e.id = :examId
    """, nativeQuery = true)
    List<Object[]> findExamDetailsByExamId(@Param("examId") Long examId);

}
