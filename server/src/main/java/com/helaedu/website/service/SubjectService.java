package com.helaedu.website.service;

import com.helaedu.website.dto.StudentDto;
import com.helaedu.website.dto.SubjectDto;
import com.helaedu.website.entity.Student;
import com.helaedu.website.entity.Subject;
import com.helaedu.website.repository.SubjectRepository;
import com.helaedu.website.util.UniqueIdGenerator;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.concurrent.ExecutionException;

@Service
public class SubjectService {
    @Autowired
    private final SubjectRepository subjectRepository;

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
                subjectDto.getPdfRef()
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
                    subject.getPdfRef()
            );
        }
        return null;
    }
}
