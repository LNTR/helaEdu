package com.helaedu.website.controller;

import com.helaedu.website.dto.AdminDto;
import com.helaedu.website.dto.ValidationErrorResponse;
import com.helaedu.website.service.AdminService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.concurrent.ExecutionException;

@RestController
@RequestMapping("/admins")
@CrossOrigin(origins = "*")
public class AdminController {
    private final AdminService adminService;

    public AdminController(AdminService adminService) {
        this.adminService = adminService;
    }

    @PostMapping("/create")
    public ResponseEntity<Object> createAdmin(@Valid @RequestBody AdminDto adminDto, BindingResult bindingResult) throws ExecutionException, InterruptedException {
        if (bindingResult.hasErrors()) {
            ValidationErrorResponse errorResponse = new ValidationErrorResponse();
            for(FieldError fieldError : bindingResult.getFieldErrors()) {
                errorResponse.addViolation(fieldError.getField(), fieldError.getDefaultMessage());
            }
            return new ResponseEntity<>(errorResponse, HttpStatus.BAD_REQUEST);
        }
        try {
            String adminId = adminService.createAdmin(adminDto);
            return new ResponseEntity<>(adminId, HttpStatus.CREATED);
        } catch (IllegalArgumentException e) {
            ValidationErrorResponse errorResponse = new ValidationErrorResponse();
            errorResponse.addViolation("email", e.getMessage());
            return new ResponseEntity<>(errorResponse, HttpStatus.BAD_REQUEST);
        } catch (ExecutionException | InterruptedException e) {
            return new ResponseEntity<>("Error creating admin", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping
    public ResponseEntity<List<AdminDto>> getAllAdmins() throws ExecutionException, InterruptedException {
        List<AdminDto> admins = adminService.getAllAdmins();
        return ResponseEntity.ok(admins);
    }

    @GetMapping("/{userId}")
    public ResponseEntity<Object> getAdmin(@PathVariable String userId) throws ExecutionException, InterruptedException {
        AdminDto adminDto = adminService.getAdmin(userId);
        if (adminDto != null) {
            return ResponseEntity.ok(adminDto);
        } else {
            ValidationErrorResponse errorResponse = new ValidationErrorResponse();
            errorResponse.addViolation("userId", "Admin not found");
            return new ResponseEntity<>(errorResponse, HttpStatus.NOT_FOUND);
        }
    }

    @PutMapping("/{userId}")
    public ResponseEntity<Object> updateEdmin(@PathVariable String userId, @Valid @RequestBody AdminDto adminDto, BindingResult bindingResult) throws ExecutionException, InterruptedException {
        if(bindingResult.hasErrors()) {
            ValidationErrorResponse errorResponse = new ValidationErrorResponse();
            for (FieldError fieldError : bindingResult.getFieldErrors()) {
                errorResponse.addViolation(fieldError.getField(), fieldError.getDefaultMessage());
            }
            return new ResponseEntity<>(errorResponse, HttpStatus.BAD_REQUEST);
        }
        try {
            String result = adminService.updateAdmin(userId, adminDto);
            return new ResponseEntity<>(result, HttpStatus.OK);
        } catch (IllegalArgumentException e) {
            ValidationErrorResponse errorResponse = new ValidationErrorResponse();
            errorResponse.addViolation("userId", e.getMessage());
            return new ResponseEntity<>(errorResponse, HttpStatus.NOT_FOUND);
        } catch (ExecutionException | InterruptedException e) {
            return new ResponseEntity<>("Error updating admin", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @DeleteMapping("/{userId}")
    public ResponseEntity<Object> deleteAdmin(@PathVariable String userId) throws ExecutionException, InterruptedException {
        try {
            String result = adminService.deleteAdmin(userId);
            return new ResponseEntity<>(result, HttpStatus.OK);
        } catch (IllegalArgumentException e) {
            ValidationErrorResponse errorResponse = new ValidationErrorResponse();
            errorResponse.addViolation("userId", e.getMessage());
            return new ResponseEntity<>(errorResponse, HttpStatus.NOT_FOUND);
        } catch (ExecutionException | InterruptedException e) {
            return new ResponseEntity<>("Error deleting admin", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}