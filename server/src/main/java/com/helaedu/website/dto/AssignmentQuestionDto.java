package com.helaedu.website.dto;

import jakarta.validation.constraints.NotEmpty;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

import java.util.List;
import java.util.Map;

@Getter
@Setter
@AllArgsConstructor
public class AssignmentQuestionDto {
    private String questionId;

    @NotEmpty(message = "Question is required")
    private String question;

    private List<String> options;

    @NotEmpty(message = "Correct answers are required")
    private List<String> correctAnswers;

    //userId, provided answer
    private Map<String, String> givenAnswers;

    private String assignmentId;

    @NotEmpty(message = "Marks is required")
    private int marks;
}
