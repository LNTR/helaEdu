package com.helaedu.website.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

import java.time.Instant;

@Getter
@Setter
@AllArgsConstructor
public class ComplaintsDto {
    private String complaintId;
    private String complaint;
    private String articleId;
    private String commentId;
    private String userId;
    private Instant publishedTimestamp;
    private String status;
    private String reviewedAdminId;
    private String feedback;
}
