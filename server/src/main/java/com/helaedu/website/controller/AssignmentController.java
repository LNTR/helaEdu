package com.helaedu.website.controller;

import com.helaedu.website.dto.*;
import com.helaedu.website.dto.AssignmentDto;
import com.helaedu.website.service.AssignmentService;
import com.helaedu.website.service.StudentService;
import com.helaedu.website.service.TMService;
import com.helaedu.website.service.WebSocketService;
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
@RequestMapping("/assignments")
@CrossOrigin(origins = "*")
public class AssignmentController {
    private final AssignmentService assignmentService;

    private final StudentService studentService;
    private final WebSocketService webSocketService;
    private final TMService tmService;

    public AssignmentController(AssignmentService assignmentService, WebSocketService webSocketService, TMService tmService, StudentService studentService){
        this.assignmentService = assignmentService;
        this.webSocketService = webSocketService;
        this.tmService = tmService;
        this.studentService = studentService;
    }

//    @PreAuthorize("hasRole('TEACHER') or hasRole('MODERATOR')")
    @PostMapping("/create")
    public ResponseEntity<Object> createAssignment(@Valid @RequestBody AssignmentDto assignmentDto, BindingResult bindingResult) throws ExecutionException, InterruptedException {
        if (bindingResult.hasErrors()) {
            ValidationErrorResponse errorResponse = new ValidationErrorResponse();
            for(FieldError fieldError : bindingResult.getFieldErrors()) {
                errorResponse.addViolation(fieldError.getField(), fieldError.getDefaultMessage());
            }
            return new ResponseEntity<>(errorResponse, HttpStatus.BAD_REQUEST);
        }
        try {
            String email = UserUtil.getCurrentUserEmail();
            String userId = tmService.getTMByEmail(email).getUserId();
            String assigmentId = assignmentService.createAssignment(userId, assignmentDto);
            return new ResponseEntity<>(assigmentId, HttpStatus.CREATED);
        } catch (IllegalArgumentException e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }

//    @PreAuthorize("hasRole('TEACHER') or hasRole('MODERATOR')")
    @PostMapping("/{assignmentId}/start")
    public ResponseEntity<String> startAssignment(@PathVariable String assignmentId) throws ExecutionException, InterruptedException {
        assignmentService.startAssignment(assignmentId);
        return ResponseEntity.ok("Assignment started");
    }

//    @PreAuthorize("hasRole('TEACHER') or hasRole('MODERATOR')")
    @PostMapping("/{assignmentId}/end")
    public ResponseEntity<String> endAssignment(@PathVariable String assignmentId) throws ExecutionException, InterruptedException {
        assignmentService.endAssignment(assignmentId);
        return ResponseEntity.ok("Assignment ended");
    }

    @GetMapping
    public ResponseEntity<Object> getAllAssignments() throws ExecutionException, InterruptedException{
        List<AssignmentDto> assignments = assignmentService.getAllAssignments();
        return ResponseEntity.ok(assignments);
    }

    @GetMapping("/{assignmentId}")
    public ResponseEntity<Object> getAssignment(@PathVariable String assignmentId) throws ExecutionException, InterruptedException {
        AssignmentDto assignmentDto = assignmentService.getAssignment(assignmentId);
        if (assignmentDto != null) {
            return ResponseEntity.ok(assignmentDto);
        } else {
            ValidationErrorResponse errorResponse = new ValidationErrorResponse();
            errorResponse.addViolation("assignmentId", "Assignment not found");
            return new ResponseEntity<>(errorResponse, HttpStatus.NOT_FOUND);
        }
    }

    @GetMapping("/tm/{userId}")
    public ResponseEntity<Object> getAssignmentsByTM(@PathVariable String userId) throws ExecutionException, InterruptedException {
        List<AssignmentDto> assignments = assignmentService.getAssignmentsByTM(userId);
        return ResponseEntity.ok(assignments);
    }

//    @PreAuthorize("hasRole('TEACHER') or hasRole('MODERATOR')")
    @PostMapping("/{assignmentId}/quizzes")
    public String addQuizzesToAssignment(@PathVariable String assignmentId, @RequestBody List<AssignmentQuestionDto> quizzes) throws ExecutionException, InterruptedException {
        return assignmentService.addQuizzesToAssignment(assignmentId, quizzes);
    }

//    @PreAuthorize("hasRole('STUDENT')")
    @PostMapping("/{assignmentId}/student/start")
    public ResponseEntity<String> studentStartAssignment(@PathVariable String assignmentId) {
        try {
            String email = UserUtil.getCurrentUserEmail();
            StudentDto student = studentService.getStudentByEmail(email);
            assignmentService.studentStartAssignment(assignmentId, student.getUserId());
            return ResponseEntity.ok("Assignment started for student");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

//    @PreAuthorize("hasRole('STUDENT')")
    @PostMapping("/{assignmentId}/{quizId}/answer")
    public ResponseEntity<String> submitAnswer(@PathVariable String assignmentId, @PathVariable String quizId,
                                               @RequestParam String providedAnswer) {
        try {
            String email = UserUtil.getCurrentUserEmail();
            StudentDto student = studentService.getStudentByEmail(email);

            assignmentService.submitAnswer(assignmentId, quizId, student.getUserId(), providedAnswer);

            return ResponseEntity.ok("Answer submitted and moved to the next question");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @DeleteMapping("/{assignmentId}")
    public ResponseEntity<Object> deleteAssignment(@PathVariable String assignmentId) throws ExecutionException, InterruptedException {
        try {
            String result = assignmentService.deleteAssignment(assignmentId);
            return new ResponseEntity<>(result, HttpStatus.OK);
        } catch (IllegalArgumentException e) {
            ValidationErrorResponse errorResponse = new ValidationErrorResponse();
            errorResponse.addViolation("assignmentId", e.getMessage());
            return new ResponseEntity<>(errorResponse, HttpStatus.NOT_FOUND);
        } catch (ExecutionException | InterruptedException e) {
            return new ResponseEntity<>("Error deleting assignment", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
