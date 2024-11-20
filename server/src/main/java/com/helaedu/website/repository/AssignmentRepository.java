package com.helaedu.website.repository;

import com.google.api.core.ApiFuture;
import com.google.cloud.firestore.*;
import com.google.firebase.cloud.FirestoreClient;
import com.helaedu.website.entity.Assignment;
import org.springframework.stereotype.Repository;

import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.ExecutionException;

@Repository
public class AssignmentRepository {

    public String createAssignment(Assignment assignment) {
        Firestore dbFirestore = FirestoreClient.getFirestore();
        DocumentReference documentReference = dbFirestore.collection("assignments").document(assignment.getAssignmentId());
        documentReference.set(assignment);
        return assignment.getAssignmentId();
    }

    public List<Assignment> getAllAssignments() throws ExecutionException, InterruptedException {
        Firestore dbFirestore = FirestoreClient.getFirestore();
        CollectionReference assignmentsCollection = dbFirestore.collection("assignments");
        ApiFuture<QuerySnapshot> future = assignmentsCollection.get();
        List<Assignment> assignments = new ArrayList<>();
        QuerySnapshot querySnapshot = future.get();
        for (DocumentSnapshot document : querySnapshot.getDocuments()) {
            Assignment assignment = document.toObject(Assignment.class);
            assignments.add(assignment);
        }
        return assignments;
    }

    public Assignment getAssignmentById(String assignmentId) throws ExecutionException, InterruptedException {
        Firestore dbFirestore = FirestoreClient.getFirestore();
        DocumentReference documentReference = dbFirestore.collection("assignments").document(assignmentId);
        ApiFuture<DocumentSnapshot> future = documentReference.get();
        DocumentSnapshot document = future.get();
        if (document.exists()) {
            return document.toObject(Assignment.class);
        }
        return null;
    }

    public void updateAssignment(String assignmentId, Assignment assignment) throws ExecutionException, InterruptedException {
        Firestore dbFirestore = FirestoreClient.getFirestore();
        DocumentReference documentReference = dbFirestore.collection("assignments").document(assignmentId);
        ApiFuture<WriteResult> future = documentReference.set(assignment);
        WriteResult result = future.get();
        System.out.println("Update time: " + result.getUpdateTime());
    }

    public List<Assignment> getAssignmentsByTM(String teacherId) throws ExecutionException, InterruptedException {
        Firestore dbFirestore = FirestoreClient.getFirestore();
        CollectionReference assignmentsCollection = dbFirestore.collection("assignments");
        Query query = assignmentsCollection.whereEqualTo("userId", teacherId);
        ApiFuture<QuerySnapshot> future = query.get();
        List<Assignment> assignments = new ArrayList<>();
        QuerySnapshot querySnapshot = future.get();
        for (DocumentSnapshot document : querySnapshot.getDocuments()) {
            Assignment assignment = document.toObject(Assignment.class);
            assignments.add(assignment);
        }
        return assignments;
    }

    public String deleteAssignment(String assignmentId) throws ExecutionException, InterruptedException {
        Firestore dbFirestore = FirestoreClient.getFirestore();
        DocumentReference documentReference = dbFirestore.collection("assignments").document(assignmentId);
        ApiFuture<WriteResult> future = documentReference.delete();
        return future.get().getUpdateTime().toString();
    }

    public boolean exists(String assignmentId) throws ExecutionException, InterruptedException {
        return getAssignmentById(assignmentId) != null;
    }
}
