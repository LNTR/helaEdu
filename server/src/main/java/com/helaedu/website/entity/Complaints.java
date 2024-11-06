package com.helaedu.website.entity;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.Instant;
import java.util.List;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class Complaints {
    private String complaintId;
    private String complaint;
    private String articleId;
    private String commentId;
    private String userId;
    private Instant publishedTimestamp;



}
