from fireo.models import Model
from fireo.fields import TextField, ListField, DateTime
from bs4 import BeautifulSoup
from Components.Articles.classifier import classify


class Article(Model):

    articleId = TextField()
    title = TextField()

    additionalFilesRefs = ListField()

    status = TextField()
    content = TextField()
    cluster = TextField()
    imageRef = TextField()
    tags = ListField()
    publishedTimestamp = DateTime()
    lastUpdatedTimestamp = DateTime()
    reviewedModeratorId = TextField()
    rejectedReason = TextField()
    userId = TextField()
    upvote = ListField()

    def approve(self):
        self.status = "APPROVED"

    def classify_article(self):
        soup = BeautifulSoup(self.content, "lxml")
        content = soup.get_text()
        classify(content)

    class Meta:
        collection_name = "articles"
