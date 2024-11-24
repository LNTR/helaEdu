package com.helaedu.website.repository;

import com.google.api.core.ApiFuture;
import com.google.cloud.firestore.*;
import com.google.firebase.cloud.FirestoreClient;
import com.helaedu.website.entity.Note;
import com.helaedu.website.entity.Note;
import org.springframework.stereotype.Repository;

import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.ExecutionException;

@Repository
public class NoteRepository {
    public String createNote(Note note) throws ExecutionException, InterruptedException {
        Firestore dbFirestore = FirestoreClient.getFirestore();
        ApiFuture<WriteResult> future = dbFirestore.collection("tNotes").document(note.getNoteId()).set(note);
        return future.get().getUpdateTime().toString();
    }

    public Note getNoteById(String noteId) throws ExecutionException, InterruptedException {
        Firestore dbFirestore = FirestoreClient.getFirestore();
        DocumentReference documentReference = dbFirestore.collection("tNotes").document(noteId);
        ApiFuture<DocumentSnapshot> future = documentReference.get();
        DocumentSnapshot document = future.get();
        Note note = null;
        if (document.exists()) {
            note = document.toObject(Note.class);
        }
        return note;
    }

    public String updateNote(String noteId, Note note) throws ExecutionException, InterruptedException {
        Firestore dbFirestore = FirestoreClient.getFirestore();
        DocumentReference documentReference = dbFirestore.collection("tNotes").document(noteId);
        ApiFuture<WriteResult> future = documentReference.set(note);
        return future.get().getUpdateTime().toString();
    }

    public boolean exists(String userId) throws ExecutionException, InterruptedException {
        return getNoteById(userId) != null;
    }
    public List<Note> getNotesByUserId(String teacherId) throws ExecutionException, InterruptedException {
        Firestore dbFirestore = FirestoreClient.getFirestore();
        CollectionReference notesCollection = dbFirestore.collection("tNotes");
        Query query = notesCollection.whereEqualTo("userId", teacherId);
        ApiFuture<QuerySnapshot> future = query.get();

        List<Note> notes = new ArrayList<>();
        QuerySnapshot querySnapshot = future.get();
        for (DocumentSnapshot document : querySnapshot.getDocuments()) {
            Note note = document.toObject(Note.class);
            notes.add(note);
        }
        return notes;
    }
}
