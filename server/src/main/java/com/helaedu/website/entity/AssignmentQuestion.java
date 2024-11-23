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
    private String questionId;
    private String question;
    private List<String> options;
    private List<String> correctAnswers;
    private Map<String, List<String>> givenAnswers;
    private String assignmentId;
    private int marks;
    public void setGivenAnswers(Map<String, List<String>> givenAnswers) {
        this.givenAnswers = givenAnswers;
    }

}