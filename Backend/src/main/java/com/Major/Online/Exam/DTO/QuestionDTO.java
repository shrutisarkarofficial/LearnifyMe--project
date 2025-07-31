package com.Major.Online.Exam.DTO;

import lombok.Data;

@Data
public class QuestionDTO {
    private String question;
    private String optionA;
    private String optionB;
    private String optionC;
    private String optionD;
    private String correctOption;
    private int marks;
}
