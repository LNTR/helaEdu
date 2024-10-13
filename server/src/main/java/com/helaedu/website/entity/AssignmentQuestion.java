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
public class AssignmentQuestion {
    private String quizId;
    private String question;
    private List<String> options;
    private String correctAnswer;
    private Map<String, String> givenAnswers;
    private String assignmentId;
    private int marks;
}