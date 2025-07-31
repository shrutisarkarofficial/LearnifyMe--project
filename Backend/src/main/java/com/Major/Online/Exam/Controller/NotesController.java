package com.Major.Online.Exam.Controller;

import com.Major.Online.Exam.Service.NotesService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/notes")
public class NotesController {
    @Autowired
    private NotesService notesService;

    @PostMapping("/upload")
    public ResponseEntity<Map<String, Object>> uploadNote(@RequestBody Map<String, Object> request) {
        Map<String, Object> response = new HashMap<>();
        try {
            Map<String, Object> result = notesService.saveNoteFromMap(request);
            response.put("status", "success");
            response.put("note", result);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            response.put("status", "error");
            response.put("message", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    @GetMapping("/all/{courseId}")
    public ResponseEntity<List<Map<String, Object>>> getNotesForCourse(@PathVariable Long courseId) {
        List<Map<String, Object>> notes = notesService.getNotesByCourseId(courseId);
        return ResponseEntity.ok(notes);
    }


    @DeleteMapping("/delete/{courseId}/{noteId}")
    public ResponseEntity<String> deleteNote(
            @PathVariable Long courseId,
            @PathVariable Long noteId) {
        notesService.deleteNote(courseId, noteId);
        return ResponseEntity.ok("Note deleted successfully");
    }

}
