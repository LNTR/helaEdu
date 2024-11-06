package com.helaedu.website.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
public class ComplaintsDto {
    private String complaintId;
    private String complaint;
    private String articleId;
    private String commentId;
}
