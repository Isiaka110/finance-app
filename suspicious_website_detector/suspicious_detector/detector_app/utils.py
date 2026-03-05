import joblib
import os
import re
from urllib.parse import urlparse

# ==============================
# Load ML Model
# ==============================
MODEL_PATH = os.path.join(
    os.path.dirname(__file__),
    "ml/model.pkl"
)

model = joblib.load(MODEL_PATH)


# ==============================
# URL Normalization
# ==============================
def normalize_url(url):
    """
    Ensures URL has a scheme so urlparse works properly.
    """
    if not url.startswith(("http://", "https://")):
        url = "http://" + url
    return url


# ==============================
# Feature Extraction (For ML)
# ==============================
def extract_features(url):
    url = normalize_url(url)
    parsed = urlparse(url)

    return [
        len(url),
        url.count('.'),
        url.count('-'),
        url.count('@'),
        1 if url.startswith("https") else 0
    ]


# ==============================
# Advanced Heuristic Scoring
# ==============================
def heuristic_score(url):
    score = 0
    reasons = []

    url = normalize_url(url)
    parsed = urlparse(url)
    domain = parsed.netloc.lower()

    # Remove www
    if domain.startswith("www."):
        domain = domain[4:]

    # 1️⃣ @ Symbol
    if "@" in url:
        score += 2
        reasons.append("URL contains '@' symbol (possible redirection attack).")

    # 2️⃣ Excessive Hyphens
    if url.count("-") > 2:
        score += 1
        reasons.append("Excessive hyphens detected in URL.")

    # 3️⃣ No HTTPS
    if not url.startswith("https"):
        score += 1
        reasons.append("Website does not use HTTPS.")

    # 4️⃣ Very Long URL
    if len(url) > 75:
        score += 2
        reasons.append("URL length unusually long (possible obfuscation).")

    # 5️⃣ IP Address Used
    if re.fullmatch(r"\d{1,3}(\.\d{1,3}){3}", domain):
        score += 4
        reasons.append("IP address used instead of domain name.")

    # 6️⃣ Too Many Subdomains
    if domain.count('.') > 3:
        score += 1
        reasons.append("Excessive subdomains detected.")

    # 7️⃣ Punycode
    if "xn--" in domain:
        score += 4
        reasons.append("Punycode domain detected (possible homograph attack).")

    # 8️⃣ Strong Digit-Letter Substitution Detection
    common_substitutions = {
        '0': 'o',
        '1': 'l',
        '3': 'e',
        '5': 's',
        '7': 't'
    }

    substitution_detected = False

    for digit in common_substitutions.keys():
        if digit in domain:
            substitution_detected = True
            break

    if substitution_detected:
        score += 5
        reasons.append("Critical: Possible brand impersonation via digit substitution.")

    # 9️⃣ Mixed Letters + Numbers Pattern
    if re.search(r'[a-z]+[0-9]+[a-z]+', domain):
        score += 3
        reasons.append("Domain mixes letters and numbers (typosquatting indicator).")

    return score, reasons


# ==============================
# ML Prediction
# ==============================
def ml_predict(features):
    prediction = model.predict([features])[0]
    return "suspicious" if prediction == 1 else "safe"


# ==============================
# Hybrid Detection Logic
# ==============================
def hybrid_detect(url, threshold=4):
    """
    Hybrid decision:
    - ML has priority
    - Strong heuristic signals override
    """

    features = extract_features(url)
    ml_result = ml_predict(features)
    score, heuristic_reasons = heuristic_score(url)

    # Immediate suspicious override if strong typosquatting detected
    strong_indicator = any(
        "digit substitution" in r.lower()
        or "punycode" in r.lower()
        or "ip address" in r.lower()
        for r in heuristic_reasons
    )

    if ml_result == "suspicious":
        final_result = "Suspicious"
        reason = "Machine Learning model detected suspicious patterns."

    elif strong_indicator:
        final_result = "Suspicious"
        reason = "Critical phishing indicator detected."

    elif score >= threshold:
        final_result = "Suspicious"
        reason = "Heuristic risk score exceeded security threshold."

    else:
        final_result = "Safe"
        reason = "No significant malicious indicators detected."

    return {
        "final_result": final_result,
        "ml_result": ml_result,
        "score": score,
        "reason": reason,
        "reasons": heuristic_reasons
    }
