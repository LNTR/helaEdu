package com.helaedu.website.repository;

import org.springframework.stereotype.Repository;

import java.util.concurrent.ExecutionException;

@Repository
public class AssignmentQuestionRepository {
    public boolean exists(String assignmentId) throws ExecutionException, InterruptedException {
        return false;
    }
}
