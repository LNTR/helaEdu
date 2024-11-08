package com.helaedu.website.repository;

import com.google.api.core.ApiFuture;
import com.google.cloud.firestore.*;
import com.google.firebase.cloud.FirestoreClient;
import com.helaedu.website.entity.Article;
import com.helaedu.website.entity.Complaints;
import org.springframework.stereotype.Repository;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ExecutionException;

@Repository
public class ComplaintsRepository {
    public String addComplaint(Complaints complaints) {
        Firestore dbFirestore = FirestoreClient.getFirestore();
        DocumentReference documentReference  = dbFirestore.collection("complaints").document(complaints.getComplaintId());
        documentReference.set(complaints);
        return complaints.getComplaintId();
    }
    public Complaints getComplaintsById(String complaintId) throws ExecutionException, InterruptedException {
        Firestore dbFirestore = FirestoreClient.getFirestore();
        DocumentReference documentReference = dbFirestore.collection("complaints").document(complaintId);
        ApiFuture<DocumentSnapshot> future = documentReference.get();
        DocumentSnapshot document = future.get();
        Complaints complaints = null;
        if (document.exists()) {
            complaints= document.toObject(Complaints.class);
        }
        return complaints;
    }
    public boolean exists(String complaintId) throws ExecutionException, InterruptedException {
        return getComplaintsById(complaintId) != null;
    }
    public List<Complaints> getAllComplaints() throws ExecutionException, InterruptedException {
        Firestore dbFirestore = FirestoreClient.getFirestore();
        CollectionReference complaintsCollection = dbFirestore.collection("complaints");
        ApiFuture<QuerySnapshot> future = complaintsCollection.get();
        List<Complaints> complaints = new ArrayList<>();
        QuerySnapshot querySnapshot = future.get();
        for (DocumentSnapshot document : querySnapshot.getDocuments()) {
            Complaints complaint = document.toObject(Complaints.class);
            complaints.add(complaint);
        }
        return complaints;
    }
    public String updateComplaintStatus(String complaintId, String newStatus, String feedback, String reviewedAdminId) throws ExecutionException, InterruptedException {
        Firestore dbFirestore = FirestoreClient.getFirestore();
        DocumentReference documentReference = dbFirestore.collection("complaints").document(complaintId);

        Map<String, Object> updates = new HashMap<>();
        updates.put("status", newStatus);
        updates.put("feedback", feedback);
        updates.put("reviewedAdminId", reviewedAdminId);

        ApiFuture<WriteResult> future = documentReference.update(updates);
        return future.get().getUpdateTime().toString();
    }
    public String deleteComplaint(String complaintId) throws ExecutionException, InterruptedException {
        Firestore dbFirestore = FirestoreClient.getFirestore();
        DocumentReference documentReference = dbFirestore.collection("complaints").document(complaintId);
        ApiFuture<WriteResult> future = documentReference.delete();
        return future.get().getUpdateTime().toString();
    }


}
