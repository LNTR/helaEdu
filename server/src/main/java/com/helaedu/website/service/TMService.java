package com.helaedu.website.service;

import com.helaedu.website.dto.TeacherDto;
import com.helaedu.website.entity.Badge;
import com.helaedu.website.entity.Student;
import com.helaedu.website.entity.Subscription;
import com.helaedu.website.entity.Teacher;
import com.helaedu.website.repository.TMRepository;
import com.helaedu.website.repository.TeacherRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.time.Instant;
import java.util.List;
import java.util.concurrent.ExecutionException;
import java.util.stream.Collectors;

@Service
public class TMService {
    private final TMRepository tmRepository;

    private final TeacherRepository teacherRepository;

    @Autowired
    private final FirebaseStorageService firebaseStorageService;

    private final Badge MASTERMIND_GOLD_BADGE;
    private final Badge REPUTATION_TITAN_GOLD_BADGE;
    private final Badge RISING_STAR_SILVER_BADGE;
    private final Badge DAILY_DYNAMO_SILVER_BADGE;
    private final Badge CONTRIBUTOR_BRONZE_BADGE;
    private final Badge DAILY_ACHIEVER_BRONZE_BADGE;

    public TMService(TMRepository tmRepository, TeacherRepository teacherRepository, FirebaseStorageService firebaseStorageService) {
        this.tmRepository = tmRepository;
        this.teacherRepository = teacherRepository;
        this.firebaseStorageService = firebaseStorageService;

        MASTERMIND_GOLD_BADGE = new Badge("MASTERMIND", "GOLD", "TM");
        REPUTATION_TITAN_GOLD_BADGE = new Badge("REPUTATION TITAN", "GOLD", "TM");
        RISING_STAR_SILVER_BADGE = new Badge("RISING START", "SILVER", "TM");
        DAILY_DYNAMO_SILVER_BADGE = new Badge("DAILY DINAMO", "SILVER", "TM");
        CONTRIBUTOR_BRONZE_BADGE = new Badge("CONTRIBUTOR", "BRONZE", "TM");
        DAILY_ACHIEVER_BRONZE_BADGE = new Badge("DAILY ACHIEVER", "BRONZE", "TM");
    }

    public TeacherDto getTM(String userId) throws ExecutionException, InterruptedException {
        Teacher tm = tmRepository.getTMById(userId);
        if (tm != null) {
            return new TeacherDto(
                    userId,
                    tm.getFirstName(),
                    tm.getLastName(),
                    tm.getEmail(),
                    tm.getPassword(),
                    tm.getRegTimestamp(),
                    tm.getIsModerator(),
                    tm.getProofRef(),
                    tm.getRole(),
                    tm.isEmailVerified(),
                    tm.getProfilePictureUrl(),
                    tm.isApproved(),
                    tm.getAbout(),
                    tm.getPreferredSubjects(),
                    tm.getSchool(),
                    tm.getPoints(),
                    tm.getBadges(),
                    tm.getAssignedSubjects(),
                    tm.getUpgradedStatus()
            );
        }
        return null;
    }

    @Scheduled(cron = "0 0 0 * * ?") //Runs daily at midnight
    public void checkForPointsAndGiveBadges() throws ExecutionException, InterruptedException {
        List<Teacher> teachers = teacherRepository.getAllTeachers();
        for(Teacher teacher : teachers) {
            if(teacher.getPoints() > 100) {
                teacher.getBadges().add(CONTRIBUTOR_BRONZE_BADGE);
            } else if(teacher.getPoints() > 200) {
                teacher.getBadges().add(DAILY_ACHIEVER_BRONZE_BADGE);
            } else if (teacher.getPoints() > 300) {
                teacher.getBadges().add(RISING_STAR_SILVER_BADGE);
            } else if(teacher.getPoints() > 400) {
                teacher.getBadges().add(DAILY_DYNAMO_SILVER_BADGE);
            } else if(teacher.getPoints() > 500) {
                teacher.getBadges().add(MASTERMIND_GOLD_BADGE);
            } else if(teacher.getPoints() > 600) {
                teacher.getBadges().add(REPUTATION_TITAN_GOLD_BADGE);
            }
            teacherRepository.updateTeacher(teacher.getUserId(), teacher);
        }
    }

