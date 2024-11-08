package com.helaedu.website.repository;

import com.google.api.core.ApiFuture;
import com.google.cloud.firestore.*;
import com.google.firebase.cloud.FirestoreClient;
import com.helaedu.website.entity.Subject;
import com.helaedu.website.entity.SubjectNote;
import org.springframework.stereotype.Repository;

import java.util.List;
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

    public String updateSubject(String subjectId, Subject subject) throws ExecutionException, InterruptedException {
        Firestore dbFirestore = FirestoreClient.getFirestore();
        DocumentReference documentReference = dbFirestore.collection("subjects").document(subjectId);
        ApiFuture<WriteResult> future = documentReference.set(subject);
        return future.get().getUpdateTime().toString();
    }

    public boolean exists(String subjectId) throws ExecutionException, InterruptedException {
        return getSubjectById(subjectId) != null;
    }
    public List<Subject> getSubjectByGrade(String grade) throws ExecutionException, InterruptedException {
        Firestore dbFirestore = FirestoreClient.getFirestore();
        CollectionReference subjectsCollection = dbFirestore.collection("subjects");
        ApiFuture<QuerySnapshot> future = subjectsCollection.whereEqualTo("grade", grade).get();
        return future.get().toObjects(Subject.class);
    }


}
