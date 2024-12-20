package com.helaedu.website.service;

import com.google.firebase.auth.FirebaseAuth;
import com.google.firebase.auth.FirebaseAuthException;
import com.google.firebase.auth.UserRecord;
import com.helaedu.website.dto.SubjectDto;
import com.helaedu.website.dto.SubscriptionDto;
import com.helaedu.website.entity.Subject;
import com.helaedu.website.entity.Subscription;
import com.helaedu.website.repository.SubscriptionRepository;
import com.helaedu.website.util.UniqueIdGenerator;
import com.helaedu.website.dto.StudentDto;
import com.helaedu.website.entity.Note;
import com.helaedu.website.entity.Student;
import com.helaedu.website.repository.NoteRepository;
import com.helaedu.website.repository.StudentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.time.Instant;
import java.time.LocalDate;
import java.time.ZonedDateTime;
import java.time.format.DateTimeFormatter;
import java.time.format.DateTimeParseException;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import java.util.Map;
import java.util.concurrent.ExecutionException;
import java.util.stream.Collectors;

@Service
public class StudentService {

    private final StudentRepository studentRepository;
//    private final NoteRepository noteRepository;
    private final SubscriptionRepository subscriptionRepository;

    @Autowired
    private EmailVerificationService emailVerificationService;

    @Autowired
    private FirebaseStorageService firebaseStorageService;

    public StudentService(StudentRepository studentRepository, NoteRepository noteRepository, SubscriptionRepository subscriptionRepository) {
        this.studentRepository = studentRepository;
//        this.noteRepository = noteRepository;
        this.subscriptionRepository = subscriptionRepository;
    }

    public String createStudent(StudentDto studentDto) throws ExecutionException, InterruptedException, FirebaseAuthException {
        Student existingStudent = studentRepository.getStudentByEmail(studentDto.getEmail());
        if (existingStudent != null) {
            throw new IllegalArgumentException("Email already exists");
        }

        BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();
        String userId = UniqueIdGenerator.generateUniqueId("st", studentRepository::exists);
//        String noteId = UniqueIdGenerator.generateUniqueId("sn", noteRepository::exists);

//        Note note = new Note(noteId, "");
//        noteRepository.createNote(note);

        Student student = new Student(
                userId,
                studentDto.getFirstName(),
                studentDto.getLastName(),
                studentDto.getEmail(),
                encoder.encode(studentDto.getPassword()),
                Instant.now().toString(),
//                noteId,
                studentDto.getSubscriptionId(),
                new ArrayList<>(),
                "ROLE_STUDENT",
                null
        );
        studentDto.setUserId(student.getUserId());
//        studentDto.setNoteId(noteId);

        FirebaseAuth firebaseAuth = FirebaseAuth.getInstance();
        UserRecord.CreateRequest request = new UserRecord.CreateRequest()
                .setEmail(studentDto.getEmail())
                .setEmailVerified(false)
                .setPassword(studentDto.getPassword())
                .setUid(student.getUserId());

        firebaseAuth.createUser(request);

        emailVerificationService.sendVerificationEmail(studentDto.getUserId(), studentDto.getEmail(), "students");
        return studentRepository.createStudent(student);
    }

    public String uploadProfilePicture(String email, MultipartFile profilePicture) throws IOException, ExecutionException, InterruptedException {
        Student student = studentRepository.getStudentByEmail(email);

        String profilePictureUrl = firebaseStorageService.uploadProfilePicture(profilePicture, email);

        if(student != null) {
            student.setProfilePictureUrl(profilePictureUrl);
            studentRepository.updateStudentByEmail(email, student);
        } else {
            throw new IllegalArgumentException("Student not found");
        }
        return profilePictureUrl;
    }

