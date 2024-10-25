package com.helaedu.website.controller;

import com.helaedu.website.dto.NoteDto;
import com.helaedu.website.dto.NoteUpdateRequest;
import com.helaedu.website.dto.StudentDto;
import com.helaedu.website.dto.ValidationErrorResponse;
import com.helaedu.website.service.NoteService;
import com.helaedu.website.service.StudentService;
import com.helaedu.website.util.RequestUtil;
import com.helaedu.website.util.UserUtil;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.validation.BindingResult;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.concurrent.ExecutionException;

@RestController
@RequestMapping("/notes")
@CrossOrigin(origins = "*")
public class NoteController {
    private final NoteService noteService;
    private final StudentService studentService;
    public NoteController(StudentService studentService, NoteService noteService) {
        this.studentService = studentService;
        this.noteService = noteService;
    }

    @GetMapping("/me/note")
    public ResponseEntity<Object> getCurrentStudentNote() throws ExecutionException, InterruptedException {
        String email = UserUtil.getCurrentUserEmail();
        Map<String, String> requestBody = RequestUtil.createEmailRequestBody(email);
        return getNoteByEmail(requestBody);
    }

    @PutMapping("/me/note")
    public ResponseEntity<Object> updateCurrentUserNote(@Valid @RequestBody NoteDto noteDto, BindingResult bindingResult) throws ExecutionException, InterruptedException {
        String email = UserUtil.getCurrentUserEmail();
        NoteUpdateRequest noteUpdateRequest = new NoteUpdateRequest(email, noteDto);
        return updateNoteByEmail(noteUpdateRequest, bindingResult);
    }

    @GetMapping("/{userId}/note")
    public ResponseEntity<Object> getNote(@PathVariable String userId) throws ExecutionException, InterruptedException {
        StudentDto studentDto = studentService.getStudent(userId);
        NoteDto noteDto = noteService.getNote(studentDto.getNoteId());
        if (noteDto != null) {
            return ResponseEntity.ok(noteDto);
        } else {
            ValidationErrorResponse errorResponse = new ValidationErrorResponse();
            errorResponse.addViolation("userId", "Student not found");
            return new ResponseEntity<>(errorResponse, HttpStatus.NOT_FOUND);
        }
    }

    @PutMapping("/{userId}/note")
    public ResponseEntity<Object> updateNote(@PathVariable String userId, @Valid @RequestBody NoteDto noteDto, BindingResult bindingResult) throws ExecutionException, InterruptedException {
        if(bindingResult.hasErrors()) {
            ValidationErrorResponse errorResponse = new ValidationErrorResponse();
            for (FieldError fieldError : bindingResult.getFieldErrors()) {
                errorResponse.addViolation(fieldError.getField(), fieldError.getDefaultMessage());
            }
            return new ResponseEntity<>(errorResponse, HttpStatus.BAD_REQUEST);
        }
        try {
            String result = noteService.updateNote(studentService.getStudent(userId).getNoteId(), noteDto);
            return new ResponseEntity<>(result, HttpStatus.OK);
        } catch (IllegalArgumentException e) {
            ValidationErrorResponse errorResponse = new ValidationErrorResponse();
            errorResponse.addViolation("userId", e.getMessage());
            return new ResponseEntity<>(errorResponse, HttpStatus.NOT_FOUND);
        } catch (ExecutionException | InterruptedException e) {
            return new ResponseEntity<>("Error updating note", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    @PutMapping("/note-by-email")
    @PreAuthorize("#noteUpdateRequest.email == authentication.principal.username")
    public ResponseEntity<Object> updateNoteByEmail(@Valid @RequestBody NoteUpdateRequest noteUpdateRequest, BindingResult bindingResult) throws ExecutionException, InterruptedException {
        if(bindingResult.hasErrors()) {
            ValidationErrorResponse errorResponse = new ValidationErrorResponse();
            for (FieldError fieldError : bindingResult.getFieldErrors()) {
                errorResponse.addViolation(fieldError.getField(), fieldError.getDefaultMessage());
            }
            return new ResponseEntity<>(errorResponse, HttpStatus.BAD_REQUEST);
        }
        String email = noteUpdateRequest.getEmail();
        NoteDto noteDto = noteUpdateRequest.getNoteDto();
        try {
            String result = noteService.updateNote(studentService.getStudentByEmail(email).getNoteId(), noteDto);
            return new ResponseEntity<>(result, HttpStatus.OK);
        } catch (IllegalArgumentException e) {
            ValidationErrorResponse errorResponse = new ValidationErrorResponse();
            errorResponse.addViolation("email", e.getMessage());
            return new ResponseEntity<>(errorResponse, HttpStatus.NOT_FOUND);
        } catch (ExecutionException | InterruptedException e) {
            return new ResponseEntity<>("Error updating note", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    @GetMapping("/note-by-email")
    @PreAuthorize("#requestBody.email == authentication.principal.username")
    public ResponseEntity<Object> getNoteByEmail(@RequestBody Map<String, String> requestBody) throws ExecutionException, InterruptedException {
        String email = requestBody.get("email");
        StudentDto studentDto = studentService.getStudentByEmail(email);
        NoteDto noteDto = noteService.getNote(studentDto.getNoteId());
        if (noteDto != null) {
            return ResponseEntity.ok(noteDto);
        } else {
            ValidationErrorResponse errorResponse = new ValidationErrorResponse();
            errorResponse.addViolation("email", "Email not found");
            return new ResponseEntity<>(errorResponse, HttpStatus.NOT_FOUND);
        }
    }


}
