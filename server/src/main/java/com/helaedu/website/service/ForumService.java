package com.helaedu.website.service;

import com.helaedu.website.dto.ArticleDto;
import com.helaedu.website.dto.ForumDto;
import com.helaedu.website.entity.Article;
import com.helaedu.website.entity.Forum;
import com.helaedu.website.repository.ForumRepository;
import com.helaedu.website.util.UniqueIdGenerator;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.ExecutionException;
import java.util.stream.Collectors;

@Service
public class ForumService {

    @Autowired
    private FirebaseStorageService firebaseStorageService;

    private final ForumRepository forumRepository;

    public ForumService(ForumRepository forumRepository, FirebaseStorageService firebaseStorageService) {
        this.forumRepository = forumRepository;
        this.firebaseStorageService = firebaseStorageService;
    }

    public ForumDto getComment(String commentId) throws ExecutionException, InterruptedException {
        Forum forum = forumRepository.getCommentById(commentId);
        if (forum != null) {
            return new ForumDto(
                    forum.getCommentId(),
                    forum.getComment(),
                    forum.getArticleId(),
                    forum.getUserId(),
                    forum.getParentId(),
                    forum.getPublishedTimestamp()
            );
        }
        return null;
    }

    public String addComment(ForumDto forumDto) throws ExecutionException, InterruptedException {
        String commentId = UniqueIdGenerator.generateUniqueId("fo", forumRepository::exists);

        Instant publishedTimestamp = forumDto.getPublishedTimestamp() != null ?
                forumDto.getPublishedTimestamp() :
                Instant.now();

        Forum forum = new Forum(
                commentId,
                forumDto.getComment(),
                forumDto.getArticleId(),
                forumDto.getUserId(),
                forumDto.getParentId(),
                publishedTimestamp
        );

        return forumRepository.addComment(forum);
    }

    public List<ForumDto> getCommentsByArticleId(String articleId) throws ExecutionException, InterruptedException {
        List<Forum> forums = forumRepository.getCommentsByArticleId(articleId);
        return forums.stream().map(forum ->
                new ForumDto(
                        forum.getCommentId(),
                        forum.getComment(),
                        forum.getArticleId(),
                        forum.getUserId(),
                        forum.getParentId(),
                        forum.getPublishedTimestamp()
                )
        ).collect(Collectors.toList());
    }
    public String deleteComment(String commentId) throws ExecutionException, InterruptedException {
        return forumRepository.deleteComment(commentId);
    }
    public String updateCommentAsDelete(String commentId) throws ExecutionException, InterruptedException {
        return forumRepository.updateCommentAsDelete(commentId, "*THIS MESSAGE WAS DELETED*");
    }



}
