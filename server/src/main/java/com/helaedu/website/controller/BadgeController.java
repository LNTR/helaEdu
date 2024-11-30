package com.helaedu.website.controller;

import com.helaedu.website.dto.BadgeDto;
import com.helaedu.website.service.BadgeService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;

import java.util.concurrent.ExecutionException;

@RestController
@RequestMapping("/badges")
@CrossOrigin(origins = "*")
public class BadgeController {
    private final BadgeService badgeService;
    public BadgeController(BadgeService badgeService){
        this.badgeService = badgeService;
    }
}
