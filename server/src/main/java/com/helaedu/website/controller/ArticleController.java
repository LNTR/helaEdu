package com.helaedu.website.controller;

import com.helaedu.website.dto.ArticleDto;
import com.helaedu.website.dto.ForumDto;
import com.helaedu.website.dto.TeacherDto;
import com.helaedu.website.dto.ValidationErrorResponse;
import com.helaedu.website.service.ArticleService;
import com.helaedu.website.service.ForumService;
import com.helaedu.website.service.ModeratorService;
import com.helaedu.website.service.TMService;
import com.helaedu.website.util.UserUtil;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.Objects;
import java.util.concurrent.ExecutionException;

@RestController
@RequestMapping("/articles")
@CrossOrigin(origins = "*")
public class ArticleController{

    private final ArticleService articleService;
    private final TMService tmService;

    private final ForumService forumService;
    private final ModeratorService moderatorService;

    public ArticleController(ArticleService articleService, TMService tmService, ForumService forumService, ModeratorService moderatorService){
        this.articleService = articleService;
        this.tmService = tmService;
        this.forumService = forumService;
        this.moderatorService = moderatorService;
    }

    @PostMapping("/create")
    public ResponseEntity<Object> createArticle(@Valid @RequestBody ArticleDto articleDto, BindingResult bindingResult) throws ExecutionException, InterruptedException {
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
            articleDto.setUserId(teacherDto.getUserId());
            String articleId = articleService.createArticle(articleDto);
            return new ResponseEntity<>(articleId, HttpStatus.CREATED);
        } catch (IllegalArgumentException e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);
        } catch (ExecutionException | InterruptedException e) {
            return new ResponseEntity<>("Error creating article", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PostMapping("{articleId}/uploadArticleCover")
    public ResponseEntity<Object> uploadArticleCover(@PathVariable String articleId, @RequestParam("articleCoverImage") MultipartFile articleCoverImage) {
        try {
            String articleCoverUrl = articleService.uploadArticleCover(articleId, articleCoverImage);
            return new ResponseEntity<>(articleCoverUrl, HttpStatus.OK);
        } catch (IOException e) {
            return new ResponseEntity<>("Error uploading article cover image", HttpStatus.INTERNAL_SERVER_ERROR);
        } catch (ExecutionException | InterruptedException e) {
            throw new RuntimeException(e);
        }
    }

    @PostMapping("{articleId}/uploadAdditionalFiles")
    public ResponseEntity<Object> uploadArticleCovers(@PathVariable String articleId, @RequestParam("additionalFiles") List<MultipartFile> additionalFiles) {
        try {
            List<String> additionalFilesUrls = articleService.uploadAdditionalFiles(articleId, additionalFiles);
            return new ResponseEntity<>(additionalFilesUrls, HttpStatus.OK);
        } catch (IOException e) {
            return new ResponseEntity<>("Error uploading additional files", HttpStatus.INTERNAL_SERVER_ERROR);
        } catch (ExecutionException | InterruptedException e) {
            throw new RuntimeException(e);
        }
    }

    @GetMapping
    public ResponseEntity<Object> getAllArticles() throws ExecutionException, InterruptedException{
        List<ArticleDto> articles = articleService.getAllArticles();
        return ResponseEntity.ok(articles);
    }

    @GetMapping("/{articleId}")
    public ResponseEntity<Object> getArticle(@PathVariable String articleId) throws ExecutionException, InterruptedException {
        ArticleDto articleDto = articleService.getArticle(articleId);
        if (articleDto != null) {
            return ResponseEntity.ok(articleDto);
        } else {
            ValidationErrorResponse errorResponse = new ValidationErrorResponse();
            errorResponse.addViolation("articleId", "Article not found");
            return new ResponseEntity<>(errorResponse, HttpStatus.NOT_FOUND);        }
    }

    @DeleteMapping("/{articleId}")
    public ResponseEntity<Object> deleteArticle(@PathVariable String articleId) throws ExecutionException, InterruptedException {
        try {
            String result = articleService.deleteArticle(articleId);
            return new ResponseEntity<>(result, HttpStatus.OK);
        } catch (IllegalArgumentException e) {
            ValidationErrorResponse errorResponse = new ValidationErrorResponse();
            errorResponse.addViolation("articleId", e.getMessage());
            return new ResponseEntity<>(errorResponse, HttpStatus.NOT_FOUND);
        } catch (ExecutionException | InterruptedException e) {
            return new ResponseEntity<>("Error deleting article", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PutMapping("/{articleId}")
    public ResponseEntity<Object> updateArticle(@PathVariable String articleId, @RequestBody ArticleDto articleDto, BindingResult bindingResult) throws ExecutionException, InterruptedException {
        if(bindingResult.hasErrors()) {
            ValidationErrorResponse errorResponse = new ValidationErrorResponse();
            for (FieldError fieldError : bindingResult.getFieldErrors()) {
                errorResponse.addViolation(fieldError.getField(), fieldError.getDefaultMessage());
            }
            return new ResponseEntity<>(errorResponse, HttpStatus.BAD_REQUEST);
        }
        try {
            String result = articleService.updateArticle(articleId, articleDto);
            return new ResponseEntity<>(result, HttpStatus.OK);
        } catch (IllegalArgumentException e) {
            ValidationErrorResponse errorResponse = new ValidationErrorResponse();
            errorResponse.addViolation("articleId", e.getMessage());
            return new ResponseEntity<>(errorResponse, HttpStatus.NOT_FOUND);
        } catch (ExecutionException | InterruptedException e) {
            return new ResponseEntity<>("Error updating article", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("/pending")
    public ResponseEntity<List<ArticleDto>> getPendingArticles() throws ExecutionException, InterruptedException {
        List<ArticleDto> articles = articleService.getPendingArticles();
        return ResponseEntity.ok(articles);
    }
    @GetMapping("/pending/mod")
    public ResponseEntity<List<ArticleDto>> getPendingArticlesForMod() throws ExecutionException, InterruptedException {
            String email = UserUtil.getCurrentUserEmail();
            TeacherDto teacherDto = tmService.getTMByEmail(email);
            List<ArticleDto> articles = articleService.getPendingArticlesByMod(teacherDto.getUserId());
            return ResponseEntity.ok(articles);

    }


    @GetMapping("/approved")
    public ResponseEntity<List<ArticleDto>> getApprovedArticles() throws ExecutionException, InterruptedException {
        List<ArticleDto> articles = articleService.getApprovedArticles();
        return ResponseEntity.ok(articles);
    }

    @PutMapping("/{articleId}/approve")
    public ResponseEntity<Object> approveArticle(@PathVariable String articleId) throws ExecutionException, InterruptedException {
        try {
            //todo
            String email = UserUtil.getCurrentUserEmail();
            ArticleDto articleDto = articleService.getArticle(articleId);
            TeacherDto moderatorDto = tmService.getTM(articleDto.getUserId());
            if(!Objects.equals(moderatorDto.getEmail(), email)){
                String result = articleService.approveArticle(articleId, email);
                return new ResponseEntity<>(result, HttpStatus.OK);
            } else {
                return new ResponseEntity<>("Error approving article", HttpStatus.INTERNAL_SERVER_ERROR);
            }
        } catch (IllegalArgumentException e) {
            ValidationErrorResponse errorResponse = new ValidationErrorResponse();
            errorResponse.addViolation("articleId", e.getMessage());
            return new ResponseEntity<>(errorResponse, HttpStatus.NOT_FOUND);
        } catch (ExecutionException | InterruptedException e) {
            return new ResponseEntity<>("Error approving article", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    @PutMapping("/{articleId}/decline")
    public ResponseEntity<Object> declineArticle(@PathVariable String articleId, @RequestParam String rejectedReason) throws ExecutionException, InterruptedException {
        try {
            String userId = UserUtil.getCurrentUserEmail();

            String result = articleService.declineArticle(articleId, rejectedReason, userId);
            return new ResponseEntity<>(result, HttpStatus.OK);
        } catch (IllegalArgumentException e) {
            ValidationErrorResponse errorResponse = new ValidationErrorResponse();
            errorResponse.addViolation("articleId", e.getMessage());
            return new ResponseEntity<>(errorResponse, HttpStatus.NOT_FOUND);
        } catch (ExecutionException | InterruptedException e) {
            return new ResponseEntity<>("Error declining article", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PutMapping("/{articleId}/upvote")
    public ResponseEntity<Object> upvoteArticle(@PathVariable String articleId) throws ExecutionException, InterruptedException {
        try {
            String email = UserUtil.getCurrentUserEmail();
            articleService.upvoteArticle(articleId, email);
            return new ResponseEntity<>("Article upvoted", HttpStatus.OK);
        } catch (IllegalArgumentException e) {
            ValidationErrorResponse errorResponse = new ValidationErrorResponse();
            errorResponse.addViolation("articleId", e.getMessage());
            return new ResponseEntity<>(errorResponse, HttpStatus.BAD_REQUEST);
        } catch (ExecutionException | InterruptedException e) {
            return new ResponseEntity<>("Error upvoting article", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("/{articleId}/comments")
    public ResponseEntity<List<ForumDto>> getAllCommentsByArticleId(@PathVariable String articleId) throws ExecutionException, InterruptedException {
        List<ForumDto> forum = forumService.getCommentsByArticleId(articleId);
        return ResponseEntity.ok(forum);
    }
    @GetMapping("/{articleId}/upvoteCount")
    public ResponseEntity<Integer> getUpvoteCountByArticleId(@PathVariable String articleId) {
        try {
            int upvoteCount = articleService.getUpvoteCountForArticle(articleId);
            return new ResponseEntity<>(upvoteCount, HttpStatus.OK);
        } catch (ExecutionException | InterruptedException e) {
            e.printStackTrace();
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}