    public TeacherDto getTMByEmail(String email) throws ExecutionException, InterruptedException {
        Teacher tm = tmRepository.getTMByEmail(email);
        if (tm != null) {
            return new TeacherDto(
                    tm.getUserId(),
                    tm.getFirstName(),
                    tm.getLastName(),
                    tm.getEmail(),
                    tm.getPassword(),
                    tm.getRegTimestamp(),
                    tm.getIsModerator(),
                    tm.getProofRef(),
                    tm.getRole(),
                    tm.isEmailVerified(),
                    tm.getProfilePictureUrl(),
                    tm.isApproved(),
                    tm.getAbout(),
                    tm.getPreferredSubjects(),
                    tm.getSchool(),
                    tm.getPoints(),
                    tm.getBadges(),
                    tm.getAssignedSubjects(),
                    tm.getUpgradedStatus()
            );
        }
        return null;
    }

    public String uploadProfilePicture(String email, MultipartFile profilePicture) throws IOException, ExecutionException, InterruptedException {
        Teacher tm = tmRepository.getTMByEmail(email);

        String profilePictureUrl = firebaseStorageService.uploadProfilePicture(profilePicture, email);

        if(tm != null) {
            tm.setProfilePictureUrl(profilePictureUrl);
            tmRepository.updateTMByEmail(email, tm);
        } else {
            throw new IllegalArgumentException("Teacher or moderator not found");
        }
        return profilePictureUrl;
    }

    public int increasePointsBy5(String userId) throws ExecutionException, InterruptedException {
        Teacher tm = tmRepository.getTMById(userId);

        if(tm != null) {
            int currentPoints = tm.getPoints();
            tm.setPoints(currentPoints + 5);
            tmRepository.updateTMByEmail(tm.getEmail(), tm);
        } else {
            throw new IllegalArgumentException("Teacher or moderator not found");
        }
        return tm.getPoints();
    }

    public int increasePointsBy10(String userId) throws ExecutionException, InterruptedException {
        Teacher tm = tmRepository.getTMById(userId);

        if(tm != null) {
            int currentPoints = tm.getPoints();
            tm.setPoints(currentPoints + 10);
            tmRepository.updateTMByEmail(tm.getEmail(), tm);
        } else {
            throw new IllegalArgumentException("Teacher or moderator not found");
        }
        return tm.getPoints();
    }

    public void deleteProfilePicture(String email) throws IOException, ExecutionException, InterruptedException {
        Teacher tm = tmRepository.getTMByEmail(email);

        if (tm != null) {
            String profilePictureUrl = tm.getProfilePictureUrl();
            if (profilePictureUrl != null && !profilePictureUrl.isEmpty()) {
                firebaseStorageService.deleteProfilePicture(profilePictureUrl);
                tm.setProfilePictureUrl(null);
                tmRepository.updateTMByEmail(email, tm);
            } else {
                throw new IllegalArgumentException("No profile picture to delete");
            }
        } else {
            throw new IllegalArgumentException("Teacher or moderator not found");
        }
    }

    public List<TeacherDto> getPendingTMs() throws ExecutionException, InterruptedException {
        List<Teacher> tms = tmRepository.getPendingTMs();
        return tms.stream().map(tm ->
                        new TeacherDto(
                                tm.getUserId(),
                                tm.getFirstName(),
                                tm.getLastName(),
                                tm.getEmail(),
                                tm.getPassword(),
                                tm.getRegTimestamp(),
                                tm.getIsModerator(),
                                tm.getProofRef(),
                                tm.getRole(),
                                tm.isEmailVerified(),
                                tm.getProfilePictureUrl(),
                                tm.isApproved(),
                                tm.getAbout(),
                                tm.getPreferredSubjects(),
                                tm.getSchool(),
                                tm.getPoints(),
                                tm.getBadges(),
                                tm.getAssignedSubjects(),
                                tm.getUpgradedStatus()
                        )
                )
                .collect(Collectors.toList());
    }
}
