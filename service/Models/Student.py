from fireo.models import Model
from fireo.fields import TextField, ListField, MapField


class Student(Model):

    email = TextField()
    firstName = TextField()
    lastName = TextField()
    noteId = TextField()
    password = TextField()
    regTimestamp = TextField()
    role = TextField()
    subscriptionId = TextField()
    userId = TextField()
    enrolledSubjects = TextField()
    subjectNoteList = MapField()

    class Meta:
        collection_name = "students"

    @classmethod
    def find_by_email(cls, email):
        try:
            return cls.collection.filter("email", "==", email).get()
        except Exception as e:
            print(f"Error fetching subject by email: {e}")
            return None
