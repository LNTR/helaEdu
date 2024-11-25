package com.helaedu.website.controller;

import com.helaedu.website.dto.ForumDto;
import com.helaedu.website.dto.SubjectDto;
import com.helaedu.website.dto.ValidationErrorResponse;
import com.helaedu.website.service.ForumService;
import com.helaedu.website.service.SubjectService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.concurrent.ExecutionException;

@RestController
@RequestMapping("/subjects")
@CrossOrigin(origins = "*")
public class SubjectController {
    private final SubjectService subjectService;
    private final ForumService forumService;

    public SubjectController(SubjectService subjectService, ForumService forumService) {
        this.subjectService = subjectService;
        this.forumService = forumService;
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
    @GetMapping("/byGrade/{grade}")
    public ResponseEntity<List<SubjectDto>> getSubjectsByGrade(@PathVariable String grade) {
        try {
            List<SubjectDto> subjects = subjectService.getSubjectByGrade(grade);
            return new ResponseEntity<>(subjects, HttpStatus.OK);
        } catch (ExecutionException | InterruptedException e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    @GetMapping("/{subjectId}/comments")
    public ResponseEntity<List<ForumDto>> getAllCommentsBySubjectId(@PathVariable String subjectId) throws ExecutionException, InterruptedException {
        List<ForumDto> forum = forumService.getCommentsBySubjectId(subjectId);
        return ResponseEntity.ok(forum);
    }
    @PostMapping("{subjectId}/uploadCoverImg")
    public ResponseEntity<Object> uploadCoverImg(@PathVariable String subjectId, @RequestParam("subjectCoverImage") MultipartFile subjectCoverImage) {
        try {
            String subjectCoverUrl = subjectService.uploadCoverImage(subjectId, subjectCoverImage);
            return new ResponseEntity<>(subjectCoverUrl, HttpStatus.OK);
        } catch (IOException e) {
            return new ResponseEntity<>("Error uploading subject cover image", HttpStatus.INTERNAL_SERVER_ERROR);
        } catch (ExecutionException | InterruptedException e) {
            throw new RuntimeException(e);
        }
    }






}
