import pandas as pd
from bs4 import BeautifulSoup
from Models.Articles import Article
from Components.Articles.clusterer import create_clusters
from Components.Articles.classifier import create_classifier


def create_df():
    df = pd.DataFrame(columns=["articleId", "content", "reference"])
    articles = Article.collection.fetch()
    index = 0
    for article in articles:
        soup = BeautifulSoup(article.content, "lxml")
        df.loc[index] = {
            "articleId": article.articleId,
            "content": soup.get_text(),
            "reference": article,
        }
        index += 1
    return df


def recreate_model():
    df = create_df()
    create_clusters(df)
    create_classifier(df)


def _get_related_articles(cluster):
    articles_req = Article.collection.filter(cluster=cluster)
    candidate_articles_req = articles_req.limit(4)
    candidate_articles = candidate_articles_req.fetch()
    data = []
    for article in candidate_articles:
        data.append(
            {
                "articleId": article.articleId,
                "title": article.title,
                "imageRef": article.imageRef,
                "publishedpublishedTimestamp": article.publishedTimestamp,
            }
        )
    return data
