package com.helaedu.website.controller;

import com.helaedu.website.dto.ForumDto;
import com.helaedu.website.dto.StudentDto;
import com.helaedu.website.dto.TeacherDto;
import com.helaedu.website.dto.ValidationErrorResponse;
import com.helaedu.website.service.ArticleService;
import com.helaedu.website.service.ForumService;
import com.helaedu.website.service.StudentService;
import com.helaedu.website.service.TMService;
import com.helaedu.website.util.UserUtil;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.annotation.*;

import java.util.concurrent.ExecutionException;

@RestController
@RequestMapping("/forum")
@CrossOrigin(origins = "*")
public class ForumController {
    private final ForumService forumService;
    private final TMService tmService;
    private final StudentService studentService;
    private final ArticleService articleService;
    public ForumController(ForumService forumService, TMService tmService, StudentService studentService, ArticleService articleService) {
        this.forumService = forumService;
        this.tmService = tmService;
        this.studentService = studentService;
        this.articleService = articleService;
    }

    @GetMapping("/{commentId}")
    public ResponseEntity<Object> getComment(@PathVariable String commentId) throws ExecutionException, InterruptedException {
        ForumDto forumDto = forumService.getComment(commentId);
        if (forumDto != null) {
            return ResponseEntity.ok(forumDto);
        } else {
            ValidationErrorResponse errorResponse = new ValidationErrorResponse();
            errorResponse.addViolation("commentId", "Comment not found");
            return new ResponseEntity<>(errorResponse, HttpStatus.NOT_FOUND);        }
    }

    @PostMapping("/create")
    public ResponseEntity<Object> addComment(@Valid @RequestBody ForumDto forumDto, BindingResult bindingResult) throws ExecutionException, InterruptedException {
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
            forumDto.setUserId(teacherDto.getUserId());
//            if(!(teacherDto.getUserId())){
//                StudentDto studentDto = studentService.getStudentByEmail(email);
//                forumDto.setUserId(studentDto.getUserId());
//            }
            boolean articleExists = articleService.doesArticleExist(forumDto.getArticleId());
            if (!articleExists) {
                return new ResponseEntity<>("Article does not exist", HttpStatus.BAD_REQUEST);
            }
            if (teacherDto.getUserId().equals(articleService.getUserIdByArticleId(forumDto.getArticleId()))) {
                return new ResponseEntity<>("You cannot comment on your own article", HttpStatus.FORBIDDEN);
            }

            String commentId = forumService.addComment(forumDto);
            return new ResponseEntity<>(commentId, HttpStatus.CREATED);
        } catch (IllegalArgumentException e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);
        } catch (ExecutionException | InterruptedException e) {
            return new ResponseEntity<>("Error adding comment", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }


}
