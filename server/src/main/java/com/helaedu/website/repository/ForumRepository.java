package com.helaedu.website.repository;

import com.google.api.core.ApiFuture;
import com.google.cloud.firestore.DocumentReference;
import com.google.cloud.firestore.DocumentSnapshot;
import com.google.cloud.firestore.Firestore;
import com.google.firebase.cloud.FirestoreClient;
import com.helaedu.website.entity.Article;
import com.helaedu.website.entity.Forum;
import org.springframework.stereotype.Repository;

import java.util.concurrent.ExecutionException;

@Repository
public class ForumRepositary {
    public String createComment(Forum forum) {
        Firestore dbFirestore = FirestoreClient.getFirestore();
        DocumentReference documentReference  = dbFirestore.collection("forum").document(forum.getCommentId());
        documentReference.set(forum);
        return forum.getCommentId();
    }

    public boolean exists(String commentId) throws ExecutionException, InterruptedException {
        return getCommentById(commentId) != null;
    }


    public Forum getCommentById(String commentId) throws ExecutionException, InterruptedException {
        Firestore dbFirestore = FirestoreClient.getFirestore();
        DocumentReference documentReference = dbFirestore.collection("forum").document(commentId);
        ApiFuture<DocumentSnapshot> future = documentReference.get();
        DocumentSnapshot document = future.get();
        Forum forum = null;
        if (document.exists()) {
            forum= document.toObject(Forum.class);
        }
        return forum;
    }

}
