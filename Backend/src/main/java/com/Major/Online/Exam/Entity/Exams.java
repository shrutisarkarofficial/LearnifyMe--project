package com.Major.Online.Exam.Entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.List;

@Entity
@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "exams")
public class Exams {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;
    private int totalMarks;
    private LocalDateTime scheduledDate;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "course_id", referencedColumnName = "id")
    private Courses course;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @OneToMany(mappedBy = "exam", cascade = CascadeType.REMOVE, orphanRemoval = true)
    private List<Exam_Questions> questions;

    @OneToMany(mappedBy = "exam", cascade = CascadeType.REMOVE, orphanRemoval = true)
    private List<Exam_Submissions> submissions;
}
