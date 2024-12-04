from fireo.models import Model
from fireo.fields import TextField, ListField


class ChatHistory(Model):

    messages = ListField()
    userId = TextField()

    class Meta:
        collection_name = "ChatHistory"
