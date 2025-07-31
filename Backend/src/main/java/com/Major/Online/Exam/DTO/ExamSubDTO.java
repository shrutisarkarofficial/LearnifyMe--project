package com.Major.Online.Exam.DTO;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class ExamSubDTO {
    Long id;
    Long studentId;
    Long examId;
    Integer score;
    LocalDateTime submittedAt;
}
