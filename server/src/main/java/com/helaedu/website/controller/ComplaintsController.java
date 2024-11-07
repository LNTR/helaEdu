package com.helaedu.website.controller;

import com.helaedu.website.dto.*;
import com.helaedu.website.dto.ComplaintsDto;
import com.helaedu.website.service.*;
import com.helaedu.website.util.UserUtil;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.concurrent.ExecutionException;

@RestController
@RequestMapping("/complaints")
@CrossOrigin(origins = "*")
public class ComplaintsController {
    private final TMService tmService;
    private final StudentService studentService;
    private final ComplaintsService complaintsService;

    public ComplaintsController(ForumService forumService, TMService tmService, StudentService studentService, StudentService studentService1, ComplaintsService complaintsService) {

        this.tmService = tmService;
        this.studentService = studentService1;
        this.complaintsService = complaintsService;
    }
    @GetMapping
    public ResponseEntity<Object> getAllComplaints() throws ExecutionException, InterruptedException{
        List<ComplaintsDto> complaints = complaintsService.getAllComplaints();
        return ResponseEntity.ok(complaints);
    }
    @PostMapping("/create")
    public ResponseEntity<Object> addComplaint(@Valid @RequestBody ComplaintsDto complaintsDto, BindingResult bindingResult) throws ExecutionException, InterruptedException {
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
            if (teacherDto == null) {
                StudentDto studentDto = studentService.getStudentByEmail(email);
                if (studentDto == null) {
                    return new ResponseEntity<>("User not found", HttpStatus.UNAUTHORIZED);
                }
                complaintsDto.setUserId(studentDto.getUserId());
            } else {
                complaintsDto.setUserId(teacherDto.getUserId());
            }
            String complaintId = complaintsService.addComplaint(complaintsDto);
            return new ResponseEntity<>(complaintId, HttpStatus.CREATED);
        } catch (IllegalArgumentException e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);
        } catch (ExecutionException | InterruptedException e) {
            return new ResponseEntity<>("Error adding complaint", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PutMapping("/{complaintId}/review")
    public ResponseEntity<Object> reviewComplaints(@PathVariable String complaintId, @RequestParam String feedback) throws ExecutionException, InterruptedException {
        try {
            String userId = UserUtil.getCurrentUserEmail();
            String result = complaintsService.reviewComplaint(complaintId,feedback, userId);
            return new ResponseEntity<>(result, HttpStatus.OK);
        } catch (IllegalArgumentException e) {
            ValidationErrorResponse errorResponse = new ValidationErrorResponse();
            errorResponse.addViolation("complaintId", e.getMessage());
            return new ResponseEntity<>(errorResponse, HttpStatus.NOT_FOUND);
        } catch (ExecutionException | InterruptedException e) {
            return new ResponseEntity<>("Error reviewing complaints", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    @PutMapping("/{complaintId}/decline")
    public ResponseEntity<Object> declineComplaints(@PathVariable String complaintId, @RequestParam String feedback) throws ExecutionException, InterruptedException {
        try {
            String userId = UserUtil.getCurrentUserEmail();

            String result = complaintsService.declineComplaint(complaintId, feedback, userId);
            return new ResponseEntity<>(result, HttpStatus.OK);
        } catch (IllegalArgumentException e) {
            ValidationErrorResponse errorResponse = new ValidationErrorResponse();
            errorResponse.addViolation("complaintId", e.getMessage());
            return new ResponseEntity<>(errorResponse, HttpStatus.NOT_FOUND);
        } catch (ExecutionException | InterruptedException e) {
            return new ResponseEntity<>("Error declining complaints", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    @DeleteMapping("/{complaintId}")
    public ResponseEntity<Object> deleteComplaint(@PathVariable String complaintId) throws ExecutionException, InterruptedException {
        try {
            String result = complaintsService.deleteComplaint(complaintId);
            return new ResponseEntity<>(result, HttpStatus.OK);
        } catch (IllegalArgumentException e) {
            ValidationErrorResponse errorResponse = new ValidationErrorResponse();
            errorResponse.addViolation("complaintId", e.getMessage());
            return new ResponseEntity<>(errorResponse, HttpStatus.NOT_FOUND);
        } catch (ExecutionException | InterruptedException e) {
            return new ResponseEntity<>("Error deleting complaints", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }



}

