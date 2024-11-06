package com.helaedu.website.controller;

import com.helaedu.website.dto.ArticleDto;
import com.helaedu.website.dto.ForumDto;
import com.helaedu.website.dto.ValidationErrorResponse;
import com.helaedu.website.service.ForumService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.concurrent.ExecutionException;

@RestController
@RequestMapping("/forum")
@CrossOrigin(origins = "*")
public class ForumController {
    private final ForumService forumService;

    public ForumController(ForumService forumService) {
        this.forumService = forumService;
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
}
