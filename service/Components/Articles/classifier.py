from sklearn.model_selection import train_test_split
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.naive_bayes import MultinomialNB

import pickle

classifier = None
vectorizer = None


def create_classifier(df):
    global classifier, vectorizer

    vectorizer = TfidfVectorizer(stop_words="english")
    X = vectorizer.fit_transform(df["content"])
    y = df["cluster"]

    x_train, x_test, y_train, y_test = train_test_split(
        X, y, test_size=0.1, random_state=42
    )

    classifier = MultinomialNB()
    classifier.fit(x_train, y_train)

    store_model(classifier, vectorizer)


def classify(content: str):
    global classifier, vectorizer

    if classifier is None or vectorizer is None:
        model = load_model()
        classifier = model.get("classifier")
        vectorizer = model.get("vectorizer")

    if classifier is None or vectorizer is None:
        raise ValueError("Model or vectorizer not loaded correctly.")

    content_transformed = vectorizer.transform([content])

    prediction = classifier.predict(content_transformed)

    return prediction[0]


def store_model(classifier, vectorizer, path="Components/Articles/data/data.pkl"):
    data = {"classifier": classifier, "vectorizer": vectorizer}
    try:
        with open(path, "wb") as data_file:
            pickle.dump(data, data_file, protocol=pickle.HIGHEST_PROTOCOL)
    except Exception as e:
        print(f"Error saving model: {e}")


def load_model(path="Components/Articles/data/data.pkl"):
    try:
        with open(path, "rb") as data_file:
            data = pickle.load(data_file)
            return data
    except FileNotFoundError:
        print("Model file not found.")
        return {"classifier": None, "vectorizer": None}
    except Exception as e:
        print(f"Error loading model: {e}")
        return {"classifier": None, "vectorizer": None}
