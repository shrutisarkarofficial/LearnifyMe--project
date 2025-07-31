package com.Major.Online.Exam.Service;

import com.Major.Online.Exam.Entity.Courses;
import com.Major.Online.Exam.Entity.Notes;
import com.Major.Online.Exam.Repository.CourseRepo;
import com.Major.Online.Exam.Repository.NotesRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.*;

@Service
public class NotesService {
    @Autowired
    private NotesRepo notesRepo;

    @Autowired
    private CourseRepo courseRepo;

    public Map<String, Object> saveNoteFromMap(Map<String, Object> request) throws IOException {
        String title = (String) request.get("title");
        String fileName = (String) request.get("fileName");
        String fileType = (String) request.get("fileType");
        Long courseId = Long.valueOf(request.get("courseId").toString()); // ✅ safe conversion
        System.out.println(title+" "+fileName+" "+fileType+" "+courseId);

        String base64 = (String) request.get("data");
        byte[] fileData = Base64.getDecoder().decode(base64);

        Courses course = courseRepo.findById(courseId)
                .orElseThrow(() -> new RuntimeException("Course not found"));

        Notes note = Notes.builder()
                .title(title)
                .fileName(fileName)
                .fileType(fileType)
                .fileData(fileData)
                .course(course)
                .uploadedAt(LocalDateTime.now())
                .build();

        Notes saved = notesRepo.save(note);
        Map<String, Object> response = new HashMap<>();
        response.put("id", saved.getId());
        response.put("fileName", saved.getFileName());
        response.put("title", saved.getTitle());
        return response;
    }



    public List<Map<String, Object>> getNotesByCourseId(Long courseId) {
        List<Notes> notes = notesRepo.findByCourseId(courseId);
        List<Map<String, Object>> response = new ArrayList<>();

        for (Notes note : notes) {
            Map<String, Object> map = new HashMap<>();
            map.put("id", note.getId());
            map.put("title", note.getTitle());
            map.put("fileName", note.getFileName());
            map.put("fileType", note.getFileType());
            map.put("data", Base64.getEncoder().encodeToString(note.getFileData())); // ✅ Include base64
            response.add(map);
        }
        return response;
    }


    public void deleteNote(Long courseId, Long noteId) {
        notesRepo.deleteNoteByIdAndCourseId(noteId, courseId);
    }

}
