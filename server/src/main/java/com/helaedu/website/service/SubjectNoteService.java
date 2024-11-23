package com.helaedu.website.service;

import com.google.firebase.auth.FirebaseAuthException;
import com.helaedu.website.dto.SubjectNoteDto;
import com.helaedu.website.entity.SubjectNote;
import com.helaedu.website.repository.SubjectNoteRepository;
import com.helaedu.website.util.UniqueIdGenerator;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.concurrent.ExecutionException;
import java.util.stream.Collectors;

@Service
public class SubjectNoteService {

    private final SubjectNoteRepository subjectNoteRepository;

    public SubjectNoteService(SubjectNoteRepository subjectNoteRepository) {
        this.subjectNoteRepository = subjectNoteRepository;
    }

    public String createSubjectNote(SubjectNoteDto subjectNoteDto) throws ExecutionException, InterruptedException, FirebaseAuthException {

        String subjectNoteId = UniqueIdGenerator.generateUniqueId("subNote", subjectNoteRepository::exists);

        SubjectNote subjectNote = new SubjectNote(
                subjectNoteId,
                subjectNoteDto.getSubjectId(),
                subjectNoteDto.getEmail(),
                subjectNoteDto.getContent()
        );

        subjectNoteDto.setSubjectNoteId(subjectNote.getSubjectNoteId());
        return subjectNoteRepository.createSubjectNote(subjectNote);
    }

    public List<SubjectNoteDto> getStudentSubjectNotesByEmail(String email) throws ExecutionException, InterruptedException {
        List<SubjectNote> subjectNotes = subjectNoteRepository.getStudentSubjectNotesByEmail(email);
        return subjectNotes.stream().map(subjectNote ->
                new SubjectNoteDto(
                        subjectNote.getSubjectNoteId(),
                        subjectNote.getEmail(),
                        subjectNote.getSubjectId(),
                        subjectNote.getContent()
                )
        ).collect(Collectors.toList());
    }

    public SubjectNoteDto getStudentSubjectNoteBySubjectId(String email, String subjectId) throws ExecutionException, InterruptedException {
        SubjectNote subjectNote = subjectNoteRepository.getStudentSubjectNoteBySubjectId(email, subjectId);
        if(subjectNote != null) {
            return new SubjectNoteDto(
                    subjectNote.getSubjectNoteId(),
                    subjectNote.getEmail(),
                    subjectNote.getSubjectId(),
                    subjectNote.getContent()
            );
        }
        return null;
    }

    public String updateStudentSubjectNoteBySubjectId(String email, String subjectId, SubjectNoteDto subjectNoteDto) throws ExecutionException, InterruptedException {
        SubjectNote existingSubjectNote = subjectNoteRepository.getStudentSubjectNoteBySubjectId(email, subjectId);
        if(existingSubjectNote == null) {
            throw new IllegalArgumentException("Subject note note found");
        }

        SubjectNote subjectNote = new SubjectNote(
                subjectNoteDto.getSubjectNoteId(),
                subjectNoteDto.getSubjectId(),
                subjectNoteDto.getEmail(),
                subjectNoteDto.getContent()
        );

        return subjectNoteRepository.updateStudentSubjectNoteBySubjectId(email, subjectId, subjectNote);
    }
}
