package com.Major.Online.Exam.Entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Entity
@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class Exam_Submissions {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "student_id", referencedColumnName = "id", nullable = false)
    private Users student;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "exam_id", referencedColumnName = "id", nullable = false)
    private Exams exam;

    private LocalDateTime submittedAt;
    private Integer score;
}
