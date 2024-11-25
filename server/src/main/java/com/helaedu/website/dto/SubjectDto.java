package com.helaedu.website.dto;

import jakarta.validation.constraints.NotEmpty;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
public class SubjectDto {
    private String subjectId;

    @NotEmpty(message = "Subject name is required")
    private String subjectName;

    @NotEmpty(message = "Grade is required")
    private String grade;

    @NotEmpty(message = "Language is required")
    private String language;

    private String pdfRef;
    private String coverImgRef;
}
