package com.Major.Online.Exam.Entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Entity
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "questions")
public class Exam_Questions {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "question_text")
    private String questionText;
    @Column(name = "option_a")
    private String optionA;
    @Column(name = "option_b")
    private String optionB;
    @Column(name = "option_c")
    private String optionC;
    @Column(name = "option_d")
    private String optionD;

    @Enumerated(EnumType.STRING)
    @Column(name = "correct_option")
    private E_Option correctEOption;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "exam_id", referencedColumnName = "id", nullable = false)
    private Exams exam;

    private int marks;



    public enum E_Option {
        A, B, C, D
    }
}
