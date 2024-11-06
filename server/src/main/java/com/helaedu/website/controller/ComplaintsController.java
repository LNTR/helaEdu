package com.helaedu.website.controller;

import com.helaedu.website.dto.ArticleDto;
import com.helaedu.website.dto.ComplaintsDto;
import com.helaedu.website.dto.TeacherDto;
import com.helaedu.website.dto.ValidationErrorResponse;
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
    private final ComplaintsService complaintsService;

    public ComplaintsController(ForumService forumService, TMService tmService, ComplaintsService complaintsService, StudentService studentService, ArticleService articleService) {

        this.tmService = tmService;
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
            complaintsDto.setUserId(teacherDto.getUserId());
            String complaintId = complaintsService.addComplaint(complaintsDto);
            return new ResponseEntity<>(complaintId, HttpStatus.CREATED);
        } catch (IllegalArgumentException e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);
        } catch (ExecutionException | InterruptedException e) {
            return new ResponseEntity<>("Error adding complaint", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }


}

