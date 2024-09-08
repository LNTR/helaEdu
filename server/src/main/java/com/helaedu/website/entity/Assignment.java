package com.helaedu.website.entity;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;
import java.util.Map;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class Assignment {
    private String assignmentId;
    private String title;
    private String instructions;
    private Long totalTime;
    private boolean started;
    private Map<String, Double> studentMarks;
    private Map<String, Long> studentRemainingTimes;
    private Long publishedTimestamp;
    private String userId;
    private List<AssignmentQuestion> quizzes;
}