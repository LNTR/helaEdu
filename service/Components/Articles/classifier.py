from sklearn.model_selection import train_test_split
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.naive_bayes import MultinomialNB

import pickle

classifier = None
vectorizer = None


def create_classifier(df):
    global classifier, vectorizer
    tfidf = TfidfVectorizer(stop_words="english")
    vectorizer = tfidf.fit_transform(df["content"])
    y = df["cluster"]
    x_train, x_test, y_train, y_test = train_test_split(
        vectorizer, y, test_size=0.1, random_state=42
    )
    classifier = MultinomialNB()
    classifier.fit(x_train, y_train)
    store_model(classifier, vectorizer)


def classify(content):
    global classifier, vectorizer
    if not (classifier and vectorizer):
        classifier, vectorizer = load_model().values()

    new_text_vectorized = vectorizer.transform(content)
    preddiction = classifier.predict(new_text_vectorized)
    return preddiction[0]


def store_model(classifier, vectorizer):
    with open("Components/Articles/data/data.pkl", "wb") as data_file:
        pickle.dump({"classifier": classifier, "vectorizer": vectorizer}, data_file)


def load_model():
    with open("Components/Articles/data/data.pkl", "rb") as data_file:
        data = pickle.load(data_file)
        return data
