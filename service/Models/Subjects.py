from fireo.models import Model
from fireo.fields import TextField


class Subjects(Model):
 
    coverImgRef  = TextField()
    language   = TextField()
    pdfRef  = TextField()
    subjectId = TextField()
    subjectName  = TextField() 

    def getSubjects(subjectList):
        subjects_details = []
        for subject in subjectList:
            subject_id = subject.replace("_", "-").replace("/", "_")
            s = Subjects.collection.get(subject_id)
            subjects_details.append(
                    {
                        "subjectId": s.subjectId,
                        "subjectName": s.subjectName,
                        "coverImgRef": s.coverImgRef,
                    }
            )
            
        return subjects_details

    class Meta:
        collection_name = "subjects"

    