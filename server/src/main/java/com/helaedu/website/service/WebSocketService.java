package com.helaedu.website.service;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.HashMap;
import java.util.Map;

@Service
public class WebSocketService {
    private final SimpMessagingTemplate messagingTemplate;

    public WebSocketService(SimpMessagingTemplate messagingTemplate) {
        this.messagingTemplate = messagingTemplate;
    }

    public void sendTimeUpdate(String assignmentId, long remainingTime) {
        Map<String, Object> message = new HashMap<>();
        message.put("remainingTime", remainingTime);

        messagingTemplate.convertAndSend("/topic/assignment-time/" + assignmentId, message);
    }

    public void sendStudentTimeUpdate(String assignmentId, String studentId, long remainingTime) {
        // Send to a specific destination per student
        messagingTemplate.convertAndSend(
                "/topic/assignment-time/" + assignmentId + "/" + studentId,
                Collections.singletonMap("remainingTime", remainingTime)
        );
    }
//    public void sendTimeUpdate(String assignmentId, long remainingTime) {
//        messagingTemplate.convertAndSend("/topic/assignment-time/" + assignmentId, remainingTime);
//    }
}
