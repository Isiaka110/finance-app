
# 🎓 Academic Peer Review System (JournalSystem)

A full-stack Django application designed to automate the lifecycle of scholarly publishing. This system manages everything from the initial manuscript submission to the double-blind peer review process and final editorial decisions.

---

## 🚀 How to Run the Project 

Follow these steps exactly to get the system running on your local machine.

### 1. Prerequisites

Make sure you have **Python 3.13+** installed. You can check by typing `python --version` in your terminal.

### 2. Clone and Setup

Open your terminal (Command Prompt, PowerShell, or Bash) and navigate to the folder where you want the project.

```bash
# 1. Navigate to the project folder
cd journal_system

# 2. Create a Virtual Environment (keeps your computer clean)
python -m venv venv

# 3. Activate the Virtual Environment
# On Windows:
venv\Scripts\activate
# On Mac/Linux:
source venv/bin/activate

```

### 3. Install Requirements

```bash
pip install django

```

### 4. Database Setup (Migrations)

Django needs to create the database tables for Users, Manuscripts, and Reviews.

```bash
python manage.py makemigrations
python manage.py migrate

```

### 5. Create an Admin Account (Superuser)

You need this to access the **Superadmin Page** (`/admin`).

```bash
python manage.py createsuperuser
# Follow the prompts to set a username and password

```

### 6. Start the Server

```bash
python manage.py runserver

```

Now, open your browser and go to: **`http://127.0.0.1:8000/`**

---

## 🔄 System Workflow & Logic

Understanding how a manuscript moves through the system is key.

### 🛡️ User Roles

1. **Author (Default):** Can submit manuscripts and request promotion after 2 submissions.
2. **Reviewer:** Assigned by Editors to read and score manuscripts.
3. **Editor:** Oversees the whole process and makes the final "Accept/Reject" decision.
4. **Superadmin:** Technical manager with access to the raw database.

### 📝 The Submission Lifecycle

1. **Submission:** Author uploads a PDF and sets their expertise keywords.
2. **Assignment:** The Editor assigns **2 Reviewers** to the paper.
3. **The "2 OK" Rule:** To maintain integrity, the **Accept** button only becomes available for the Editor once **two** positive reviews (Accept or Revise) are submitted.
4. **Promotion:** Once an Author has 2 successful submissions, they can click "Request Promotion" on their dashboard to become a Reviewer/Editor.

---

## 🛠️ Tech Stack

* **Backend:** Django 6.0 (Python)
* **Frontend:** Bootstrap 5 (CSS/JS)
* **Icons:** Bootstrap Icons (CDN)
* **Database:** SQLite3 (Default development DB)

---

## 📁 Project Structure

* `/config`: Main project settings and root URLs.
* `/users`: Handles login, registration, profiles, and role management.
* `/submissions`: Handles the PDF uploads, reviewer logic, and editorial decisions.
* `/templates`: All the HTML files for the landing page, dashboards, and forms.
* `/media`: Where uploaded manuscript PDFs are stored.

---

## 🆘 Troubleshooting

* **White Screen on Landing Page?** Ensure you are **logged out**. The system automatically redirects logged-in users to their dashboard.
* **NoReverseMatch Error?** Double-check that you have named your URL patterns correctly in `urls.py` (e.g., `name='profile'`).
* **CSS Not Loading?** Ensure you have an internet connection for the Bootstrap CDN or run `python manage.py collectstatic`.

---

*Developed by Oshiokhaiyamhe / WEIRDTECHGUY*

---