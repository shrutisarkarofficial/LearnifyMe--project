package com.Major.Online.Exam.Repository;

import com.Major.Online.Exam.Entity.Enrollments;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;

@Repository
public interface EnrollRepo extends JpaRepository<Enrollments, Long> {
    boolean existsByStudentIdAndCourseId(Long studentId, Long courseId);

    @Query(value = "SELECT c.id, c.course_name, c.course_code, c.description, c.created_at, u.name " +
            "FROM enrollments e " +
            "JOIN courses c ON e.course_id = c.id JOIN users u ON c.teacher_id = u.id" +
            " WHERE e.student_id = :studentId", nativeQuery = true)
    List<Object[]> findCoursesByStudentIdNative(@Param("studentId") Long studentId);

    @Query(value = """
        SELECT 
            u.id AS studentId,
            u.name AS studentName,
            e.enrolled_at AS enrolledAt
        FROM 
            enrollments e
        JOIN 
            users u ON e.student_id = u.id
        WHERE 
            e.course_id = :courseId
        """, nativeQuery = true)
    List<Object[]> findStudentsByCourseId(@Param("courseId") Long courseId);

    @Transactional
    @Modifying
    @Query(value = "DELETE FROM enrollments WHERE course_id = ?1 AND student_id = ?2", nativeQuery = true)
    void deleteEnrollmentByCourseIdAndStudentId(Long courseId, Long studentId);

}