    public void deleteProfilePicture(String email) throws IOException, ExecutionException, InterruptedException {
        Student student = studentRepository.getStudentByEmail(email);

        if (student != null) {
            String profilePictureUrl = student.getProfilePictureUrl();
            if (profilePictureUrl != null && !profilePictureUrl.isEmpty()) {
                firebaseStorageService.deleteProfilePicture(profilePictureUrl);
                student.setProfilePictureUrl(null);
                studentRepository.updateStudentByEmail(email, student);
            } else {
                throw new IllegalArgumentException("No profile picture to delete");
            }
        } else {
            throw new IllegalArgumentException("Student not found");
        }
    }


    public void verifyEmail(String userId) throws ExecutionException, InterruptedException, FirebaseAuthException {
        FirebaseAuth.getInstance();

        Student student = studentRepository.getStudentById(userId);
        if (student != null) {
            student.setEmailVerified(true);
            studentRepository.updateStudent(userId, student);
        } else {
            throw new IllegalArgumentException("Student not found");
        }
    }

    public List<StudentDto> getAllStudents() throws ExecutionException, InterruptedException {
        List<Student> students = studentRepository.getAllStudents();
        return students.stream().map(student ->
                        new StudentDto(
                                student.getUserId(),
                                student.getFirstName(),
                                student.getLastName(),
                                student.getEmail(),
                                student.getPassword(),
                                student.getRegTimestamp(),
                                student.getSubscriptionId(),
                                student.getEnrolledSubjects(),
                                student.getRole(),
                                student.isEmailVerified(),
                                null
                        )
                )
                .collect(Collectors.toList());
    }

    public List<StudentDto> getAllStudents(int page) throws ExecutionException, InterruptedException {
        List<Student> students = studentRepository.getAllStudents(page);
        return students.stream().map(student ->
                new StudentDto(
                        student.getUserId(),
                        student.getFirstName(),
                        student.getLastName(),
                        student.getEmail(),
                        student.getPassword(),
                        student.getRegTimestamp(),
//                        student.getNoteId(),
                        student.getSubscriptionId(),
                        student.getEnrolledSubjects(),
                        student.getRole(),
                        student.isEmailVerified(),
                        null
                )
        ).collect(Collectors.toList());
    }

    public StudentDto getStudent(String userId) throws ExecutionException, InterruptedException {
        Student student = studentRepository.getStudentById(userId);
        if (student != null) {
            return new StudentDto(
                    userId,
                    student.getFirstName(),
                    student.getLastName(),
                    student.getEmail(),
                    student.getPassword(),
                    student.getRegTimestamp(),
//                    student.getNoteId(),
                    student.getSubscriptionId(),
                    student.getEnrolledSubjects(),
                    student.getRole(),
                    student.isEmailVerified(),
                    null
            );
        }
        return null;
    }

    public StudentDto getStudentByEmail(String email) throws ExecutionException, InterruptedException {
        Student student = studentRepository.getStudentByEmail(email);
        if (student != null) {
            return new StudentDto(
                    student.getUserId(),
                    student.getFirstName(),
                    student.getLastName(),
                    student.getEmail(),
                    student.getPassword(),
                    student.getRegTimestamp(),
//                    student.getNoteId(),
                    student.getSubscriptionId(),
                    student.getEnrolledSubjects(),
                    student.getRole(),
                    student.isEmailVerified(),
                    null
            );
        }
        return null;
    }

