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
    public NoteController( NoteService noteService, TMService tmService) {
      
        this.noteService = noteService;
        this.tmService = tmService;
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
            noteDto.setUserId(teacherDto.getUserId());
            String noteId = noteService.createNoteTeacher(noteDto);
            return new ResponseEntity<>(noteId, HttpStatus.CREATED);
        } catch (IllegalArgumentException e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);
        } catch (ExecutionException | InterruptedException e) {
            return new ResponseEntity<>("Error creating note", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }




}
