from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.cluster import KMeans
from sklearn.metrics import silhouette_score, pairwise_distances


def create_clusters(df, max_clusters=10):
    vectorizer = TfidfVectorizer()
    features = vectorizer.fit_transform(df["content"])

    # Step 2: Determine the optimal number of clusters using the Elbow Method or Silhouette Score
    best_k = None
    best_score = float("-inf")

    for k in range(2, max_clusters + 1):  # Try from 2 to max_clusters
        kmeans = KMeans(n_clusters=k, random_state=42, n_init="auto")

        # Perform clustering
        kmeans.fit(features)

        # Calculate silhouette score to evaluate clustering quality
        score = silhouette_score(features, kmeans.labels_)

        if score > best_score:
            best_score = score
            best_k = k

    # Step 3: Perform final clustering with the optimal number of clusters
    kmeans = KMeans(n_clusters=best_k, random_state=42, n_init="auto")
    kmeans.fit(features)

    # Step 4: Assign clusters to the DataFrame and update references
    cluster_labels = kmeans.labels_
    df["cluster"] = cluster_labels

    # On-the-fly distance calculation for each article to its centroid
    centroids = kmeans.cluster_centers_
    for index, row in df.iterrows():
        # Compute distances dynamically between article and cluster centroids
        article_vector = features[index]
        distances = pairwise_distances(
            article_vector, centroids, metric="cosine"
        )  # On-the-fly distance calculation

        # Save cluster and other data (replace `update` logic as needed for your application)
        article = row["reference"]
        article.cluster = str(row["cluster"])
        article.distance_to_centroid = distances.min()  # Closest centroid's distance
        article.update()
        article.save()

    return best_k  # Return the optimal number of clusters for reference
