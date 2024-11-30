package com.helaedu.website.dto;

import com.helaedu.website.entity.AssignmentQuestion;
import jakarta.validation.constraints.AssertTrue;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.Instant;
import java.util.List;
import java.util.Map;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class AssignmentDto {
    private String assignmentId;

    @NotEmpty(message = "Title is required")
    private String title;

    @NotEmpty(message = "Instructions are required")
    private String instructions;

    @NotNull(message = "Total time cannot be null")
    @Positive(message = "Total time must be greater than zero")
    private Long totalTime;

    private boolean started;
    private Map<String, Double> studentMarks; //userId and marks
    private Map<String, Long> studentRemainingTimes; //userId and time in millis
    private Long publishedTimestamp;
    private Long EndedTimestamp;
    private String userId;
    private List<AssignmentQuestion> quizzes;
}
