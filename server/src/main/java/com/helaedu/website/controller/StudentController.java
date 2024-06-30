package com.helaedu.website.controller;

import com.helaedu.website.dto.NoteDto;
import com.helaedu.website.dto.StudentDto;
import com.helaedu.website.dto.SubscriptionDto;
import com.helaedu.website.dto.ValidationErrorResponse;
import com.helaedu.website.service.NoteService;
import com.helaedu.website.service.StudentService;
import com.helaedu.website.service.SubscriptionService;
import com.helaedu.website.util.UserUtil;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.access.prepost.PreAuthorize;

import java.util.List;
import java.util.concurrent.ExecutionException;

@RestController
@RequestMapping("/students")
@CrossOrigin(origins = "*")
public class StudentController {
    private final StudentService studentService;
    private final NoteService noteService;
    private final SubscriptionService subscriptionService;

    public StudentController(StudentService studentService, NoteService noteService, SubscriptionService subscriptionService) {
        this.studentService = studentService;
        this.noteService = noteService;
        this.subscriptionService = subscriptionService;
    }

    @PostMapping("/create")
    public ResponseEntity<Object> createStudent(@Valid @RequestBody StudentDto studentDto, BindingResult bindingResult) throws ExecutionException, InterruptedException {
        if (bindingResult.hasErrors()) {
            ValidationErrorResponse errorResponse = new ValidationErrorResponse();
            for(FieldError fieldError : bindingResult.getFieldErrors()) {
                errorResponse.addViolation(fieldError.getField(), fieldError.getDefaultMessage());
            }
            return new ResponseEntity<>(errorResponse, HttpStatus.BAD_REQUEST);
        }
        try {
            String studentId = studentService.createStudent(studentDto);
            return new ResponseEntity<>(studentId, HttpStatus.CREATED);
        } catch (IllegalArgumentException e) {
            ValidationErrorResponse errorResponse = new ValidationErrorResponse();
            errorResponse.addViolation("email", e.getMessage());
            return new ResponseEntity<>(errorResponse, HttpStatus.BAD_REQUEST);
        } catch (ExecutionException | InterruptedException e) {
            return new ResponseEntity<>("Error creating student", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping
    public ResponseEntity<List<StudentDto>> getAllStudents() throws ExecutionException, InterruptedException {
        List<StudentDto> students = studentService.getAllStudents();
        return ResponseEntity.ok(students);
    }

    @GetMapping("/{userId}")
    public ResponseEntity<Object> getStudent(@PathVariable String userId) throws ExecutionException, InterruptedException {
        StudentDto studentDto = studentService.getStudent(userId);
        if (studentDto != null) {
            return ResponseEntity.ok(studentDto);
        } else {
            ValidationErrorResponse errorResponse = new ValidationErrorResponse();
            errorResponse.addViolation("userId", "Student not found");
            return new ResponseEntity<>(errorResponse, HttpStatus.NOT_FOUND);
        }
    }

    @PutMapping("/{userId}")
    @PreAuthorize("#userId == authentication.principal.username")
    public ResponseEntity<Object> updateStudent(@PathVariable String userId, @Valid @RequestBody StudentDto studentDto, BindingResult bindingResult) throws ExecutionException, InterruptedException {
        if(bindingResult.hasErrors()) {
            ValidationErrorResponse errorResponse = new ValidationErrorResponse();
            for (FieldError fieldError : bindingResult.getFieldErrors()) {
                errorResponse.addViolation(fieldError.getField(), fieldError.getDefaultMessage());
            }
            return new ResponseEntity<>(errorResponse, HttpStatus.BAD_REQUEST);
        }
        try {
            String result = studentService.updateStudent(userId, studentDto);
            return new ResponseEntity<>(result, HttpStatus.OK);
        } catch (IllegalArgumentException e) {
            ValidationErrorResponse errorResponse = new ValidationErrorResponse();
            errorResponse.addViolation("userId", e.getMessage());
            return new ResponseEntity<>(errorResponse, HttpStatus.NOT_FOUND);
        } catch (ExecutionException | InterruptedException e) {
            return new ResponseEntity<>("Error updating student", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @DeleteMapping("/{userId}")
    public ResponseEntity<Object> deleteStudent(@PathVariable String userId) throws ExecutionException, InterruptedException {
        try {
            String result = studentService.deleteStudent(userId);
            return new ResponseEntity<>(result, HttpStatus.OK);
        } catch (IllegalArgumentException e) {
            ValidationErrorResponse errorResponse = new ValidationErrorResponse();
            errorResponse.addViolation("userId", e.getMessage());
            return new ResponseEntity<>(errorResponse, HttpStatus.NOT_FOUND);
        } catch (ExecutionException | InterruptedException e) {
            return new ResponseEntity<>("Error deleting student", HttpStatus.INTERNAL_SERVER_ERROR);
        }
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

    @PostMapping("/{userId}/subscribe")
    public ResponseEntity<Object> subscribeStudent(@PathVariable String userId, @RequestParam long paidAmount) throws ExecutionException, InterruptedException {
        try {
            String subscriptionId = studentService.createSubscription(userId, paidAmount);
            return new ResponseEntity<>(subscriptionId, HttpStatus.CREATED);
        } catch (IllegalArgumentException e) {
            ValidationErrorResponse errorResponse = new ValidationErrorResponse();
            errorResponse.addViolation("userId", e.getMessage());
            return new ResponseEntity<>(errorResponse, HttpStatus.BAD_REQUEST);
        } catch (ExecutionException | InterruptedException e) {
            return new ResponseEntity<>("Error creating subscription", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PutMapping("/{userId}/unsubscribe")
    public ResponseEntity<Object> unsubscribeStudent(@PathVariable String userId) throws ExecutionException, InterruptedException {
        StudentDto studentDto = studentService.getStudent(userId);
        if(studentDto == null) {
            ValidationErrorResponse errorResponse = new ValidationErrorResponse();
            errorResponse.addViolation("UserId", "Student not found");
            return new ResponseEntity<>(errorResponse, HttpStatus.NOT_FOUND);
        }

        String subscriptionId = studentDto.getSubscriptionId();
        if(subscriptionId == null) {
            ValidationErrorResponse errorResponse = new ValidationErrorResponse();
            errorResponse.addViolation("subscriptionId", "No active subscription found for this student");
            return new ResponseEntity<>(errorResponse, HttpStatus.BAD_REQUEST);
        }

        SubscriptionDto subscriptionDto = subscriptionService.getSubscription(subscriptionId);
        if (subscriptionDto == null) {
            ValidationErrorResponse errorResponse = new ValidationErrorResponse();
            errorResponse.addViolation("subscriptionId", "Subscription not found");
            return new ResponseEntity<>(errorResponse, HttpStatus.NOT_FOUND);
        }

        try {
            studentService.cancelSubscription(userId);
            subscriptionService.cancelSubscription(subscriptionId);
            return new ResponseEntity<>("Unsubscribed successfully", HttpStatus.OK);
        } catch (ExecutionException | InterruptedException e) {
            return new ResponseEntity<>("Error unsubscribing student", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("/{userId}/subscription")
    public ResponseEntity<Object> getSubscription(@PathVariable String userId) throws ExecutionException, InterruptedException {
        StudentDto studentDto = studentService.getStudent(userId);
        if(studentDto == null) {
            ValidationErrorResponse errorResponse = new ValidationErrorResponse();
            errorResponse.addViolation("UserId", "Student not found");
            return new ResponseEntity<>(errorResponse, HttpStatus.NOT_FOUND);
        }

        String subscriptionId = studentDto.getSubscriptionId();
        if (subscriptionId == null || subscriptionId.isEmpty()) {
            ValidationErrorResponse errorResponse = new ValidationErrorResponse();
            errorResponse.addViolation("subscriptionId", "No active subscription found for this student");
            return new ResponseEntity<>(errorResponse, HttpStatus.NOT_FOUND);
        }

        SubscriptionDto subscriptionDto = subscriptionService.getSubscription(subscriptionId);
        if (subscriptionDto != null) {
            return ResponseEntity.ok(subscriptionDto);
        } else {
            ValidationErrorResponse errorResponse = new ValidationErrorResponse();
            errorResponse.addViolation("subscriptionId", "Subscription not found");
            return new ResponseEntity<>(errorResponse, HttpStatus.NOT_FOUND);
        }
    }

    @GetMapping("/active-subscriptions")
    public ResponseEntity<List<StudentDto>> getStudentsWithActiveSubscriptions() throws ExecutionException, InterruptedException {
        List<StudentDto> students = studentService.getStudentsWithActiveSubscriptions();
        return new ResponseEntity<>(students, HttpStatus.OK);
    }

    @GetMapping("/me")
    public ResponseEntity<Object> getCurrentStudent() throws ExecutionException, InterruptedException {
        String userId = UserUtil.getCurrentUserId();
        return getStudent(userId);
    }

    @PutMapping("/me")
    public ResponseEntity<Object> updateCurrentStudent(@Valid @RequestBody StudentDto studentDto, BindingResult bindingResult) throws ExecutionException, InterruptedException {
        String userId = UserUtil.getCurrentUserId();
        return updateStudent(userId, studentDto, bindingResult);
    }

    @DeleteMapping("/me")
    public ResponseEntity<Object> deleteCurrentStudent() throws ExecutionException, InterruptedException {
        String userId = UserUtil.getCurrentUserId();
        return deleteStudent(userId);
    }

    @GetMapping("/me/note")
    public ResponseEntity<Object> getCurrentStudentNote() throws ExecutionException, InterruptedException {
        String userId = UserUtil.getCurrentUserId();
        return getNote(userId);
    }

    @PutMapping("/me/note")
    public ResponseEntity<Object> updateCurrentUserNote(@Valid @RequestBody NoteDto noteDto, BindingResult bindingResult) throws ExecutionException, InterruptedException {
        String userId = UserUtil.getCurrentUserId();
        return updateNote(userId, noteDto, bindingResult);
    }

    @GetMapping("/me/subscription")
    public ResponseEntity<Object> getCurrentStudentSubscription() throws ExecutionException, InterruptedException {
        String userId = UserUtil.getCurrentUserId();
        return getSubscription(userId);
    }

    @PostMapping("/me/subscribe")
    public ResponseEntity<Object> subscribeCurrentStudent(@RequestParam Long paidAmount) throws ExecutionException, InterruptedException {
        String userId = UserUtil.getCurrentUserId();
        return subscribeStudent(userId, paidAmount);
    }

    @PutMapping("/me/unsubscribe")
    public ResponseEntity<Object> unsubscribeCurrentStudent() throws ExecutionException, InterruptedException {
        String userId = UserUtil.getCurrentUserId();
        return unsubscribeStudent(userId);
    }
}
