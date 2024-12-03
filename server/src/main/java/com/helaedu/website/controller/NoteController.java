package com.helaedu.website.controller;

import com.helaedu.website.dto.*;
import com.helaedu.website.service.NoteService;
import com.helaedu.website.service.StudentService;
import com.helaedu.website.service.TMService;
import com.helaedu.website.util.RequestUtil;
import com.helaedu.website.util.UserUtil;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.concurrent.ExecutionException;

@RestController
@RequestMapping("/notes")
@CrossOrigin(origins = "*")
public class NoteController {
    private final NoteService noteService;
    private final TMService tmService;
    private final StudentService studentService;
    public NoteController(NoteService noteService, TMService tmService, StudentService studentService) {
      
        this.noteService = noteService;
        this.tmService = tmService;
        this.studentService = studentService;
    }
    @PostMapping("/create")
    public ResponseEntity<Object> createNote(@Valid @RequestBody NoteDto noteDto, BindingResult bindingResult) throws ExecutionException, InterruptedException {
        if (bindingResult.hasErrors()) {
            ValidationErrorResponse errorResponse = new ValidationErrorResponse();
            for(FieldError fieldError : bindingResult.getFieldErrors()) {
                errorResponse.addViolation(fieldError.getField(), fieldError.getDefaultMessage());
            }
            return new ResponseEntity<>(errorResponse, HttpStatus.BAD_REQUEST);
        }
        try {
            String email = UserUtil.getCurrentUserEmail();
            TeacherDto teacherDto = tmService.getTMByEmail(email);
            if(teacherDto != null){
                noteDto.setUserId(teacherDto.getUserId());
            }else{
                StudentDto studentDto = studentService.getStudentByEmail(email);
                if (studentDto == null) {
                    return new ResponseEntity<>("User not found", HttpStatus.UNAUTHORIZED);
                }
                noteDto.setUserId(studentDto.getUserId());
            }
            String noteId = noteService.createNoteTeacher(noteDto);
            return new ResponseEntity<>(noteId, HttpStatus.CREATED);
        } catch (IllegalArgumentException e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);
        } catch (ExecutionException | InterruptedException e) {
            return new ResponseEntity<>("Error creating note", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    @DeleteMapping("/{noteId}")
    public ResponseEntity<Object> deleteNote(@PathVariable String noteId) throws ExecutionException, InterruptedException {
        try {
            String result = noteService.deleteNote(noteId);
            return new ResponseEntity<>(result, HttpStatus.OK);
        } catch (IllegalArgumentException e) {
            ValidationErrorResponse errorResponse = new ValidationErrorResponse();
            errorResponse.addViolation("noteId", e.getMessage());
            return new ResponseEntity<>(errorResponse, HttpStatus.NOT_FOUND);
        } catch (ExecutionException | InterruptedException e) {
            return new ResponseEntity<>("Error deleting note", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    @PutMapping("/update/{noteId}")
    public ResponseEntity<Object> updateNote(@PathVariable String noteId, @RequestBody NoteDto noteDto, BindingResult bindingResult) throws ExecutionException, InterruptedException {
        if(bindingResult.hasErrors()) {
            ValidationErrorResponse errorResponse = new ValidationErrorResponse();
            for (FieldError fieldError : bindingResult.getFieldErrors()) {
                errorResponse.addViolation(fieldError.getField(), fieldError.getDefaultMessage());
            }
            return new ResponseEntity<>(errorResponse, HttpStatus.BAD_REQUEST);
        }
        try {
            String result = noteService.updateNote(noteId, noteDto);
            return new ResponseEntity<>(result, HttpStatus.OK);
        } catch (IllegalArgumentException e) {
            ValidationErrorResponse errorResponse = new ValidationErrorResponse();
            errorResponse.addViolation("noteId", e.getMessage());
            return new ResponseEntity<>(errorResponse, HttpStatus.NOT_FOUND);
        } catch (ExecutionException | InterruptedException e) {
            return new ResponseEntity<>("Error updating note", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("/me/notes")
    public ResponseEntity<List<NoteDto>> getCurrentUserNotes() throws ExecutionException, InterruptedException {
        String email = UserUtil.getCurrentUserEmail();
        return getAllNotesByEmail(email);
    }
    private ResponseEntity<List<NoteDto>> getAllNotesByEmail(String email) throws ExecutionException, InterruptedException {
        TeacherDto teacherDto = tmService.getTMByEmail(email);

        if (teacherDto != null) {
            List<NoteDto> notes = noteService.getNotesByUser(teacherDto.getUserId());
            return ResponseEntity.ok(notes);
        }
        StudentDto studentDto = studentService.getStudentByEmail(email);
        if (studentDto != null) {
            List<NoteDto> notes = noteService.getNotesByUser(studentDto.getUserId());
            return ResponseEntity.ok(notes);
        }
        return new ResponseEntity("User not found", HttpStatus.UNAUTHORIZED);
    }






}
