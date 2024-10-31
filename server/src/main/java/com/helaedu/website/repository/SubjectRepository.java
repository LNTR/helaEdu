package com.helaedu.website.repository;

import com.google.api.core.ApiFuture;
import com.google.cloud.firestore.DocumentReference;
import com.google.cloud.firestore.DocumentSnapshot;
import com.google.cloud.firestore.Firestore;
import com.google.firebase.cloud.FirestoreClient;
import com.helaedu.website.entity.Subject;
import org.springframework.stereotype.Repository;

import java.util.concurrent.ExecutionException;

@Repository
public class SubjectRepository {
    public String createSubject(Subject subject) {
        Firestore dbFirestore = FirestoreClient.getFirestore();
        DocumentReference documentReference  = dbFirestore.collection("subjects").document(subject.getSubjectId());
        documentReference .set(subject);
        return subject.getSubjectId();
    }

    public Subject getSubjectById(String subjectId) throws ExecutionException, InterruptedException {
        Firestore dbFirestore = FirestoreClient.getFirestore();
        DocumentReference documentReference = dbFirestore.collection("subjects").document(subjectId);
        ApiFuture<DocumentSnapshot> future = documentReference.get();
        DocumentSnapshot document = future.get();
        Subject subject = null;
        if (document.exists()) {
            subject = document.toObject(Subject.class);
        }
        return subject;
    }

    public boolean exists(String subjectId) throws ExecutionException, InterruptedException {
        return getSubjectById(subjectId) != null;
    }
}
