package com.helaedu.website.controller;

import ch.qos.logback.classic.Logger;
import com.helaedu.website.dto.StudentDto;
import com.helaedu.website.dto.ValidationErrorResponse;
import com.helaedu.website.service.StudentService;
import com.helaedu.website.service.TeacherService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.Map;
import java.util.Objects;
import java.util.concurrent.ExecutionException;

@RestController
@RequestMapping("/reports")
@CrossOrigin(origins = "*")
public class ReportGenerationController {

    StudentService studentService;
    TeacherService teacherService;

    public ReportGenerationController(StudentService studentService, TeacherService teacherService) {
        this.studentService = studentService;
        this.teacherService = teacherService;
    }

//    @GetMapping("/")
//    public Map<String, Integer> getStudentCountForReport(
//            @RequestParam("userType") String userType,
//            @RequestParam("startDate") String startDate,
//            @RequestParam("endDate") String endDate
//    ) {
//        try {
//            if (Objects.equals(userType, "STUDENT")) {
//                return studentService.getStudentsCountForReport(startDate, endDate);
//            } else {
//                return teacherService.getTeachersCountForReport(startDate, endDate);
//            }
//        } catch (Exception e) {
//            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Internal server error");
//        }
//    }
        @GetMapping("/")
        public Map<String, Integer> getStudentCountForReport(
                @RequestParam("userType") String userType,
                @RequestParam("startDate") String startDate,
                @RequestParam("endDate") String endDate
        ) {
            try {
                if (!"STUDENT".equalsIgnoreCase(userType) && !"TEACHER".equalsIgnoreCase(userType)) {
                    throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid userType: " + userType);
                }
                if ("STUDENT".equalsIgnoreCase(userType)) {
                    return studentService.getStudentsCountForReport(startDate, endDate);
                } else {
                    return teacherService.getTeachersCountForReport(startDate, endDate);
                }
            } catch (IllegalArgumentException e) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, e.getMessage());
            } catch (Exception e) {
                e.printStackTrace();
                throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Internal server error: " + e.getMessage());
            }
}

}