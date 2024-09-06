package com.helaedu.website.service;

import com.helaedu.website.dto.AssignmentDto;
import com.helaedu.website.dto.AssignmentQuestionDto;
import com.helaedu.website.entity.Assignment;
import com.helaedu.website.entity.AssignmentQuestion;
import com.helaedu.website.repository.AssignmentRepository;
import com.helaedu.website.util.UniqueIdGenerator;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ExecutionException;
import java.util.stream.Collectors;

@Service
public class AssignmentService {

    @Autowired
    private final AssignmentRepository assignmentRepository;

    @Autowired
    private WebSocketService webSocketService;

    private Map<String, Long> remainingTimeMap = new HashMap<>();

    private Map<String, Map<String, Long>> assignmentStudentRemainingTimeMap = new HashMap<>();

    public AssignmentService(AssignmentRepository assignmentRepository) {
        this.assignmentRepository = assignmentRepository;
    }

    public void startAssignment(String assignmentId) throws ExecutionException, InterruptedException {
        Assignment assignment = assignmentRepository.getAssignmentById(assignmentId);
        if(assignment != null && !assignment.isStarted()) {
            assignment.setStarted(true);
            assignment.setPublishedTimestamp(System.currentTimeMillis());
            assignment.setRemainingTime(assignment.getOpenTime());
            assignmentRepository.updateAssignment(assignmentId, assignment);
            remainingTimeMap.put(assignmentId, assignment.getOpenTime());
        } else {
            throw new IllegalArgumentException("Assignment not found or already started.");
        }
    }

    public long getRemainingTime(String assignmentId) throws ExecutionException, InterruptedException {
        Assignment assignment = assignmentRepository.getAssignmentById(assignmentId);
        if (assignment != null) {
            Long publishedTimestamp = assignment.getPublishedTimestamp();
            if(publishedTimestamp == null) {
                throw new IllegalArgumentException("Published timestamp is not set.");
            }

            long currentTime = System.currentTimeMillis();
            long endTime = assignment.getPublishedTimestamp() + assignment.getRemainingTime();
            long remainingTime = endTime - currentTime;

            return remainingTime > 0 ? remainingTime / 1000 : 0;
        } else {
            throw new IllegalArgumentException("Assignment not found.");
        }
    }

    @Scheduled(fixedRate = 1000)
    public void updateRemainingTime() {
        remainingTimeMap.forEach((assignmentId, remainingTime) -> {
            if (remainingTime > 0) {
                remainingTime -= 1;
                System.out.println("Remaining time: " + remainingTime);  // Debugging print

                webSocketService.sendTimeUpdate(assignmentId, remainingTime);

                try {
                    Assignment assignment = assignmentRepository.getAssignmentById(assignmentId);
                    assignment.setRemainingTime(remainingTime);
                    assignmentRepository.updateAssignment(assignmentId, assignment);
                    remainingTimeMap.put(assignmentId, remainingTime);  // Update map after updating DB
                } catch (Exception e) {
                    e.printStackTrace();
                }
            }
        });
    }

    public void studentStartAssignment(String assignmentId, String studentId) throws ExecutionException, InterruptedException {
        // Retrieve the assignment from the repository
        Assignment assignment = assignmentRepository.getAssignmentById(assignmentId);

        if (assignment != null) {
            long currentTime = System.currentTimeMillis();

            // Calculate assignment's open time and ensure the assignment is within the allowed timeframe
            long assignmentOpenTime = assignment.getPublishedTimestamp();
            long assignmentCloseTime = assignmentOpenTime + assignment.getOpenTime(); // The time when the assignment closes

            // Check if the assignment is open
            if (currentTime < assignmentOpenTime || currentTime > assignmentCloseTime) {
                throw new IllegalStateException("Assignment is not open at this time.");
            }

            // Initialize the in-memory map for assignment student remaining times if not present
            assignmentStudentRemainingTimeMap.computeIfAbsent(assignmentId, k -> new HashMap<>());
            Map<String, Long> studentRemainingTimes = assignmentStudentRemainingTimeMap.get(assignmentId);

            // Check if the student has already started the assignment
            if (!studentRemainingTimes.containsKey(studentId)) {
                // Initialize the student's remaining time based on the assignment time
                studentRemainingTimes.put(studentId, assignment.getAssignmentTime());

                // Update the student's remaining time in the database (Assignment entity)
                if (assignment.getStudentRemainingTimes() == null) {
                    assignment.setStudentRemainingTimes(new HashMap<>());
                }
                assignment.getStudentRemainingTimes().put(studentId, assignment.getAssignmentTime());

                // Save the updated assignment back to the database
                assignmentRepository.updateAssignment(assignmentId, assignment);
            } else {
                // If the student has already started the assignment, throw an exception
                throw new IllegalArgumentException("Student has already started the assignment.");
            }
        } else {
            // Throw an exception if the assignment was not found
            throw new IllegalArgumentException("Assignment not found.");
        }
    }
    @Scheduled(fixedRate = 1000)
    public void updateStudentRemainingTimes() {
        assignmentStudentRemainingTimeMap.forEach((assignmentId, studentTimes) -> {
            studentTimes.forEach((studentId, remainingTime) -> {
                if (remainingTime > 0) {
                    remainingTime -= 1;
                    webSocketService.sendStudentTimeUpdate(assignmentId, studentId, remainingTime);

                    studentTimes.put(studentId, remainingTime);

                    try {
                        Assignment assignment = assignmentRepository.getAssignmentById(assignmentId);
                        assignment.getStudentRemainingTimes().put(studentId, remainingTime);
                        assignmentRepository.updateAssignment(assignmentId, assignment);
                    } catch (Exception e) {
                        e.printStackTrace();
                    }
                }
            });
        });
    }

