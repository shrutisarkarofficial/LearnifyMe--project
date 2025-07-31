package com.Major.Online.Exam.Service;

import com.Major.Online.Exam.DTO.ExamRequest;
import com.Major.Online.Exam.DTO.QuestionDTO;
import com.Major.Online.Exam.Entity.Courses;
import com.Major.Online.Exam.Entity.Exam_Questions;
import com.Major.Online.Exam.Entity.Exams;
import com.Major.Online.Exam.Repository.CourseRepo;
import com.Major.Online.Exam.Repository.ExamRepo;
import com.Major.Online.Exam.Repository.Exam_QuestionRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class ExamService {
    @Autowired
    private ExamRepo examRepo;

    @Autowired
    private Exam_QuestionRepo examQuestionRepo;

    @Autowired
    private CourseRepo courseRepo;

    public ResponseEntity<Map<String, Object>> createExam(ExamRequest request) {
        Map<String, Object> response = new HashMap<>();
        try {
            if (request.getTitle() == null || request.getTitle().trim().isEmpty()
                    || request.getCourseId() == null
                    || request.getScheduledAt() == null
                    || request.getQuestions() == null
                    || request.getQuestions().isEmpty()) {
                response.put("status", "fail");
                response.put("message", "Missing required fields or questions list is empty.");
                return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
            }

            Courses course = courseRepo.findById(request.getCourseId()).orElse(null);
            if (course == null) {
                response.put("status", "fail");
                response.put("message", "Course not found.");
                return new ResponseEntity<>(response, HttpStatus.NOT_FOUND);
            }

            Exams exam = new Exams();
            exam.setTitle(request.getTitle());
            exam.setCourse(course);
            exam.setScheduledDate(request.getScheduledAt());
            exam.setCreatedAt(LocalDateTime.now());

            int totalMarks = 0;
            List<Exam_Questions> examQuestions = new ArrayList<>();

            for (QuestionDTO q : request.getQuestions()) {
                Exam_Questions question = new Exam_Questions();
                question.setQuestionText(q.getQuestion());
                question.setOptionA(q.getOptionA());
                question.setOptionB(q.getOptionB());
                question.setOptionC(q.getOptionC());
                question.setOptionD(q.getOptionD());

                try {
                    question.setCorrectEOption(Exam_Questions.E_Option.valueOf(String.valueOf(q.getCorrectOption())));
                } catch (IllegalArgumentException e) {
                    response.put("status", "fail");
                    response.put("message", "Invalid correct option in one or more questions.");
                    return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
                }

                question.setMarks(q.getMarks());
                totalMarks += q.getMarks();
                question.setExam(exam);
                examQuestions.add(question);
            }

            exam.setTotalMarks(totalMarks);
            exam.setQuestions(examQuestions);

            Exams savedExam = examRepo.save(exam);
            examQuestionRepo.saveAll(examQuestions);

            response.put("status", "success");
            response.put("message", "Exam created successfully.");
            response.put("examId", savedExam.getId());
            return new ResponseEntity<>(response, HttpStatus.CREATED);

        } catch (Exception ex) {
            response.put("status", "error");
            response.put("message", "Internal server error: " + ex.getMessage());
            return new ResponseEntity<>(response, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }


    public ResponseEntity<Map<String, Object>> getExamSummariesByCourseId(Long courseId) {
        Map<String, Object> response = new HashMap<>();
        try {
            List<Object[]> results = examRepo.findExamSummaryByCourseId(courseId);
            List<Map<String, Object>> summaries = new ArrayList<>();

            for (Object[] row : results) {
                Map<String, Object> summary = new HashMap<>();
                summary.put("examName", row[0]);
                summary.put("scheduledAt", row[1]); // Might be Timestamp or String
                summary.put("totalSubmissions", ((Number) row[2]).intValue()); // Safe cast
                summaries.add(summary);
            }

            response.put("status", "success");
            response.put("courseId", courseId);
            response.put("totalExams", summaries.size());
            response.put("data", summaries);
            return new ResponseEntity<>(response, HttpStatus.OK);

        } catch (Exception ex) {
            response.put("status", "error");
            response.put("message", "Failed to retrieve exam summaries: " + ex.getMessage());
            return new ResponseEntity<>(response, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    public ResponseEntity<Map<String, Object>> getExamSummaries(Long courseId, Long studentId) {
        Map<String, Object> response = new HashMap<>();

        List<Object[]> results = examRepo.findExamStatusByCourseAndStudent(courseId, studentId);
        List<Map<String, Object>> examSummary = new ArrayList<>();

        for (Object[] row : results) {
            Map<String, Object> map = new HashMap<>();
            map.put("examId", row[0]);
            map.put("examName", row[1]);
            map.put("scheduledAt", row[2]);
            map.put("examTotal", row[3]);
            map.put("score", row[4]);
            map.put("submissionStatus", row[5]);
            examSummary.add(map);
        }

        response.put("status", "success");
        response.put("total", examSummary.size());
        response.put("data", examSummary);

        return new ResponseEntity<>(response, HttpStatus.OK);
    }
    public ResponseEntity<Map<String, Object>> getExamDetails(Long examId) {
        Map<String, Object> response = new HashMap<>();
        List<Object[]> results = examRepo.findExamDetailsByExamId(examId);

        if (results.isEmpty()) {
            response.put("status", "fail");
            response.put("message", "Exam not found or has no questions.");
            return new ResponseEntity<>(response, HttpStatus.NOT_FOUND);
        }

        Map<String, Object> examDetails = new HashMap<>();
        List<Map<String, Object>> questions = new ArrayList<>();

        for (Object[] row : results) {
            if (examDetails.isEmpty()) {
                examDetails.put("examId", row[0]);
                examDetails.put("examName", row[1]);
                examDetails.put("courseName", row[2]);
                examDetails.put("courseDescription", row[3]);
                examDetails.put("totalMarks", row[4]);
            }

            Map<String, Object> question = new HashMap<>();
            question.put("questionId", row[5]);
            question.put("questionText", row[6]);
            question.put("optionA", row[7]);
            question.put("optionB", row[8]);
            question.put("optionC", row[9]);
            question.put("optionD", row[10]);
            question.put("correctOption", row[11]);
            question.put("marks", row[12]);
            questions.add(question);
        }

        examDetails.put("questions", questions);
        response.put("status", "success");
        response.put("data", examDetails);

        return new ResponseEntity<>(response, HttpStatus.OK);
    }

}
