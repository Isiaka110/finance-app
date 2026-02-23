# 🎓 Academic Peer Review System (JournalSystem)

![Django](https://img.shields.io/badge/Django-6.0-092e20?style=for-the-badge&logo=django)
![Python](https://img.shields.io/badge/Python-3.13+-3776ab?style=for-the-badge&logo=python)
![Bootstrap](https://img.shields.io/badge/Bootstrap-5.3-7952b3?style=for-the-badge&logo=bootstrap)
![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)

A comprehensive, state-of-the-art scholarly publishing management system built with Django. This platform automates the entire lifecycle of academic journals, from initial manuscript submission and double-blind peer reviews to final editorial decisions.

---

## ✨ Key Features

- **Multi-Role Dashboards:** Tailored experiences for Authors, Reviewers, and Editors.
- **Submission Management:** Secure PDF uploads for manuscripts with version tracking.
- **Double-Blind Review:** Automated reviewer assignment with 100% anonymity.
- **The "2-OK" Decision Rule:** Intelligent logic that only allows editorial approval after two positive reviews.
- **Automatic Promotion:** Authors can request promotion to Reviewer/Editor roles after 2 successful submissions.
- **Rich Analytics:** Built-in data visualization for submission trends (using integrated data tools).
- **Responsive Design:** Premium UI built with Bootstrap 5, optimized for all devices.

---

## 🚀 Step-by-Step Installation Guide

Follow these detailed steps to set up the project on your local computer.

### 1. Prerequisites
Ensure you have the following installed:
*   **Python 3.13+** ([Download here](https://www.python.org/downloads/))
*   **Git** (Optional, but recommended)

### 2. Environment Setup
Open your terminal (PowerShell, CMD, or Terminal) and run:

```bash
# 1. Clone the repository (or navigate to the project folder)
cd journal_system

# 2. Create a Virtual Environment
# This keeps your project dependencies separate from your system
python -m venv venv

# 3. Activate the Virtual Environment
# On Windows:
venv\Scripts\activate
# On Mac/Linux:
# source venv/bin/activate
```

### 3. Install Dependencies
Install all required libraries, including Django and data science packages:

```bash
pip install -r requirements.txt
```

### 4. Configure Environment Variables
Create a file named `.env` in the root directory (where `manage.py` is) and add:

```env
SECRET_KEY='your-secret-key-here'
DEBUG=True
```
*(You can use the default key found in your existing .env if already present)*

### 5. Database Initialization
Prepare the database tables and apply migrations:

```bash
# Generate migration files
python manage.py makemigrations

# Apply migrations to create the database (db.sqlite3)
python manage.py migrate
```

### 6. Create Administrative Access
Create a Superuser to access the Django Admin panel:

```bash
python manage.py createsuperuser
```
*Follow the prompts to enter a username, email, and password.*

### 7. Launch the Application
Start the development server:

```bash
python manage.py runserver
```

Once running, visit: **[http://127.0.0.1:8000/](http://127.0.0.1:8000/)**

---

## 🛡️ User Roles & Workflow

### 👤 Roles
1.  **Author (Default):** Submits manuscripts, tracks status, and revises papers.
2.  **Reviewer:** Conducts double-blind evaluations and submits scores/recommendations.
3.  **Editor:** Assigns reviewers, oversees quality, and makes the final Decision.
4.  **Admin:** Full system control via `/admin`.

### 🔄 The Submission Journey
1.  **Upload:** Author submits a PDF manuscript.
2.  **Screening:** Editor reviews the submission for basic requirements.
3.  **Peer Review:** Editor assigns **at least 2 Reviewers**.
4.  **The Decision:** Once two reviews are completed with "Accept" or "Revise" recommendations, the Editor can officially accept the paper.
5.  **Promotion:** Authors with 2+ accepted papers can request a role upgrade from their dashboard.

---

## 📂 Project Structure

```text
journal_system/
├── config/             # Core settings and URL routing
├── users/              # Authentication, Roles, and Profiles
├── submissions/        # Manuscript logic, Reviews, and Files
├── templates/          # Responsive SEO-ready HTML layouts
├── media/              # Storage for uploaded manuscripts
├── static/             # CSS, JS, and Image assets
├── requirements.txt    # Project dependencies
└── manage.py           # Django command-line utility
```

---

## 🛠️ Tech Stack

*   **Core:** Python 3.13 | Django 6.0
*   **Frontend:** Bootstrap 5 | Vanilla JavaScript | Custom CSS
*   **Database:** SQLite (Development) | Ready for PostgreSQL
*   **Static Assets:** WhiteNoise (Enterprise-grade static file management)
*   **Data Analysis:** Streamlit, Pandas, Matplotlib (Optional Analytics)

---

## 🆘 Troubleshooting

- **Database Errors?** Delete `db.sqlite3` and run `python manage.py migrate` again.
- **Styles Not Loading?** Run `python manage.py collectstatic` to consolidate files.
- **Port Already in Use?** Run `python manage.py runserver 8080` to use a different port.

---

## 🎨 Recent System Updates & UI Enhancements

The system has been "graciously" updated to provide a premium, modern experience.

### 💎 UI/UX Overhaul
-   **Design System:** Implemented a unified design system using custom CSS (`main.css`), Google Fonts (Inter), and Glassmorphism principles.
-   **Dynamic Hero:** The landing page now features a vibrant, animated gradient hero section.
-   **Responsive Dashboards:** All dashboards (Author, Reviewer, Editor) have been redesigned with clean cards, status side-strips, and interactive progress tracking.
-   **Form Styling:** Integrated Bootstrap `form-control` classes across all registration and submission forms for a consistent look.
-   **Feedback System:** Added a visual message alert system for real-time success/error notifications.

### 🛠️ Functional Fixes
-   **Promotion Logic:** Fixed a critical bug where requesting a role promotion would fail if the user's expertise was empty.
-   **Security:** Improved role-based access checks in the dashboard views.
-   **Version Tracking:** Enhanced the visual indication of manuscript versions and review completion status.

---

*Developed by Oshiokhaiyamhe / WEIRDTECHGUY*  
**Empowering Scholarly Publishing with Intelligent Automation.**