    public String updateStudentByEmail(String email, StudentDto studentDto) throws ExecutionException, InterruptedException {
        BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();

        Student existingStudent = studentRepository.getStudentByEmail(email);
        if(existingStudent == null) {
            throw new IllegalArgumentException("Student not found");
        }

        if(studentDto.getFirstName() != null && !studentDto.getFirstName().equals(existingStudent.getFirstName())) {
            existingStudent.setFirstName(studentDto.getFirstName());
        }
        if(studentDto.getLastName() != null && !studentDto.getLastName().equals(existingStudent.getLastName())) {
            existingStudent.setLastName(studentDto.getLastName());
        }
        if(studentDto.getEmail() != null && !studentDto.getEmail().equals(existingStudent.getEmail())) {
            existingStudent.setEmail(studentDto.getEmail());
        }
        if(studentDto.getPassword() != null && !(encoder.encode(studentDto.getPassword()).equals(encoder.encode(existingStudent.getPassword())))) {
            existingStudent.setPassword(encoder.encode(studentDto.getPassword()));
        }
        if(studentDto.getRegTimestamp() != null) {
            existingStudent.setRegTimestamp(studentDto.getRegTimestamp());
        }
//        if(studentDto.getNoteId() != null) {
//            existingStudent.setNoteId(studentDto.getNoteId());
//        }
        if(studentDto.getSubscriptionId() != null) {
            existingStudent.setSubscriptionId(studentDto.getSubscriptionId());
        }

        return studentRepository.updateStudentByEmail(email, existingStudent);
    }

    public String deleteStudent(String userId) throws ExecutionException, InterruptedException {
        return studentRepository.deleteStudent(userId);
    }

    public String deleteStudentByEmail(String email) throws ExecutionException, InterruptedException {
        return studentRepository.deleteStudentByEmail(email);
    }

    public String createSubscription(String userId, long paidAmount) throws ExecutionException, InterruptedException {
        String subscriptionId = UniqueIdGenerator.generateUniqueId("sub", subscriptionRepository::exists);
        String startTimestamp = Instant.now().toString();
        String endTimestamp = Instant.now().plus(30, ChronoUnit.DAYS).toString();

        Subscription subscription = new Subscription(
                subscriptionId,
                userId,
                paidAmount,
                startTimestamp,
                endTimestamp,
                false
        );
        subscriptionRepository.createSubscription(subscription);

        Student student = studentRepository.getStudentById(userId);
        student.setSubscriptionId(subscriptionId);
        studentRepository.updateStudent(userId, student);

        return subscriptionId;
    }

    public String createSubscriptionByEmail(String email, long paidAmount) throws ExecutionException, InterruptedException {
        String subscriptionId = UniqueIdGenerator.generateUniqueId("sub", subscriptionRepository::exists);
        String startTimestamp = Instant.now().toString();
        String endTimestamp = Instant.now().plus(30, ChronoUnit.DAYS).toString();

        Student student = studentRepository.getStudentByEmail(email);

        if(student.getSubscriptionId() == null) {
            Subscription subscription = new Subscription(
                    subscriptionId,
                    student.getUserId(),
                    paidAmount,
                    startTimestamp,
                    endTimestamp,
                    false
            );
            subscriptionRepository.createSubscription(subscription);

            student.setSubscriptionId(subscriptionId);
            studentRepository.updateStudentByEmail(student.getEmail(), student);

            SubscriptionDto subscriptionDto = new SubscriptionDto(
                    subscriptionId,
                    student.getUserId(),
                    paidAmount,
                    startTimestamp,
                    endTimestamp,
                    false
            );
            emailVerificationService.sendSubscriptionEmail(email, subscriptionDto);

            return subscriptionId;
        }
        return null;
    }

    public void cancelSubscription(String userId) throws ExecutionException, InterruptedException {
        Student student = studentRepository.getStudentById(userId);
        student.setSubscriptionId(null);
        studentRepository.updateStudent(userId, student);
    }

    public void enrollSubject(String userId, SubjectDto subjectDto) throws ExecutionException, InterruptedException {
        Student student = studentRepository.getStudentById(userId);
        ArrayList<String> enrolledSubjects = new ArrayList<>();
        enrolledSubjects.add(subjectDto.getSubjectId());
        student.setEnrolledSubjects(enrolledSubjects);
        studentRepository.updateStudent(userId, student);
    }

