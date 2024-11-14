package com.helaedu.website.repository;

import com.google.api.core.ApiFuture;
import com.google.cloud.firestore.*;
import com.google.firebase.cloud.FirestoreClient;
import com.helaedu.website.entity.SubjectNote;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.concurrent.ExecutionException;

@Repository
public class SubjectNoteRepository {
    public String createSubjectNote(SubjectNote subjectNote) {
        Firestore dbFirestore = FirestoreClient.getFirestore();
        DocumentReference documentReference  = dbFirestore.collection("subjectNotes").document(subjectNote.getSubjectId());
        documentReference .set(subjectNote);
        return subjectNote.getSubjectNoteId();
    }

    public List<SubjectNote> getStudentSubjectNotesByEmail(String email) throws ExecutionException, InterruptedException {
        Firestore dbFirestore = FirestoreClient.getFirestore();
        CollectionReference subjectNotesCollection = dbFirestore.collection("subjectNotes");
        ApiFuture<QuerySnapshot> future = subjectNotesCollection.whereEqualTo("email", email).get();
        return future.get().toObjects(SubjectNote.class);
    }

    public SubjectNote getStudentSubjectNoteBySubjectId(String email, String subjectId) throws ExecutionException, InterruptedException {
        Firestore dbFirestore = FirestoreClient.getFirestore();
        CollectionReference subjectNotesCollection = dbFirestore.collection("subjectNotes");
        ApiFuture<QuerySnapshot> future = subjectNotesCollection.whereEqualTo("email", email).whereEqualTo("subjectId", subjectId).get();
        List<SubjectNote> subjectNotes =  future.get().toObjects(SubjectNote.class);
        return subjectNotes.isEmpty() ? null : subjectNotes.get(0);
    }

    public SubjectNote getSubjectNoteBySubjectId(String subjectId) throws ExecutionException, InterruptedException {
        Firestore dbFirestore = FirestoreClient.getFirestore();
        CollectionReference subjectNotesCollection = dbFirestore.collection("subjectNotes");
        ApiFuture<QuerySnapshot> future = subjectNotesCollection.whereEqualTo("subjectId", subjectId).get();
        List<SubjectNote> subjectNotes =  future.get().toObjects(SubjectNote.class);
        return subjectNotes.isEmpty() ? null : subjectNotes.get(0);
    }

    public String updateStudentSubjectNoteBySubjectId(String email, String subjectId, SubjectNote subjectNote) throws ExecutionException, InterruptedException {
        Firestore dbFirestore = FirestoreClient.getFirestore();
        CollectionReference subjectNotesCollection = dbFirestore.collection("subjectNotes");
        ApiFuture<QuerySnapshot> future = subjectNotesCollection.whereEqualTo("email", email).whereEqualTo("subjectId", subjectId).get();
        List<QueryDocumentSnapshot> documents = future.get().getDocuments();
        DocumentReference documentReference = documents.get(0).getReference();
        ApiFuture<WriteResult> updateFuture = documentReference.set(subjectNote);
        return updateFuture.get().getUpdateTime().toString();
    }

    public boolean exists(String subjectId) throws ExecutionException, InterruptedException {
        return getSubjectNoteBySubjectId(subjectId) != null;
    }
}
