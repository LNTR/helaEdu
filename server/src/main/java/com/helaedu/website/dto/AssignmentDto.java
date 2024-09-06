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

    @NotNull(message = "Open time cannot be null")
    @Positive(message = "Open time must be greater than zero")
    private Long openTime;

    @NotNull(message = "Assignment time cannot be null")
    @Positive(message = "Assignment time must be greater than zero")
    private Long assignmentTime;

    private Long remainingTime;

    private boolean started;
    private Map<String, Double> studentMarks;
    private Map<String, Long> studentRemainingTimes;

    private Long publishedTimestamp;
    private String userId;
    private List<AssignmentQuestion> quizzes;

    @AssertTrue(message = "Open time must be greater than assignment time")
    public boolean isOpenTimeGreaterThanAssignmentTime() {
        if (openTime != null && assignmentTime != null) {
            return openTime > assignmentTime;
        }
        return true;
    }
}
