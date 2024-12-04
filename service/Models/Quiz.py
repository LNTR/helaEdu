from fireo.models import Model
from fireo.fields import TextField, ListField

class Quiz(Model):
    quiz = ListField()  # List of questions
    subjectId = TextField()
    grade = TextField()
    subject = TextField()
    status = TextField()
    moderatorEmail=TextField()
    identifier=TextField()
    topic=ListField()

    def reviewed(self):
        self.status = "REVIEWED"

    def update_question(self, quiz_id, question_id, new_question, new_answer, new_options,new_topic):
        try:
            # Fetch the quiz record by ID using the class-level collection
            quiz_record = Quiz.collection.get(quiz_id)
            if not quiz_record:
                print(f"Quiz record with ID {quiz_id} not found.")
                return False

            # Iterate through the quiz questions to find the matching question
            for question in quiz_record.quiz:
                if question.get("id") == question_id:
                    question["question"] = new_question
                    question["answer"] = new_answer
                    question["options"] = new_options
                    question["topic"]=new_topic
                    break
            else:
                print(f"Question with ID {question_id} not found in quiz {quiz_id}.")
                return False

            # Save the updated quiz record
            quiz_record.update()
            print(f"Question ID {question_id} in quiz {quiz_id} updated successfully.")
            return True

        except Exception as e:
            print(f"Error updating question: {e}")
            return False


    def get_open_quiz(subject_id):
        try:
            # Fetch the single quiz with matching subjectId and status
            subject_id = subject_id.replace("_", "-").replace("/", "_")
            quiz = Quiz.collection.filter("subjectId", "==", subject_id).filter("status", "==", "OPENED").get()
            if quiz:
                return {
                    "quiz": quiz.quiz,
                    "subjectId": quiz.subjectId,
                    "grade": quiz.grade,
                    "status": quiz.status,
                    "subject": quiz.subject,
                }
            else:
                return None 

        except Exception as e:
            print(f"Error fetching the quiz: {e}")
            return None 
    class Meta:
        collection_name = "quiz"
