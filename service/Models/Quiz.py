from fireo.models import Model
from fireo.fields import TextField, ListField, DateTime


class Quiz(Model):

    quizId = TextField()
    quiz = ListField()
    subjectId = TextField()
    grade = TextField()
    subject = TextField()
    status = TextField()

    def reviewed(self):
        self.status = "REVIEWED"


    class Meta:
        collection_name = "quiz"
