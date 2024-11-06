package com.helaedu.website.dto;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
public class ForumDto {
    private String commentId;
    private String comment;
    private String articleId;
    private String userId;
    private String parentId;
}
