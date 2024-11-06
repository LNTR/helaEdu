package com.helaedu.website.repository;

import com.google.api.core.ApiFuture;
import com.google.cloud.firestore.DocumentReference;
import com.google.cloud.firestore.DocumentSnapshot;
import com.google.cloud.firestore.Firestore;
import com.google.firebase.cloud.FirestoreClient;
import com.helaedu.website.entity.Complaints;
import org.springframework.stereotype.Repository;

import java.util.concurrent.ExecutionException;

@Repository
public class ComplaintsRepository {
//    public String addComplaint(Complaints complaints) {
//        Firestore dbFirestore = FirestoreClient.getFirestore();
//        DocumentReference documentReference  = dbFirestore.collection("complaints").document(complaints.getComplaintsId());
//        documentReference.set(complaints);
//        return complaints.getComplaintsId();
//    }
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
}
