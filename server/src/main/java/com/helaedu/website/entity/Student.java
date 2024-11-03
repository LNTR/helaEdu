package com.helaedu.website.entity;


import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.ArrayList;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class Student extends User {
    private String noteId;
    private String subscriptionId;
    private ArrayList<String> enrolledSubjects;

    public Student(String userId, String firstName, String lastName, String email, String password, String regTimestamp, String noteId, String subscriptionId, ArrayList<String> enrolledSubjects, String role, String profilePictureUrl) {
        super.setUserId(userId);
        super.setFirstName(firstName);
        super.setLastName(lastName);
        super.setEmail(email);
        super.setPassword(password);
        super.setRegTimestamp(regTimestamp);
        this.noteId = noteId;
        this.subscriptionId = subscriptionId;
        this.enrolledSubjects = enrolledSubjects;
        super.setRole(role);
        super.setProfilePictureUrl(profilePictureUrl);
    }
}