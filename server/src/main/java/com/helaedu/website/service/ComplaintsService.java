package com.helaedu.website.service;

import com.helaedu.website.dto.ArticleDto;
import com.helaedu.website.dto.ComplaintsDto;
import com.helaedu.website.entity.Article;
import com.helaedu.website.entity.Complaints;
import com.helaedu.website.repository.ComplaintsRepository;
import com.helaedu.website.util.UniqueIdGenerator;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.List;
import java.util.concurrent.ExecutionException;
import java.util.stream.Collectors;

@Service
public class ComplaintsService {

    @Autowired
    private FirebaseStorageService firebaseStorageService;

    private final ComplaintsRepository complaintsRepository;

    @Autowired
    public ComplaintsService(ComplaintsRepository complaintsRepository) {
        this.complaintsRepository = complaintsRepository;
    }

    public String addComplaint(ComplaintsDto complaintsDto) throws ExecutionException, InterruptedException {
        String complaintId = UniqueIdGenerator.generateUniqueId("com", complaintsRepository::exists);

        Instant publishedTimestamp = complaintsDto.getPublishedTimestamp() != null ?
                complaintsDto.getPublishedTimestamp() :
                Instant.now();

        Complaints complaints = new Complaints(
                complaintId,
                complaintsDto.getComplaint(),
                complaintsDto.getArticleId(),
                complaintsDto.getCommentId(),
                complaintsDto.getUserId(),
                publishedTimestamp
        );

        return complaintsRepository.addComplaint(complaints);
    }
    public List<ComplaintsDto> getAllComplaints() throws ExecutionException, InterruptedException {
        List<Complaints> complaints = complaintsRepository.getAllComplaints();
        return complaints.stream().map(complaint ->
                        new ComplaintsDto(
                                complaint.getComplaintId(),
                                complaint.getComplaint(),
                                complaint.getArticleId(),
                                complaint.getCommentId(),
                                complaint.getUserId(),
                                complaint.getPublishedTimestamp()
                        )
                )
                .collect(Collectors.toList());
    }

}
