package com.helaedu.website.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
public class SubjectNoteDto {
    private String subjectNoteId;
    private String subjectId;
    private String email;
    private String content;
}