    public List<StudentDto> getStudentsWithActiveSubscriptions() throws ExecutionException, InterruptedException {
        List<Student> students = studentRepository.getAllStudents();
        Instant now = Instant.now();
        Instant thirtyDaysAgo = now.minus(30, ChronoUnit.DAYS);

        return students.stream()
                .filter(student -> {
                    String subscriptionId = student.getSubscriptionId();
                    if (subscriptionId == null || subscriptionId.isEmpty()) {
                        return false;
                    }
                    Subscription subscription = null;
                    try {
                        subscription = subscriptionRepository.getSubscriptionById(subscriptionId);
                    } catch (ExecutionException | InterruptedException e) {
                        e.printStackTrace();
                    }
                    return subscription != null && !subscription.isCanceled() && Instant.parse(subscription.getStartTimestamp()).isAfter(thirtyDaysAgo);
                })
                .map(student -> new StudentDto(
                        student.getUserId(),
                        student.getFirstName(),
                        student.getLastName(),
                        student.getEmail(),
                        student.getPassword(),
                        student.getRegTimestamp(),
//                        student.getNoteId(),
                        student.getSubscriptionId(),
                        student.getEnrolledSubjects(),
                        student.getRole(),
                        student.isEmailVerified(),
                        null
                ))
                .collect(Collectors.toList());
    }

//    public Map<String, Integer> getStudentsCountForReport(String startDate, String endDate) throws ExecutionException, InterruptedException {
//        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd");
//        LocalDate start = LocalDate.parse(startDate, formatter);
//        LocalDate end = LocalDate.parse(endDate, formatter);
//
//        List<Student> students = studentRepository.getAllStudents();
//
//        return students.stream()
//                .filter(student -> {
//                    LocalDate regDate = LocalDate.parse(student.getRegTimestamp(), formatter);
//                    return (regDate.isEqual(start) || regDate.isAfter(start)) && (regDate.isEqual(end) || regDate.isBefore(end));
//                })
//                .collect(Collectors.groupingBy(
//                        student -> LocalDate.parse(student.getRegTimestamp(), formatter).toString(),
//                        Collectors.summingInt(student -> 1)
//                ));
//    }
        public Map<String, Integer> getStudentsCountForReport(String startDate, String endDate) throws ExecutionException, InterruptedException {
            DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd");
            DateTimeFormatter isoFormatter = DateTimeFormatter.ofPattern("yyyy-MM-dd'T'HH:mm:ss.SSSSSSSSSX");

            LocalDate start;
            LocalDate end;

            try {
                startDate = startDate.trim();
                endDate = endDate.trim();
                start = LocalDate.parse(startDate, formatter);
                end = LocalDate.parse(endDate, formatter);
            } catch (DateTimeParseException e) {
                throw new IllegalArgumentException(
                        "Invalid date format for startDate or endDate. Expected format: yyyy-MM-dd. Received startDate: "
                                + startDate + ", endDate: " + endDate, e
                );
            }
            List<Student> students = studentRepository.getAllStudents();
            if (students == null || students.isEmpty()) {
                throw new RuntimeException("No students found in the database.");
            }
            return students.stream()
                    .filter(student -> {
                        String regTimestamp = student.getRegTimestamp();
                        if (regTimestamp == null) {
                            System.out.println("Null registration timestamp for student: " + student.getUserId());
                            return false;
                        }
                        try {

                            LocalDate regDate = ZonedDateTime.parse(regTimestamp, isoFormatter).toLocalDate();
                            return (regDate.isEqual(start) || regDate.isAfter(start)) &&
                                    (regDate.isEqual(end) || regDate.isBefore(end));
                        } catch (DateTimeParseException e) {
                            System.out.println("Invalid timestamp format for student: " + student.getUserId());
                            return false;
                        }
                    })
                    .collect(Collectors.groupingBy(
                            student -> ZonedDateTime.parse(student.getRegTimestamp(), isoFormatter).toLocalDate().toString(),
                            Collectors.summingInt(student -> 1)
                    ));
        }


}
