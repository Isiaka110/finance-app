import re
import joblib
from sklearn.linear_model import LogisticRegression


def extract_features(url):
    return [
        len(url),
        url.count('.'),
        1 if "@" in url else 0,
        1 if re.search(r'\d+\.\d+\.\d+\.\d+', url) else 0,
        1 if "https" in url else 0
    ]


# Training dataset (extend later)
dataset = [
    ("https://google.com", 0),
    ("https://github.com", 0),
    ("http://192.168.1.1/login", 1),
    ("http://bank.com@phish.com", 1),
    ("http://verylongsuspiciousurlssssssssssssssss.com", 1),
]

X = [extract_features(url) for url, label in dataset]
y = [label for url, label in dataset]

model = LogisticRegression()
model.fit(X, y)

joblib.dump(model, "model.pkl")

print("Model trained successfully.")
