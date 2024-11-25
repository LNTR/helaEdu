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
public class Note {

    private String noteId;
    private String content;
    private String title;
    private String subject;
    private Instant publishedTimestamp;
    private String userId;


}
