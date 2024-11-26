
package com.helaedu.website.repository;

import com.google.api.core.ApiFuture;
import com.google.cloud.firestore.*;
import com.google.firebase.cloud.FirestoreClient;
import com.helaedu.website.entity.Article;
import org.springframework.stereotype.Repository;

import java.util.*;
import java.util.concurrent.ExecutionException;

@Repository
public class ArticleRepository {

    public String createArticle(Article article) {
        Firestore dbFirestore = FirestoreClient.getFirestore();
        DocumentReference documentReference  = dbFirestore.collection("articles").document(article.getArticleId());
        documentReference.set(article);
        return article.getArticleId();
    }

    public List<Article> getAllArticles() throws ExecutionException, InterruptedException {
        Firestore dbFirestore = FirestoreClient.getFirestore();
        CollectionReference articlesCollection = dbFirestore.collection("articles");
        ApiFuture<QuerySnapshot> future = articlesCollection.get();
        List<Article> articles = new ArrayList<>();
        QuerySnapshot querySnapshot = future.get();
        for (DocumentSnapshot document : querySnapshot.getDocuments()) {
            Article article = document.toObject(Article.class);
            articles.add(article);
        }
        return articles;
    }

    public Article getArticleById(String articleId) throws ExecutionException, InterruptedException {
        Firestore dbFirestore = FirestoreClient.getFirestore();
        DocumentReference documentReference = dbFirestore.collection("articles").document(articleId);
        ApiFuture<DocumentSnapshot> future = documentReference.get();
        DocumentSnapshot document = future.get();
        Article article = null;
        if (document.exists()) {
            article = document.toObject(Article.class);
        }
        return article;
    }

    public List<Article> getArticlesByUserId(String teacherId) throws ExecutionException, InterruptedException {
        Firestore dbFirestore = FirestoreClient.getFirestore();
        CollectionReference articlesCollection = dbFirestore.collection("articles");
        Query query = articlesCollection.whereEqualTo("userId", teacherId);
        ApiFuture<QuerySnapshot> future = query.get();

        List<Article> articles = new ArrayList<>();
        QuerySnapshot querySnapshot = future.get();
        for (DocumentSnapshot document : querySnapshot.getDocuments()) {
            Article article = document.toObject(Article.class);
            articles.add(article);
        }
        return articles;
    }


//    get list of teachers who add more than 10 articles
//    public int countArticlesByTeacherId(String teacherId) throws ExecutionException, InterruptedException {
//        Firestore dbFirestore = FirestoreClient.getFirestore();
//        CollectionReference articlesCollection = dbFirestore.collection("articles");
//        Query query = articlesCollection.whereEqualTo("teacherId", teacherId);
//        ApiFuture<QuerySnapshot> future = query.get();
//        return future.get().size();
//    }

    //check
//    public List<String> getTeachersWithArticleCountGreaterThan(int count) throws ExecutionException, InterruptedException {
//        Firestore dbFirestore = FirestoreClient.getFirestore();
//        CollectionReference articlesCollection = dbFirestore.collection("articles");
//        ApiFuture<QuerySnapshot> future = articlesCollection.get();
//        List<QueryDocumentSnapshot> documents = future.get().getDocuments();
//
//        Map<String, Integer> teacherArticleCounts = new HashMap<>();
//        for (DocumentSnapshot document : documents) {
//            String teacherId = document.getString("teacherId");
//            teacherArticleCounts.put(teacherId, teacherArticleCounts.getOrDefault(teacherId, 0) + 1);
//        }
//
//        List<String> qualifiedTeachers = new ArrayList<>();
//        for (Map.Entry<String, Integer> entry : teacherArticleCounts.entrySet()) {
//            if (entry.getValue() >= count) {
//                qualifiedTeachers.add(entry.getKey());
//            }
//        }
//        return qualifiedTeachers;
//    }

    public String deleteArticle(String articleId) throws ExecutionException, InterruptedException {
        Firestore dbFirestore = FirestoreClient.getFirestore();
        DocumentReference documentReference = dbFirestore.collection("articles").document(articleId);
        ApiFuture<WriteResult> future = documentReference.delete();
        return future.get().getUpdateTime().toString();
    }

    public String updateArticle(String articleId, Article article) throws ExecutionException, InterruptedException {
        Firestore dbFirestore = FirestoreClient.getFirestore();
        DocumentReference documentReference = dbFirestore.collection("articles").document(articleId);
        ApiFuture<WriteResult> future = documentReference.set(article);
        return future.get().getUpdateTime().toString();
    }

    public List<Article> getArticlesByStatus(String status) throws ExecutionException, InterruptedException {
        Firestore dbFirestore = FirestoreClient.getFirestore();
        CollectionReference articlesCollection = dbFirestore.collection("articles");
        Query query = articlesCollection.whereEqualTo("status", status.toUpperCase());
        ApiFuture<QuerySnapshot> future = query.get();
        List<Article> articles = new ArrayList<>();
        QuerySnapshot querySnapshot = future.get();
        for (DocumentSnapshot document : querySnapshot.getDocuments()) {
            Article article = document.toObject(Article.class);
            articles.add(article);
        }
        return articles;
    }

    public String updateArticleStatus(String articleId, String newStatus, String reviewedModeratorEmail) throws ExecutionException, InterruptedException {
        Firestore dbFirestore = FirestoreClient.getFirestore();
        DocumentReference documentReference = dbFirestore.collection("articles").document(articleId);

        Map<String, Object> updates = new HashMap<>();
        updates.put("status", newStatus);
        updates.put("reviewedModeratorId", reviewedModeratorEmail);

        ApiFuture<WriteResult> future = documentReference.update(updates);
        return future.get().getUpdateTime().toString();
    }

    public String updateArticleStatus(String articleId, String newStatus, String rejectedReason, String reviewedModeratorId) throws ExecutionException, InterruptedException {
        Firestore dbFirestore = FirestoreClient.getFirestore();
        DocumentReference documentReference = dbFirestore.collection("articles").document(articleId);

        Map<String, Object> updates = new HashMap<>();
        updates.put("status", newStatus);
        updates.put("rejectedReason", rejectedReason);
        updates.put("reviewedModeratorId", reviewedModeratorId);

        ApiFuture<WriteResult> future = documentReference.update(updates);
        return future.get().getUpdateTime().toString();
    }
    public int getUpvoteCountByArticleId(String articleId) throws ExecutionException, InterruptedException {
        Firestore dbFirestore = FirestoreClient.getFirestore();
        CollectionReference articlesCollection = dbFirestore.collection("articles");

        Query query = articlesCollection.whereEqualTo("articleId", articleId);
        ApiFuture<QuerySnapshot> future = query.get();

        QuerySnapshot querySnapshot = future.get();
        if (!querySnapshot.isEmpty()) {
            DocumentSnapshot document = querySnapshot.getDocuments().get(0);

            List<String> upvoteList = (List<String>) document.get("upvote");
            return upvoteList != null ? upvoteList.size() : 0;
        }

        return 0;
    }



    public boolean exists(String articleId) throws ExecutionException, InterruptedException {
        return getArticleById(articleId) != null;
    }
}