    public String createAssignment(String userId, AssignmentDto assignmentDto) throws ExecutionException, InterruptedException {

        String assignmentId = UniqueIdGenerator.generateUniqueId("as", assignmentRepository::exists);

        Assignment assignment = new Assignment(
                assignmentId,
                assignmentDto.getTitle(),
                assignmentDto.getInstructions(),
                assignmentDto.getOpenTime(),
                assignmentDto.getOpenTime(),
                assignmentDto.getAssignmentTime(),
                false,
                new HashMap<>(),
                new HashMap<>(),
                assignmentDto.getPublishedTimestamp(),
                userId,
                new ArrayList<>()
        );

        return assignmentRepository.createAssignment(assignment);
    }

    public List<AssignmentDto> getAllAssignments() throws ExecutionException, InterruptedException {
        List<Assignment> assignments = assignmentRepository.getAllAssignments();
        return assignments.stream()
                .map(assignment ->
                        new AssignmentDto(
                                assignment.getAssignmentId(),
                                assignment.getTitle(),
                                assignment.getInstructions(),
                                assignment.getOpenTime(),
                                assignment.getAssignmentTime(),
                                assignment.getRemainingTime(),
                                assignment.isStarted(),
                                assignment.getStudentMarks(),
                                assignment.getStudentRemainingTimes(),
                                assignment.getPublishedTimestamp(),
                                assignment.getUserId(),
                                assignment.getQuizzes()
                        )
                )
                .collect(Collectors.toList());
    }

    public List<AssignmentDto> getAssignmentsByTM(String userId) throws ExecutionException, InterruptedException {
        List<Assignment> assignments = assignmentRepository.getAssignmentsByTM(userId);
        return assignments.stream()
                .map(assignment ->
                        new AssignmentDto(
                                assignment.getAssignmentId(),
                                assignment.getTitle(),
                                assignment.getInstructions(),
                                assignment.getOpenTime(),
                                assignment.getAssignmentTime(),
                                assignment.getRemainingTime(),
                                assignment.isStarted(),
                                assignment.getStudentMarks(),
                                assignment.getStudentRemainingTimes(),
                                assignment.getPublishedTimestamp(),
                                assignment.getUserId(),
                                assignment.getQuizzes()
                        )
                )
                .collect(Collectors.toList());
    }

    public AssignmentDto getAssignment(String assignmentId) throws ExecutionException, InterruptedException {
        Assignment assignment = assignmentRepository.getAssignmentById(assignmentId);
        if (assignment != null) {
            return new AssignmentDto(
                    assignment.getAssignmentId(),
                    assignment.getTitle(),
                    assignment.getInstructions(),
                    assignment.getOpenTime(),
                    assignment.getAssignmentTime(),
                    assignment.getRemainingTime(),
                    assignment.isStarted(),
                    assignment.getStudentMarks(),
                    assignment.getStudentRemainingTimes(),
                    assignment.getPublishedTimestamp(),
                    assignment.getUserId(),
                    assignment.getQuizzes()
                    );
        }
        return null;
    }

    public String addQuizzesToAssignment(String assignmentId, List<AssignmentQuestionDto> quizzes) throws ExecutionException, InterruptedException {
        Assignment assignment = assignmentRepository.getAssignmentById(assignmentId);
        if (assignment != null) {
            List<AssignmentQuestion> quizEntities = quizzes.stream()
                    .map(quizDto -> new AssignmentQuestion(
                            quizDto.getQuizId(),
                            quizDto.getQuestion(),
                            quizDto.getOptions(),
                            quizDto.getCorrectAnswer(),
                            quizDto.getAssignmentId(),
                            quizDto.getMarks()
                    ))
                    .toList();

            assignment.getQuizzes().addAll(quizEntities);
            assignmentRepository.updateAssignment(assignmentId, assignment);
            return "Quizzes added successfully";
        }
        return "Assignment not found";
    }
}