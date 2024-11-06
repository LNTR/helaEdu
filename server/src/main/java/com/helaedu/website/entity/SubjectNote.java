package com.helaedu.website.entity;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class SubjectNote {
    private String subjectNoteId;
    private String subjectId;
    private String email;
    private String content;
}
