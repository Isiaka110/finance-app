# FinTrack: Personal Finance & Savings for Students

FinTrack is a comprehensive, modern web application designed specifically for students to manage their personal finances, track spending habits, and reach their savings goals. Built with a unified MERN-like stack (Vite + React + Express + SQLite), it offers a premium, responsive experience.

## ✨ Features

- **Auth System**: Secure login and sign-up with password encryption and JWT session management.
- **Onboarding**: A friendly 3-step walkthrough for new users to explain key features.
- **Dynamic Dashboard**:
  - Real-time summary of Total Income, Total Expenses, and Current Balance.
  - Interactive **Pie Chart** for expense distribution.
  - **Bar Chart** for monthly financial overview.
  - Quick-view list of recent transactions.
- **Income Management**: Track your sources of money (allowances, jobs, scholarships) with easy editing and history logs.
- **Expense Tracking**: Categorize spending (Food, Transport, Books, etc.) to see exactly where your money goes.
- **Savings Goals**: Set financial targets with names and amounts. Track your progress with animated bars and celebrate when goals are reached!
- **Analytics**: Deep-dive into your financial trends with monthly growth charts and category breakdowns.
- **Mobile Responsive**: Fully optimized for use on desktops, tablets, and smartphones.

## 🛠️ Tech Stack

- **Frontend**: Vite, React, Recharts (for data visualization), Axios, React Router.
- **Backend**: Node.js, Express.
- **Database**: MongoDB (via Mongoose) — Scalable NoSQL database for structured financial data.
- **Security**: Bcrypt.js for password hashing and JSON Web Tokens (JWT) for authentication.

---

## 🚀 Getting Started (Local)

### 1. Prerequisites
- [Node.js](https://nodejs.org/) (Version 18 or later recommended)
- `npm` (comes with Node.js)
- [MongoDB](https://www.mongodb.com/try/download/community) installed locally OR a [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) account.

### 2. Installation
1.  **Clone or Download** the project to your local machine.
2.  Open your terminal and navigate to the root directory:
    ```bash
    cd treasure
    ```
3.  Install all dependencies:
    ```bash
    npm install
    ```

### 3. Environment Variables
Create a file named `.env` in the root directory and add the following:
```env
VITE_API_URL=http://localhost:5000/api
JWT_SECRET=your_secret_key_here
PORT=5000
MONGO_URI=mongodb://localhost:27017/finance_app
```

### 4. Running the App
Run both the frontend and the backend simultaneously with one command:
```bash
npm run dev
```
- **Frontend URL**: `http://localhost:5173`
- **Backend API**: `http://localhost:5000/api`

---

## 🌩️ Deployment

### 1. Push to GitHub
If you haven't already, link your local code to your GitHub repository:

```bash
# Initialize git if needed
git init

# Link to your repository
git remote add origin https://github.com/Isiaka110/finance-app.git
# If origin already exists, use: git remote set-url origin https://github.com/Isiaka110/finance-app.git

# Stage and commit
git add .
git commit -m "feat: migrate to mongodb and prepare for vercel"

# Push to your repository
git push -u origin main
```

### 2. Link to Vercel
1.  Go to [Vercel](https://vercel.com/) and click **"New Project"**.
2.  Import your GitHub repository (`Isiaka110/finance-app`).
3.  **Configure Environment Variables**:
    - `VITE_API_URL`: Use your Vercel production URL (e.g., `https://your-app.vercel.app/api`)
    - `JWT_SECRET`: A secure random string.
    - `MONGO_URI`: Your **MongoDB Atlas** connection string (ensure you've whitelisted `0.0.0.0/0` in Atlas Network Access for Vercel compatibility).
4.  **Build Settings**: The default settings (Vite) should work, but ensure the "Output Directory" is set to `dist`.
5.  Click **Deploy**.

---

## 📂 Project Structure

```text
treasure/
├── server/            # Backend Express server
│   ├── models/        # Mongoose Models (User, Transaction, Goal)
│   ├── controllers/   # Route handlers
│   ├── routes/        # API endpoints
│   ├── db.js          # MongoDB connection setup
│   └── index.js       # Entry point
├── src/               # Frontend React app
│   ├── api/           # Axios instance
│   ├── components/    # Reusable UI
│   ├── pages/         # Screen components
│   └── index.css      # Custom design system
├── vercel.json        # Vercel routing configuration
└── package.json       # Dependencies & Scripts
```

## ⚖️ License
This project is open-source and available for educational use.
