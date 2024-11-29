package com.helaedu.website.service;

import com.helaedu.website.dto.AssignmentDto;
import com.helaedu.website.dto.AssignmentQuestionDto;
import com.helaedu.website.entity.Assignment;
import com.helaedu.website.entity.AssignmentQuestion;
import com.helaedu.website.repository.AssignmentQuestionRepository;
import com.helaedu.website.repository.AssignmentRepository;
import com.helaedu.website.util.UniqueIdGenerator;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.time.Instant;
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
    private final AssignmentQuestionRepository assignmentQuestionRepository;

    @Autowired
    private WebSocketService webSocketService;

    private Map<String, Map<String, Long>> assignmentStudentRemainingTimeMap = new HashMap<>();

    public AssignmentService(AssignmentRepository assignmentRepository, AssignmentQuestionRepository assignmentQuestionRepository) {
        this.assignmentRepository = assignmentRepository;
        this.assignmentQuestionRepository = assignmentQuestionRepository;
    }

    public void startAssignment(String assignmentId) throws ExecutionException, InterruptedException {
        Assignment assignment = assignmentRepository.getAssignmentById(assignmentId);
        if(assignment != null && !assignment.isStarted()) {
            assignment.setStarted(true);
            assignment.setPublishedTimestamp(System.currentTimeMillis());
            assignmentRepository.updateAssignment(assignmentId, assignment);
        } else {
            throw new IllegalArgumentException("Assignment not found or already started.");
        }
    }

    public void endAssignment(String assignmentId) throws ExecutionException, InterruptedException {
        Assignment assignment = assignmentRepository.getAssignmentById(assignmentId);
        if(assignment != null && assignment.isStarted()) {
            assignment.setStarted(false);
            assignment.setEndedTimestamp(System.currentTimeMillis());
            assignmentRepository.updateAssignment(assignmentId, assignment);
        } else {
            throw new IllegalArgumentException("Assignment not found or already ended.");
        }
    }

//    public long getRemainingTime(String assignmentId) throws ExecutionException, InterruptedException {
//        Assignment assignment = assignmentRepository.getAssignmentById(assignmentId);
//        if (assignment != null) {
//            Long publishedTimestamp = assignment.getPublishedTimestamp();
//            if(publishedTimestamp == null) {
//                throw new IllegalArgumentException("Published timestamp is not set.");
//            }
//
//            long currentTime = System.currentTimeMillis();
//            long endTime = assignment.getPublishedTimestamp() + assignment.getRemainingTime();
//            long remainingTime = endTime - currentTime;
//
//            return remainingTime > 0 ? remainingTime / 1000 : 0;
//        } else {
//            throw new IllegalArgumentException("Assignment not found.");
//        }
//    }

