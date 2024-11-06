package com.helaedu.website.entity;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.Instant;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class Forum {
    private String commentId;
    private String comment;
    private String articleId;
    private String userId;
    private String parentId;
    private Instant publishedTimestamp;
}
