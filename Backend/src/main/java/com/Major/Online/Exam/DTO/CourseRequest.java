package com.Major.Online.Exam.DTO;

import lombok.Data;

@Data
public class CourseRequest {
    private String coursename;
    private String courseCode;
    private String desc;
    private Long teacherId;
}