//    @Scheduled(fixedRate = 1000)
//    public void updateRemainingTime() {
//        remainingTimeMap.forEach((assignmentId, remainingTime) -> {
//            if (remainingTime > 0) {
//                remainingTime -= 1;
//                System.out.println("Remaining time: " + remainingTime);
//
//                webSocketService.sendTimeUpdate(assignmentId, remainingTime);
//
//                try {
//                    Assignment assignment = assignmentRepository.getAssignmentById(assignmentId);
//                    assignment.setRemainingTime(remainingTime);
//                    assignmentRepository.updateAssignment(assignmentId, assignment);
//                    remainingTimeMap.put(assignmentId, remainingTime);
//                } catch (Exception e) {
//                    e.printStackTrace();
//                }
//            }
//        });
//    }

    public void studentStartAssignment(String assignmentId, String studentId) throws ExecutionException, InterruptedException {
        Assignment assignment = assignmentRepository.getAssignmentById(assignmentId);

        if (assignment != null) {
            assignmentStudentRemainingTimeMap.computeIfAbsent(assignmentId, k -> new HashMap<>());
            Map<String, Long> studentRemainingTimes = assignmentStudentRemainingTimeMap.get(assignmentId);

            if(!assignment.isStarted()) {
                throw new IllegalArgumentException("Assignment has not started yet.");
            }
            else if (!studentRemainingTimes.containsKey(studentId)) {

                studentRemainingTimes.put(studentId, assignment.getTotalTime());

                if (assignment.getStudentRemainingTimes() == null) {
                    assignment.setStudentRemainingTimes(new HashMap<>());
                } else {
                    assignment.getStudentRemainingTimes().put(studentId, assignment.getTotalTime());
                }
                assignmentRepository.updateAssignment(assignmentId, assignment);
            } else {
                throw new IllegalArgumentException("Student has already started the assignment.");
            }
        } else {
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
//        Instant publishedTimestamp = assignmentDto.getPublishedTimestamp() != null ? assignmentDto.getPublishedTimestamp() : Instant.now();
        Assignment assignment = new Assignment(
                assignmentId,
                assignmentDto.getTitle(),
                assignmentDto.getInstructions(),
                assignmentDto.getTotalTime(),
                false,
                new HashMap<>(),
                new HashMap<>(),
                System.currentTimeMillis(),
                assignmentDto.getEndedTimestamp(),
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
                                assignment.getTotalTime(),
                                assignment.isStarted(),
                                assignment.getStudentMarks(),
                                assignment.getStudentRemainingTimes(),
                                assignment.getPublishedTimestamp(),
                                assignment.getEndedTimestamp(),
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
                                assignment.getTotalTime(),
                                assignment.isStarted(),
                                assignment.getStudentMarks(),
                                assignment.getStudentRemainingTimes(),
                                assignment.getPublishedTimestamp(),
                                assignment.getEndedTimestamp(),
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
                    assignment.getTotalTime(),
                    assignment.isStarted(),
                    assignment.getStudentMarks(),
                    assignment.getStudentRemainingTimes(),
                    assignment.getPublishedTimestamp(),
                    assignment.getEndedTimestamp(),
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
                    .map(quizDto -> {
                        try {
                            return new AssignmentQuestion(
                                    UniqueIdGenerator.generateUniqueId("que", assignmentQuestionRepository::exists),
                                    quizDto.getQuestion(),
                                    quizDto.getOptions(),
                                    quizDto.getCorrectAnswers(),
                                    quizDto.getGivenAnswers(),
                                    assignmentId,
                                    quizDto.getMarks()
                            );
                        } catch (ExecutionException e) {
                            throw new RuntimeException(e);
                        } catch (InterruptedException e) {
                            throw new RuntimeException(e);
                        }
                    })
                    .toList();

            assignment.getQuizzes().addAll(quizEntities);
            assignmentRepository.updateAssignment(assignmentId, assignment);
            return "Quizzes added successfully";
        }
        return "Assignment not found";
    }

    public void submitAnswer(String assignmentId, String quizId, String userId, List<String> providedAnswers) throws Exception {
        Assignment assignment = assignmentRepository.getAssignmentById(assignmentId);
        AssignmentQuestion question = getQuestionById(assignment, quizId);
        if (question.getGivenAnswers() == null) {
            question.setGivenAnswers(new HashMap<>());
        }
        question.getGivenAnswers().put(userId, providedAnswers);
        assignmentRepository.updateAssignment(assignmentId, assignment);
    }


    public AssignmentQuestion getQuestionById(Assignment assignment, String quizId) throws Exception {
        return assignment.getQuizzes().stream()
                .filter(q -> q.getQuestionId().equals(quizId))
                .findFirst()
                .orElseThrow(() -> new Exception("Question not found with quizId: " + quizId));
    }

    public String deleteAssignment(String assignmentId) throws ExecutionException, InterruptedException {
        return assignmentRepository.deleteAssignment(assignmentId);
    }

    public void submitStudentMarks(String assignmentId, String userId, Double studentMarks) throws Exception {
        Assignment assignment = assignmentRepository.getAssignmentById(assignmentId);
        if(assignment.getStudentMarks() == null) {
            assignment.setStudentMarks(new HashMap<>());
        }
        assignment.getStudentMarks().put(userId, studentMarks);
        assignmentRepository.updateAssignment(assignmentId, assignment);
    }

    public AssignmentDto getAssignmentReview(String assignmentId, String studentId) throws ExecutionException, InterruptedException {
        Assignment assignment = assignmentRepository.getAssignmentById(assignmentId);

        AssignmentDto assignmentDto = new AssignmentDto(
                assignment.getAssignmentId(),
                assignment.getTitle(),
                assignment.getInstructions(),
                assignment.getTotalTime(),
                assignment.isStarted(),
                assignment.getStudentMarks(),
                assignment.getStudentRemainingTimes(),
                assignment.getPublishedTimestamp(),
                assignment.getEndedTimestamp(),
                assignment.getUserId(),
                assignment.getQuizzes()
        );

        assignmentDto.getQuizzes().forEach(question -> {
            Map<String, List<String>> givenAnswers = question.getGivenAnswers();
            question.setGivenAnswers(Map.of(studentId, givenAnswers.get(studentId)));
        });

        return assignmentDto;
    }

    public Map<String, Double> getStudentsWithZeroRemainingTime(String assignmentId) throws ExecutionException, InterruptedException {
        Assignment assignment = assignmentRepository.getAssignmentById(assignmentId);

        if (assignment == null) {
            throw new IllegalArgumentException("Assignment not found");
        }

        Map<String, Long> remainingTimes = assignment.getStudentRemainingTimes();
        Map<String, Double> studentMarks = assignment.getStudentMarks();

        Map<String, Double> filteredStudents = new HashMap<>();
        remainingTimes.forEach((studentId, time) -> {
            if (time == 0L && studentMarks.containsKey(studentId)) {
                filteredStudents.put(studentId, studentMarks.get(studentId));
            }
        });

        return filteredStudents;
    }

    public void studentFinishAssignment(String assignmentId, String studentId) throws ExecutionException, InterruptedException {
        Assignment assignment = assignmentRepository.getAssignmentById(assignmentId);
        if (assignment != null) {
            if (!assignment.isStarted()) {
                throw new IllegalArgumentException("Assignment has not started yet.");
            }

            Map<String, Long> studentRemainingTimes = assignment.getStudentRemainingTimes();
            if (studentRemainingTimes != null && studentRemainingTimes.containsKey(studentId)) {
                studentRemainingTimes.put(studentId, 0L);
            } else {
                throw new IllegalArgumentException("Student has not started the assignment.");
            }

            double totalMarks = 0;

            List<AssignmentQuestion> questions = assignment.getQuizzes();

            for (AssignmentQuestion question : questions) {
                Map<String, List<String>> givenAnswersMap = question.getGivenAnswers();
                if (givenAnswersMap != null) {
                    List<String> studentAnswers = givenAnswersMap.get(studentId);
                    if (studentAnswers != null) {
                        List<String> correctAnswers = question.getCorrectAnswers();
                        int marks = question.getMarks();

                        if (studentAnswers.equals(correctAnswers)) {
                            totalMarks += marks;
                        }
                    }
                }
            }

            Map<String, Double> studentMarks = assignment.getStudentMarks();
            if (studentMarks == null) {
                studentMarks = new HashMap<>();
                assignment.setStudentMarks(studentMarks);
            }
            studentMarks.put(studentId, totalMarks);

            assignmentRepository.updateAssignment(assignmentId, assignment);
        } else {
            throw new IllegalArgumentException("Assignment not found.");
        }
    }

}