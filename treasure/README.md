# FinTrack: Personal Finance & Savings for Students

FinTrack is a comprehensive, modern web application designed specifically for students to manage their personal finances, track spending habits, and reach their savings goals. Built with a unified MERN-like stack (Vite + React + Express + SQLite), it offers a premium, responsive experience.

## ✨ Features

- **Auth System**: Secure login and sign-up with password encryption and JWT session management.
- **Onboarding**: A friendly 3-step walkthrough for new users to explain key features.
- **Dynamic Dashboard**:
  - Automatically calculates **True Remaining Liquid Cash** (Total Income - Expenses - Total Saved).
  - Clickable status cards to navigate directly to their respective pages.
  - Interactive **Pie Chart** for expense distribution.
  - **Bar Chart** for monthly financial overview.
- **Notifications System**: Real-time polling notification bell built into the navigation. Automatically alerts you on:
  - 100% Savings Goal Completion.
  - If excess funds are deposited beyond the target amount.
  - CRUD operations logic for goals and transactions.
- **Income & Expense Tracking**: Track your sources of money with robust input fields that automatically format and parse comma-separated numbers gracefully (e.g. `30,000`).
- **Savings Goals**: Set financial targets with names and amounts. Includes rapid auto-deposit multiplier buttons (`x10`, `x5`, `x3`).
- **Analytics**: Deep-dive into your financial trends with monthly growth charts and category breakdowns.
- **Mobile Responsive**: Fully optimized for use on desktops, tablets, and smartphones using grid and flex layouts.

## 🛠️ Tech Stack

- **Frontend**: Vite, React, Recharts (for data visualization), Axios, React Router.
- **Backend**: Node.js, Express.
- **Database**: MongoDB (via Mongoose) — Scalable NoSQL database for structured financial data including a `Notification` Schema.
- **Security**: Bcrypt.js for password hashing and JSON Web Tokens (JWT) for authentication. Login restricted strictly to Email/Phone and password matching.

---

## 🚀 Step-by-Step Local Deployment Workflow

Follow these exact steps to run the application on your computer:

### Step 1: Install Prerequisites
1. Download and install **Node.js**: [https://nodejs.org/](https://nodejs.org/) (Version 18+ recommended)
2. Ensure you have `git` installed to clone or download the repository.
3. You need a **MongoDB** database. You can:
   - Install it locally: [MongoDB Community Server](https://www.mongodb.com/try/download/community)
   - Or create a free cloud database: [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)

### Step 2: Open to the Project Directory
1. Open your terminal or command prompt (Windows PowerShell works great).
2. Navigate to the project directory where you downloaded it. For example:
   ```bash
   cd C:/Users/YourName/Desktop/treasure
   ```

### Step 3: Install Project Dependencies
Run the following command to install all the required packages for both the frontend (React) and the backend (Express):
```bash
npm install
```
*(Wait a few minutes for the installation to complete)*

### Step 4: Configure Environment Variables
1. In the root directory of the project (inside the `treasure` folder), create a new file named `.env`.
2. Open the `.env` file in your text editor (like VS Code or Notepad).
3. Copy and paste the following keys into the file:
   ```env
   VITE_API_URL=http://localhost:5000/api
   JWT_SECRET=super_secret_finance_key_123
   PORT=5000
   MONGO_URI=mongodb://localhost:27017/finance_app
   ```
   > **Note:** If you are using MongoDB Atlas, replace the `MONGO_URI` value with your actual connection string (e.g., `mongodb+srv://<username>:<password>@cluster0.mongodb.net/`). Make sure to replace `<username>` and `<password>` with your database details.

### Step 5: Start the Application
You don't need to open two terminals! The project is configured to run both the frontend and backend with a single command. 
Run this command in your terminal:
```bash
npm run dev
```
You should see output indicating that:
- The Server is running on port 5000 (`Server running on port 5000`)
- The Frontend is running on port 5173 (`VITE v5.x.x ready in x ms`)
- The Database has connected (`MongoDB connected successfully`)

### Step 6: View in your Browser
1. Open your web browser (Chrome, Edge, Safari, etc.).
2. Go to the dashboard URL: [http://localhost:5173](http://localhost:5173)
3. You will see the newly polished Landing Page. Click **Start for Free** to register an account and view the dashboard!

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
