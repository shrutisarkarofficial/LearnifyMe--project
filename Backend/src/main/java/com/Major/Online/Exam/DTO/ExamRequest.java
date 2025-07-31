package com.Major.Online.Exam.DTO;

import com.Major.Online.Exam.Entity.Exam_Questions;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;

@Data
public class ExamRequest {
    private Long courseId;
    private String title;
    private LocalDateTime scheduledAt;
    private List<QuestionDTO> questions;
}