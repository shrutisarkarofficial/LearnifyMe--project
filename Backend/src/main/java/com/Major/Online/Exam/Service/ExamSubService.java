package com.Major.Online.Exam.Service;

import com.Major.Online.Exam.DTO.ExamStatusDTO;
import com.Major.Online.Exam.DTO.ExamSubDTO;
import com.Major.Online.Exam.DTO.QuestionDTO;
import com.Major.Online.Exam.Entity.Exam_Questions;
import com.Major.Online.Exam.Entity.Exam_Submissions;
import com.Major.Online.Exam.Entity.Exams;
import com.Major.Online.Exam.Entity.Users;
import com.Major.Online.Exam.Repository.ExamRepo;
import com.Major.Online.Exam.Repository.ExamSubmissionRepo;
import com.Major.Online.Exam.Repository.Exam_QuestionRepo;
import com.Major.Online.Exam.Repository.UserRepo;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.security.Timestamp;
import java.time.LocalDateTime;
import java.util.*;

@Service
public class ExamSubService {


    private ExamStatusDTO examStatusDTO;

    @Autowired
    private UserRepo userRepo;

    @Autowired
    private ExamRepo examRepo;

    @Autowired
    private  ExamSubmissionRepo examSubmissionRepo;

    @Autowired
    private Exam_QuestionRepo examQuestionRepo;

    public ResponseEntity<Map<String, Object>> submitExam(Map<String, Object> payload) {
        Long studentId = Long.parseLong(payload.get("studentId").toString());
        Long examId = Long.parseLong(payload.get("examId").toString());

        Users student = userRepo.findById(studentId).orElseThrow(() -> new RuntimeException("Student not found"));
        Exams exam = examRepo.findById(examId).orElseThrow(() -> new RuntimeException("Exam not found"));

        Map<String, Object> response = new HashMap<>();
        try {
//            Long studentId = Long.valueOf(String.valueOf(payload.get("studentId")));
//            Long examId = Long.valueOf(String.valueOf(payload.get("examId")));
            Map<String, String> answers = (Map<String, String>) payload.get("answers");

//            // Validate existence
//            if (!userRepo.existsById(studentId) || !examRepo.existsById(examId)) {
//                response.put("status", "fail");
//                response.put("message", "Invalid studentId or examId.");
//                return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
//            }

            // Check duplicate submission
            if (examSubmissionRepo.existsByStudentIdAndExamId(studentId, examId)) {
                response.put("status", "fail");
                response.put("message", "You have already submitted this exam.");
                return new ResponseEntity<>(response, HttpStatus.CONFLICT);
            }

            // Fetch questions of this exam
            List<Exam_Questions> questions = examQuestionRepo.findByExamId(examId);
            int score = 0;

            for (Exam_Questions q : questions) {
                String userAnswer = answers.get(String.valueOf(q.getId()));
                if (userAnswer != null && userAnswer.equalsIgnoreCase(getOptionValue(String.valueOf(q.getCorrectEOption())))) {
                    score += q.getMarks();
                }
            }

//            Users student=userRepo.findById(studentId);
//            Optional<Exams> exam=examRepo.findById(examId.getId());

            // Save submission
            Exam_Submissions submission = new Exam_Submissions();
            submission.setStudent(student);
            submission.setExam(exam);
            submission.setScore(score);
            submission.setSubmittedAt(LocalDateTime.now());
            examSubmissionRepo.save(submission);

            response.put("status", "success");
            response.put("message", "Exam submitted successfully.");
            response.put("score", score);
            return new ResponseEntity<>(response, HttpStatus.CREATED);

        } catch (Exception ex) {
            response.put("status", "error");
            response.put("message", "Server error: " + ex.getMessage());
            return new ResponseEntity<>(response, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    private String getOptionValue(String enumValue) {
        // Assuming correctOption is stored as enum: A, B, C, D
        switch (enumValue) {
            case "A": return "optionA";
            case "B": return "optionB";
            case "C": return "optionC";
            case "D": return "optionD";
            default: return "";
        }
    }

    public List<Map<String, Object>> getExamStatusForCourse(Long courseId) {
        List<Object[]> rows = examSubmissionRepo.getExamStatusByCourseId(courseId);
        List<Map<String, Object>> result = new ArrayList<>();

        for (Object[] row : rows) {
            Map<String, Object> map = new HashMap<>();
            map.put("studentName", row[0]);
            map.put("examTitle", row[1]);
            map.put("totalMarks", ((Number) row[2]).intValue());
            map.put("score", row[3] != null ? ((Number) row[3]).intValue() : null);
            map.put("submittedAt", row[4] );
            map.put("status", row[5]);

            result.add(map);
        }

        return result;
    }


}
