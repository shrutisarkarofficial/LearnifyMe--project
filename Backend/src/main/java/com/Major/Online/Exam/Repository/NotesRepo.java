package com.Major.Online.Exam.Repository;

import com.Major.Online.Exam.Entity.Courses;
import com.Major.Online.Exam.Entity.Notes;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Repository
public interface NotesRepo extends JpaRepository<Notes, Long> {
    List<Notes> findByCourseId(Long CourseId);

    @Modifying
    @Transactional
    @Query(value = "DELETE FROM notes WHERE id = :noteId AND course_id = :courseId", nativeQuery = true)
    void deleteNoteByIdAndCourseId(@Param("noteId") Long noteId, @Param("courseId") Long courseId);
}
