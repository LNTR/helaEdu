package com.helaedu.website.repository;

import com.google.api.core.ApiFuture;
import com.google.cloud.firestore.*;
import com.google.firebase.cloud.FirestoreClient;
import com.helaedu.website.entity.Article;
import com.helaedu.website.entity.Forum;
import org.springframework.stereotype.Repository;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ExecutionException;

@Repository
public class ForumRepository {
    public String addComment(Forum forum) {
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

    public List<Forum> getCommentsByArticleId(String articleId) throws ExecutionException, InterruptedException {
        Firestore dbFirestore = FirestoreClient.getFirestore();
        CollectionReference forumCollection = dbFirestore.collection("forum");
        Query query = forumCollection.whereEqualTo("articleId", articleId);
        ApiFuture<QuerySnapshot> future = query.get();

        List<Forum> forums = new ArrayList<>();
        QuerySnapshot querySnapshot = future.get();
        for (DocumentSnapshot document : querySnapshot.getDocuments()) {
            Forum forum = document.toObject(Forum.class);
            forums.add(forum);
        }
        return forums;
    }
    public List<Forum> getCommentsBySubjectId(String subjectId) throws ExecutionException, InterruptedException {
        Firestore dbFirestore = FirestoreClient.getFirestore();
        CollectionReference forumCollection = dbFirestore.collection("forum");
        Query query = forumCollection.whereEqualTo("subjectId", subjectId);
        ApiFuture<QuerySnapshot> future = query.get();

        List<Forum> forums = new ArrayList<>();
        QuerySnapshot querySnapshot = future.get();
        for (DocumentSnapshot document : querySnapshot.getDocuments()) {
            Forum forum = document.toObject(Forum.class);
            forums.add(forum);
        }
        return forums;
    }

    public String deleteComment(String commentId) throws ExecutionException, InterruptedException {
        Firestore dbFirestore = FirestoreClient.getFirestore();
        DocumentReference documentReference = dbFirestore.collection("forum").document(commentId);
        ApiFuture<WriteResult> future = documentReference.delete();
        return future.get().getUpdateTime().toString();
    }
    public String updateCommentAsDelete(String commentId, String newMsg) throws ExecutionException, InterruptedException {
        Firestore dbFirestore = FirestoreClient.getFirestore();
        DocumentReference documentReference = dbFirestore.collection("forum").document(commentId);

        Map<String, Object> updates = new HashMap<>();
        updates.put("comment", newMsg);

        ApiFuture<WriteResult> future = documentReference.update(updates);
        return future.get().getUpdateTime().toString();
    }
    public int getCommentCountByArticleId(String articleId) throws ExecutionException, InterruptedException {
        Firestore dbFirestore = FirestoreClient.getFirestore();
        CollectionReference forumCollection = dbFirestore.collection("forum");
        Query query = forumCollection.whereEqualTo("articleId", articleId);
        ApiFuture<QuerySnapshot> future = query.get();

        QuerySnapshot querySnapshot = future.get();
        return querySnapshot.size();
    }





}
