from sklearn.model_selection import train_test_split
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.naive_bayes import MultinomialNB

import pickle


def create_classifier(df):
    tfidf = TfidfVectorizer(stop_words="english")
    x = tfidf.fit_transform(df["content"])
    y = df["cluster"]
    x_train, x_test, y_train, y_test = train_test_split(
        x, y, test_size=0.1, random_state=42
    )
    classifier = MultinomialNB()
    classifier.fit(x_train, y_train)
    store_model(classifier)


def classify():
    pass


def store_model(classifier):
    with open("Components/Articles/data/data.pkl", "wb") as data_file:
        pickle.dump(classifier, data_file)


def load_model():
    with open("Components/Articles/data/data.pkl", "rb") as data_file:
        classifier = pickle.load(data_file)
        return classifier
