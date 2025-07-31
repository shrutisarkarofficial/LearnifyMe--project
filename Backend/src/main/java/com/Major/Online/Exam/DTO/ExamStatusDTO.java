package com.Major.Online.Exam.DTO;

import lombok.Data;

import java.security.Timestamp;

@Data
public class ExamStatusDTO {
    private String studentName;
    private String examTitle;
    private int totalMarks;
    private Integer score;
    private Timestamp submittedAt;
    private String status;

    public ExamStatusDTO(String studentName, String examTitle, int totalMarks, Integer score, Timestamp submittedAt, String status) {
        this.studentName = studentName;
        this.examTitle = examTitle;
        this.totalMarks = totalMarks;
        this.score = score;
        this.submittedAt = submittedAt;
        this.status = status;
    }
}