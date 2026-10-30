# Project Run Guide

This project has two parts:

1. Frontend (React + Vite)
2. Backend (Node.js + Express + MySQL)

## 1) Install dependencies

Open a terminal in the project root:

```powershell
cd "c:/Users/viresh saradar/OneDrive/Desktop/mainproject (2)/mainproject"
npm install
```

Then open another terminal for the backend:

```powershell
cd "c:/Users/viresh saradar/OneDrive/Desktop/mainproject (2)/mainproject/backend"
npm install
```

## 2) Start the backend

From the backend folder:

```powershell
cd "c:/Users/viresh saradar/OneDrive/Desktop/mainproject (2)/mainproject/backend"
node server.js
```

You should see output like:

```text
Database initialized successfully!
Server running on port 5000
```

## 3) Start the frontend

From the main project folder:

```powershell
cd "c:/Users/viresh saradar/OneDrive/Desktop/mainproject (2)/mainproject"
npm run dev -- --host 0.0.0.0
```

Then open the app in a browser:

```text
http://localhost:5173
```

## 4) Backend and database config

The backend uses MySQL settings from:

```text
backend/.env
```

Current values:

```env
DB_HOST=127.0.0.1
DB_USER=root
DB_PASSWORD=Hero@8088
DB_NAME=smartplace_prod
```

## 5) Important notes

- Frontend runs on port 5173
- Backend runs on port 5000
- MySQL must be running locally for the backend to initialize successfully
- If you see a database connection issue, check that MySQL is installed and running

## 6) Quick run summary

```powershell
cd "c:/Users/viresh saradar/OneDrive/Desktop/mainproject (2)/mainproject"
npm install
npm run dev -- --host 0.0.0.0
```

```powershell
cd "c:/Users/viresh saradar/OneDrive/Desktop/mainproject (2)/mainproject/backend"
npm install
node server.js
```

## 7) Troubleshooting

### Frontend not opening
- Make sure Vite started without errors
- Check if port 5173 is busy
- Re-run:

```powershell
npm run dev -- --host 0.0.0.0
```

### Backend not starting
- Make sure MySQL is running
- Check the database credentials in [backend/.env](../backend/.env)
- Check if the app can connect to the database

This file documents the exact procedure used to run the project successfully.
