package com.helaedu.website.service;

import com.helaedu.website.dto.AssignmentDto;
import com.helaedu.website.dto.BadgeDto;
import com.helaedu.website.entity.Assignment;
import com.helaedu.website.entity.Badge;
import com.helaedu.website.repository.BadgeRepository;
import com.helaedu.website.util.UniqueIdGenerator;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.concurrent.ExecutionException;
@Service
public class BadgeService {
    private final BadgeRepository badgeRepository;

    public BadgeService(BadgeRepository badgeRepository) {
        this.badgeRepository = badgeRepository;
    }
}
