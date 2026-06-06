# Netflix Analytics Dashboard

An interactive, responsive full-stack web dashboard that analyzes Netflix content data. Built with a Python/Flask API backend and a React/Vite/Recharts frontend.

## Features

* **KPI Summary Cards**: Real-time totals of titles, movies, TV shows, and content-producing countries.
* **Top Genres**: Visual representation of the most popular content categories on Netflix.
* **Ratings Distribution**: Interactive donut chart showing the breakdown of audience ratings (TV-MA, TV-14, R, PG-13, etc.).
* **Release Trends**: Interactive line chart showing the volume of Netflix content releases over the last 25 years.
* **Top Producing Countries**: Horizontal bar chart mapping production volume by country.

## Technologies Used

### Backend
* **Python**: Core programming language.
* **Pandas**: Data ingestion and processing.
* **Flask**: Micro web framework to build API endpoints.
* **Flask-CORS**: Cross-Origin Resource Sharing middleware.

### Frontend
* **React**: Components and state management.
* **Vite**: Super fast build tool and dev server.
* **Recharts**: Responsive D3-based React charts.
* **Axios**: HTTP client for API requests.

---

## Getting Started

### 1. Prerequisite: Clean Raw Data
Ensure your raw dataset is located at: `backend/data/raw/netflix_titles.csv`.

To clean the raw dataset and generate the processed version, run:
```bash
python backend/scripts/data_cleaning.py
```
This produces `backend/data/processed/cleaned_netflix.csv` with cleaned missing values, formatted dates, and removed duplicates.

---

### 2. Start the Backend API
Install Python dependencies:
```bash
pip install -r requirements.txt
```

Launch the Flask server:
```bash
python backend/app.py
```
The backend API server will run at: `http://127.0.0.1:5000/api`.

---

### 3. Start the Frontend Dashboard
Navigate to the frontend folder:
```bash
cd frontend
```

Install npm packages:
```bash
npm install
```

Start the Vite React development server:
```bash
npm run dev
```
Open your browser and navigate to: `http://localhost:5173/`.
