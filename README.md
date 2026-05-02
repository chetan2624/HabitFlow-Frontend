# HabitFlow - Frontend

HabitFlow is a premium, beautifully designed habit tracking suite that goes beyond simple checkboxes. It connects your daily routines to your overall energy levels, helping you design your perfect day. This directory contains the React (Vite) frontend application.

## 🌟 Cool Features & Technical Highlights

* **Interactive Matrix Tracker**: A spreadsheet-style monthly grid. Click on empty rows to seamlessly add new habits. Right-click on any cell to open a "Daily Journal" modal and leave contextual notes about your progress!
* **Deep Analytics & Heatmaps**: Built with `recharts` and `react-calendar-heatmap`. Visualizes a 365-day GitHub-style heatmap of your consistency, alongside a dual-axis correlation graph mapping your Habit Completion rate against your Daily Energy levels.
* **Smart User Profiling**: Users can input their Age, Hobbies, Health Conditions, and Routine type. The analytics engine synthesizes this data to offer **Dynamic Insights** tailored specifically to the user.
* **Global Pomodoro Timer**: A globally accessible, floating focus timer widget available on all screens. Jump into deep work without leaving your dashboard.
* **Progressive Web App (PWA)**: Completely configured with `vite-plugin-pwa`. On mobile devices, users will be prompted to natively install the app to their home screens.
* **Global Dark Mode**: Designed beautifully with TailwindCSS. Toggle between sleek Dark and Light modes from the Settings menu.

## 🚀 Local Setup & Installation

### Prerequisites
Make sure you have [Node.js](https://nodejs.org/) installed on your machine.

### 1. Install Dependencies
Navigate into the `frontend` directory and install the required packages:
```bash
cd frontend
npm install --legacy-peer-deps
```
*(Note: `--legacy-peer-deps` is used to ensure smooth installation with the Vite PWA plugin)*

### 2. Start the Development Server
Run the Vite development server:
```bash
npm run dev
```

### 3. Open in Browser
The application will launch by default at [http://localhost:5173](http://localhost:5173). 

> **Important**: The frontend requires the backend API to function correctly. Make sure you also start the Node.js server located in the `backend/` folder!

## 🛠 Tech Stack
* **Framework:** React 18
* **Bundler:** Vite
* **Styling:** Tailwind CSS & PostCSS
* **Routing:** React Router v6
* **Icons:** Lucide React
* **Charts:** Recharts & React Calendar Heatmap
