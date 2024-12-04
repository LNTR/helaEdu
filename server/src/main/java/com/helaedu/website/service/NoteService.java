package com.helaedu.website.service;

import com.helaedu.website.dto.NoteDto;
import com.helaedu.website.entity.Note;
import com.helaedu.website.repository.NoteRepository;
import com.helaedu.website.util.UniqueIdGenerator;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.ExecutionException;
import java.util.stream.Collectors;

@Service
public class NoteService {
    private final NoteRepository noteRepository;

    public NoteService(NoteRepository noteRepository) {
        this.noteRepository = noteRepository;
    }

    public String createNoteTeacher(NoteDto noteDto) throws ExecutionException, InterruptedException {

        String noteId = UniqueIdGenerator.generateUniqueId("not", noteRepository::exists);

        Instant publishedTimestamp = noteDto.getPublishedTimestamp() != null ?
                noteDto.getPublishedTimestamp() :
                Instant.now();

        Note note = new Note(
                noteId,
                noteDto.getTitle(),
                noteDto.getContent(),
                noteDto.getSubject(),
                publishedTimestamp,
                noteDto.getUserId()

        );

        return noteRepository.createNote(note);
    }
    public List<NoteDto> getNotesByUser(String userId) throws ExecutionException, InterruptedException {
        List<Note> notes = noteRepository.getNotesByUserId(userId);
        return notes.stream().map(note ->
                        new NoteDto(
                                note.getNoteId(),
                                note.getTitle(),
                                note.getContent(),
                                note.getSubject(),
                                note.getPublishedTimestamp(),
                                note.getUserId()

                        )
                )
                .collect(Collectors.toList());
    }

    public NoteDto getNote(String noteId) throws ExecutionException, InterruptedException {
        Note note = noteRepository.getNoteById(noteId);
        if (note != null) {
            return new NoteDto(
                    note.getNoteId(),
                    note.getContent(),
                    note.getTitle(),
                    note.getSubject(),
                    note.getPublishedTimestamp(),
                    note.getUserId()
            );
        }
        return null;
    }

    public String updateNote(String noteId, NoteDto noteDto) throws ExecutionException, InterruptedException {
        Note existingNote = noteRepository.getNoteById(noteId);
        if (existingNote == null) {
            throw new IllegalArgumentException("Note not found");
        }

        Note note = new Note(
                noteId,
                noteDto.getContent() != null ? noteDto.getContent() : existingNote.getContent(),
                noteDto.getTitle() != null ? noteDto.getTitle() : existingNote.getTitle(),
                noteDto.getSubject() != null ? noteDto.getSubject() : existingNote.getSubject(),
                noteDto.getPublishedTimestamp() != null ? noteDto.getPublishedTimestamp() : existingNote.getPublishedTimestamp(),
                noteDto.getUserId() != null ? noteDto.getUserId() : existingNote.getUserId()
        );
        return noteRepository.updateNote(noteId, note);
    }

    public String deleteNote(String noteId) throws ExecutionException, InterruptedException {
        return noteRepository.deleteNote(noteId);
    }
}
