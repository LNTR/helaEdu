package com.helaedu.website.controller;

import com.helaedu.website.dto.SubjectDto;
import com.helaedu.website.dto.ValidationErrorResponse;
import com.helaedu.website.service.SubjectService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.concurrent.ExecutionException;

@RestController
@RequestMapping("/subjects")
@CrossOrigin(origins = "*")
public class SubjectController {
    private final SubjectService subjectService;

    public SubjectController(SubjectService subjectService) {
        this.subjectService = subjectService;
    }

    @PostMapping("/create")
    public ResponseEntity<Object> createSubject(@Valid @RequestBody SubjectDto subjectDto, BindingResult bindingResult) throws ExecutionException, InterruptedException {
        if (bindingResult.hasErrors()) {
            ValidationErrorResponse errorResponse = new ValidationErrorResponse();
            for(FieldError fieldError : bindingResult.getFieldErrors()) {
                errorResponse.addViolation(fieldError.getField(), fieldError.getDefaultMessage());
            }
            return new ResponseEntity<>(errorResponse, HttpStatus.BAD_REQUEST);
        }
        try {
            String subjectId = subjectService.createSubject(subjectDto);
            return new ResponseEntity<>(subjectId, HttpStatus.CREATED);
        } catch (IllegalArgumentException e) {
            ValidationErrorResponse errorResponse = new ValidationErrorResponse();
            return new ResponseEntity<>(errorResponse, HttpStatus.BAD_REQUEST);
        } catch (ExecutionException | InterruptedException e) {
            return new ResponseEntity<>("Error creating subject", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PostMapping("/uploadPdf")
    public ResponseEntity<Object> uploadPdf(@RequestParam String subjectId, @RequestParam("pdf") MultipartFile pdf) {
        try {
            String pdfRef = subjectService.uploadPdf(subjectId, pdf);
            return new ResponseEntity<>(pdfRef, HttpStatus.OK);
        } catch (IOException e) {
            return new ResponseEntity<>("Error uploading pdf", HttpStatus.INTERNAL_SERVER_ERROR);
        } catch (ExecutionException | InterruptedException e) {
            throw new RuntimeException(e);
        }
    }
}
