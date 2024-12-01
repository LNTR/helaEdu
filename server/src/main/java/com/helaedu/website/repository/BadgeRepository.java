package com.helaedu.website.repository;

import com.google.api.core.ApiFuture;
import com.google.cloud.firestore.*;
import com.google.firebase.cloud.FirestoreClient;
import com.helaedu.website.entity.Assignment;
import com.helaedu.website.entity.Badge;
import org.springframework.stereotype.Repository;

import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.ExecutionException;

@Repository
public class BadgeRepository {
    // public String createBadge(Badge badge) {
    //     Firestore dbFirestore = FirestoreClient.getFirestore();
    //     DocumentReference documentReference = dbFirestore.collection("badges").document(badge.getBadgeId());
    //     documentReference.set(badge);
    //     return badge.getBadgeId();
    // }

    public List<Badge> getAllBadges() throws ExecutionException, InterruptedException {
        Firestore dbFirestore = FirestoreClient.getFirestore();
        CollectionReference assignmentsCollection = dbFirestore.collection("badges");
        ApiFuture<QuerySnapshot> future = assignmentsCollection.get();
        List<Badge> badges = new ArrayList<>();
        QuerySnapshot querySnapshot = future.get();
        for (DocumentSnapshot document : querySnapshot.getDocuments()) {
            Badge badge = document.toObject(Badge.class);
            badges.add(badge);
        }
        return badges;
    }

    public Badge getBadgeById(String badgeId) throws ExecutionException, InterruptedException {
        Firestore dbFirestore = FirestoreClient.getFirestore();
        DocumentReference documentReference = dbFirestore.collection("badges").document(badgeId);
        ApiFuture<DocumentSnapshot> future = documentReference.get();
        DocumentSnapshot document = future.get();
        if (document.exists()) {
            return document.toObject(Badge.class);
        }
        return null;
    }
    public boolean exists(String badgeId) throws ExecutionException, InterruptedException {
        return getBadgeById(badgeId) != null;
    }
}
