package com.helaedu.website.entity;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class Teacher extends User{
    private Boolean isModerator;
    private String proofRef;
//    private String school;
    private String role;

    public Teacher(String userId, String firstName, String lastName, String email, String password, String regTimestamp, Boolean isModerator, String proofRef, String role) {
        super.setUserId(userId);
        super.setFirstName(firstName);
        super.setLastName(lastName);
        super.setEmail(email);
        super.setPassword(password);
        super.setRegTimestamp(regTimestamp);
        this.isModerator = isModerator;
        this.proofRef = proofRef;
        this.role = role;
//        this.school=school;
    }
}
