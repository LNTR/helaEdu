package com.helaedu.website.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

import java.time.Instant;

@Getter
@Setter
@AllArgsConstructor
public class NoteDto {
    private String noteId;
    private String content;
    private String title;
    private String subject;
    private Instant publishedTimestamp;
    private String userId;


}
