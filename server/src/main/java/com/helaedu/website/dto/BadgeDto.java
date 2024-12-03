package com.helaedu.website.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
public class BadgeDto {
    private String badgeId;
    private String badgeName;
    private String badgeType;
    private String userType;
}
