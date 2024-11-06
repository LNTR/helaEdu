package com.helaedu.website.service;

import com.helaedu.website.dto.ForumDto;
import com.helaedu.website.entity.Forum;
import com.helaedu.website.repository.ForumRepositary;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.concurrent.ExecutionException;

@Service
public class ForumService {

    @Autowired
    private FirebaseStorageService firebaseStorageService;

    private final ForumRepositary forumRepositary;

    public ForumService(ForumRepositary forumRepositary, FirebaseStorageService firebaseStorageService) {
        this.forumRepositary = forumRepositary;
        this.firebaseStorageService = firebaseStorageService;
    }

    public ForumDto getComment(String commentId) throws ExecutionException, InterruptedException {
        Forum forum = forumRepositary.getCommentById(commentId);
        if (forum != null) {
            return new ForumDto(
                    forum.getCommentId(),
                    forum.getComment(),
                    forum.getArticleId(),
                    forum.getUserId(),
                    forum.getParentId()
            );
        }
        return null;
    }


}
