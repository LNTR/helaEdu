from fireo.models import Model
from fireo.fields import TextField, ListField, DateTime


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

    class Meta:
        collection_name = "articles"
