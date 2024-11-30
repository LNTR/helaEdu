package com.helaedu.website.controller;

import com.helaedu.website.dto.StudentDto;
import com.helaedu.website.dto.ValidationErrorResponse;
import com.helaedu.website.service.StudentService;
import com.helaedu.website.service.TeacherService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

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

    @GetMapping("/")
    public Map<String, Integer> getStudentCountForReport(
            @RequestParam("userType") String userType,
            @RequestParam("startDate") String startDate,
            @RequestParam("endDate") String endDate
    ) throws ExecutionException, InterruptedException {
        if(Objects.equals(userType, "STUDENT")) return studentService.getStudentsCountForReport(startDate, endDate);
        else return teacherService.getTeachersCountForReport(startDate, endDate);
    }
}
