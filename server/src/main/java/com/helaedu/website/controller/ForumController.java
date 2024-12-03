package com.helaedu.website.controller;

import com.helaedu.website.dto.*;
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

import java.util.Objects;
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
            for (FieldError fieldError : bindingResult.getFieldErrors()) {
                errorResponse.addViolation(fieldError.getField(), fieldError.getDefaultMessage());
            }
            return new ResponseEntity<>(errorResponse, HttpStatus.BAD_REQUEST);
        }
        try {
            String email = UserUtil.getCurrentUserEmail();
            String articleId = forumDto.getArticleId();
            ArticleDto articleDto=articleService.getArticle(articleId);
            TeacherDto teacherDto = tmService.getTMByEmail(email);
            if(Objects.equals(articleDto.getUserId(), teacherDto.getUserId())){
                return new ResponseEntity<>("You can't add comments for your own article", HttpStatus.BAD_REQUEST);
            }else{
                if (teacherDto != null) {
                    forumDto.setUserId(teacherDto.getUserId());
                } else {
                    StudentDto studentDto = studentService.getStudentByEmail(email);
                    if (studentDto == null) {
                        return new ResponseEntity<>("User not found", HttpStatus.UNAUTHORIZED);
                    }
                    forumDto.setUserId(studentDto.getUserId());
                }
            }
            String commentId = forumService.addComment(forumDto);
            return new ResponseEntity<>(commentId, HttpStatus.CREATED);
        } catch (IllegalArgumentException e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);
        } catch (ExecutionException | InterruptedException e) {
            return new ResponseEntity<>("Error adding comment", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PostMapping("/subject/create")
    public ResponseEntity<Object> addCommentBySubject(@Valid @RequestBody ForumDto forumDto, BindingResult bindingResult) throws ExecutionException, InterruptedException {
        if (bindingResult.hasErrors()) {
            ValidationErrorResponse errorResponse = new ValidationErrorResponse();
            for (FieldError fieldError : bindingResult.getFieldErrors()) {
                errorResponse.addViolation(fieldError.getField(), fieldError.getDefaultMessage());
            }
            return new ResponseEntity<>(errorResponse, HttpStatus.BAD_REQUEST);
        }
        try {
            String email = UserUtil.getCurrentUserEmail();

            TeacherDto teacherDto = tmService.getTMByEmail(email);
            if (teacherDto != null) {
                forumDto.setUserId(teacherDto.getUserId());
            } else {
                StudentDto studentDto = studentService.getStudentByEmail(email);
                if (studentDto == null) {
                    return new ResponseEntity<>("User not found", HttpStatus.UNAUTHORIZED);
                }
                forumDto.setUserId(studentDto.getUserId());
            }
            String commentId = forumService.addComment(forumDto);
            return new ResponseEntity<>(commentId, HttpStatus.CREATED);
        } catch (IllegalArgumentException e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);
        } catch (ExecutionException | InterruptedException e) {
            return new ResponseEntity<>("Error adding comment", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }


    @DeleteMapping("/{commentId}")
    public ResponseEntity<Object> deleteComment(@PathVariable String commentId) throws ExecutionException, InterruptedException {
        try {
            String result = forumService.deleteComment(commentId);
            return new ResponseEntity<>(result, HttpStatus.OK);
        } catch (IllegalArgumentException e) {
            ValidationErrorResponse errorResponse = new ValidationErrorResponse();
            errorResponse.addViolation("commentId", e.getMessage());
            return new ResponseEntity<>(errorResponse, HttpStatus.NOT_FOUND);
        } catch (ExecutionException | InterruptedException e) {
            return new ResponseEntity<>("Error deleting comment", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PutMapping("/admin/{commentId}")
    public ResponseEntity<Object> deleteCommentByAdmin(@PathVariable String commentId) throws ExecutionException, InterruptedException {
        try {
            String result = forumService.updateCommentAsDelete(commentId);
            return new ResponseEntity<>(result, HttpStatus.OK);
        } catch (IllegalArgumentException e) {
            ValidationErrorResponse errorResponse = new ValidationErrorResponse();
            errorResponse.addViolation("commentId", e.getMessage());
            return new ResponseEntity<>(errorResponse, HttpStatus.NOT_FOUND);
        } catch (ExecutionException | InterruptedException e) {
            return new ResponseEntity<>("Error updating comment", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    @PutMapping("/author/{commentId}")
    public ResponseEntity<Object> deleteCommentByAuthor(@PathVariable String commentId) throws ExecutionException, InterruptedException {
        try {
            String email = UserUtil.getCurrentUserEmail();
            String userId;
            TeacherDto teacherDto = tmService.getTMByEmail(email);
            if (teacherDto == null) {
                StudentDto studentDto = studentService.getStudentByEmail(email);
                if (studentDto == null) {
                    return new ResponseEntity<>("User not found", HttpStatus.UNAUTHORIZED);
                }
                userId = studentDto.getUserId();
            } else {
                userId = teacherDto.getUserId();
            }
            ForumDto forumDto = forumService.getComment(commentId);
            String commentUserId = forumDto.getUserId();
            if (!userId.equals(commentUserId)) {
                return new ResponseEntity<>("You cannot delete another user's comment", HttpStatus.FORBIDDEN);
            }
            String result = forumService.updateCommentAsDelete(commentId);
            return new ResponseEntity<>(result, HttpStatus.OK);

        } catch (IllegalArgumentException e) {
            ValidationErrorResponse errorResponse = new ValidationErrorResponse();
            errorResponse.addViolation("commentId", e.getMessage());
            return new ResponseEntity<>(errorResponse, HttpStatus.NOT_FOUND);
        } catch (ExecutionException | InterruptedException e) {
            return new ResponseEntity<>("Error updating comment", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    @GetMapping("/{articleId}/commentCount")
    public ResponseEntity<Integer> getCommentCountByArticleId(@PathVariable String articleId) {
        try {
            int commentCount = forumService.getCommentCountForArticle(articleId);
            return new ResponseEntity<>(commentCount, HttpStatus.OK);
        } catch (ExecutionException | InterruptedException e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
