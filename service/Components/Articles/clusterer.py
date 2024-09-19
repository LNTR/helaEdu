from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.cluster import KMeans


def create_clusters(df, count=4):
    vectorizer = TfidfVectorizer()
    features = vectorizer.fit_transform(df["content"])
    kmeans = KMeans(n_clusters=count, random_state=42, n_init="auto")
    kmeans.fit(features)
    cluster_labels = kmeans.labels_
    df["cluster"] = cluster_labels
    for index, row in df.iterrows():
        article = row["reference"]
        article.cluster = str(row["cluster"])
        article.update()
        article.save()
