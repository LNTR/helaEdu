package com.helaedu.website.service;

import com.helaedu.website.dto.StudentDto;
import com.helaedu.website.dto.SubjectDto;
import com.helaedu.website.dto.SubjectNoteDto;
import com.helaedu.website.entity.Student;
import com.helaedu.website.entity.Subject;
import com.helaedu.website.entity.SubjectNote;
import com.helaedu.website.entity.Teacher;
import com.helaedu.website.repository.SubjectRepository;
import com.helaedu.website.util.UniqueIdGenerator;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.concurrent.ExecutionException;
import java.util.stream.Collectors;

@Service
public class SubjectService {
    @Autowired
    private final SubjectRepository subjectRepository;

    @Autowired
    private FirebaseStorageService firebaseStorageService;

    public SubjectService(SubjectRepository subjectRepository) {
        this.subjectRepository = subjectRepository;
    }

    public String createSubject(SubjectDto subjectDto) throws ExecutionException, InterruptedException {

        String subjectId = UniqueIdGenerator.generateUniqueId("subj", subjectRepository::exists);

        Subject subject = new Subject(
                subjectId,
                subjectDto.getSubjectName(),
                subjectDto.getGrade(),
                subjectDto.getLanguage(),
                subjectDto.getPdfRef(),
                subjectDto.getCoverImgRef()
        );

        return subjectRepository.createSubject(subject);
    }

    public SubjectDto getSubject(String subjectId) throws ExecutionException, InterruptedException {
        Subject subject = subjectRepository.getSubjectById(subjectId);
        if (subject != null) {
            return new SubjectDto(
                    subjectId,
                    subject.getSubjectName(),
                    subject.getGrade(),
                    subject.getLanguage(),
                    subject.getPdfRef(),
                    subject.getCoverImgRef()
            );
        }
        return null;
    }

    public String uploadPdf(String subjectId, MultipartFile pdf) throws IOException, ExecutionException, InterruptedException {
        Subject subject = subjectRepository.getSubjectById(subjectId);

        String pdfRef;

        if(subject != null) {
            pdfRef = firebaseStorageService.uploadSubjectPdf(pdf, subjectId, subject.getGrade(), subject.getLanguage());
            subject.setPdfRef(pdfRef);
            subjectRepository.updateSubject(subjectId, subject);
        } else {
            throw new IllegalArgumentException("Subject not found");
        }
        return pdfRef;
    }
    public List<SubjectDto> getSubjectByGrade(String grade) throws ExecutionException, InterruptedException {
        List<Subject> subjects = subjectRepository.getSubjectByGrade(grade);
        return subjects.stream()
                .map(subject -> new SubjectDto(
                        subject.getSubjectId(),
                        subject.getSubjectName(),
                        subject.getGrade(),
                        subject.getLanguage(),
                        subject.getPdfRef(),
                        subject.getCoverImgRef()))
                .collect(Collectors.toList());
    }
    public String uploadCoverImage(String subjectId, MultipartFile profilePicture) throws IOException, ExecutionException, InterruptedException {

        Subject subject = subjectRepository.getSubjectById(subjectId);
        String coverImgRef;

        if(subject != null) {
            coverImgRef = firebaseStorageService.uploadCoverImage(profilePicture, subjectId);
            subject.setCoverImgRef(coverImgRef);
            subjectRepository.updateSubject(subjectId, subject);
        } else {
            throw new IllegalArgumentException("Subject not found");
        }
        return coverImgRef;
    }

}
