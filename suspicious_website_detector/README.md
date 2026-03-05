# 🛡️ Suspicious Website Detector

A lightweight, hybrid security application that analyzes URLs to detect potential phishing and malicious activities using **Machine Learning** and **Advanced Heuristic Scoring**.

---

## 🔍 Code Analysis & Architecture

This project is built using the **Django** framework and implements a multi-layered detection strategy:

### 1. **Detection Engine (Hybrid Approach)**
Located in `detector_app/utils.py`, the engine combines two methods:
*   **Machine Learning (ML):** Uses a pre-trained **Logistic Regression** model (`model.pkl`) to identify patterns based on URL length, symbol count, and structural features.
*   **Heuristics Scoring:** A custom algorithm that assigns risk points for common phishing indicators:
    *   **IP Address Detection:** Identifies if a site is hosted on a raw IP instead of a domain.
    *   **Punycode Detection:** Detects homograph attacks (e.g., `googIe.com` using special characters).
    *   **Brand Impersonation:** Scans for digit-for-letter substitutions (e.g., `p0stbank` instead of `postbank`).
    *   **Symbol Analysis:** Flags excessive hyphens, `@` symbols, or lack of HTTPS.

### 2. **Project Structure**
*   `suspicious_detector/`: Core Django settings and configuration.
*   `detector_app/`: Main application logic, views, and templates.
*   `detector_app/ml/`: Contains the training script (`train_model.py`) and the exported model (`model.pkl`).
*   `db.sqlite3`: Local database for metadata storage.

---

## 🚀 How to Host Locally on Another Computer

Follow these step-by-step instructions to set up and run the application on a new machine.

### **Prerequisites**
1.  **Python 3.8+**: Ensure Python is installed. [Download here](https://www.python.org/downloads/).
2.  **Network Access**: Ensure both computers are on the same Wi-Fi/Local network if you want to access the site from a secondary device.

---

### **Step 1: Copy/Clone the Project**
Transfer the project folder (`suspicious_website_detector`) to the target computer via USB, Cloud, or Git.

### **Step 2: Create a Virtual Environment**
Open your terminal (CMD or PowerShell on Windows, Terminal on Mac/Linux) and navigate to the project root:
```bash
cd path/to/suspicious_website_detector
python -m venv env
```

### **Step 3: Activate the Virtual Environment**
*   **Windows:**
    ```bash
    .\env\Scripts\activate
    ```
*   **Mac/Linux:**
    ```bash
    source env/bin/activate
    ```

### **Step 4: Install Dependencies**
You need to install the core libraries used by the application:
```bash
pip install django joblib scikit-learn
```

### **Step 5: Navigate to the Django Root**
Move into the folder containing the `manage.py` file:
```bash
cd suspicious_detector
```

### **Step 6: (Optional) Apply Migrations**
If you want to ensure the database is fresh:
```bash
python manage.py migrate
```

### **Step 7: Start the Server**
To make the website accessible **only from the local computer**:
```bash
python manage.py runserver
```

To make it accessible **from any device in your local network**:
1.  Identify your local IP address (run `ipconfig` on Windows or `ifconfig` on Mac).
2.  Run:
    ```bash
    python manage.py runserver 0.0.0.0:8000
    ```
3.  On the other device, open a browser and go to `http://<your-pc-ip>:8000`.

---

## 🛠️ Requirements
If you want to share this project easily, create a `requirements.txt` file and paste the following:
```text
django
joblib
scikit-learn
```
Then others can simply run `pip install -r requirements.txt`.

---

## 🛡️ License
This project is for educational and security research purposes. Use it to stay safe online!
