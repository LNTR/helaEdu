package com.helaedu.website.dto;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

import java.time.Instant;

@Getter
@Setter
@AllArgsConstructor
public class ForumDto {
    private String commentId;
    private String comment;
    private String articleId;
    private String userId;
    private String parentId;
    private Instant publishedTimestamp;
    private String subjectId;
}
