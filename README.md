# 🖥️ Advanced Disk Scheduling Simulator

A full-stack web application that **visualizes disk scheduling algorithms** (FCFS, SSTF, SCAN, C-SCAN) with interactive graphs and real-time performance metrics.

**Tech Stack:** React + Tailwind CSS (Frontend) · Node.js + Express (Backend)

---

## 📁 Folder Structure

```
disk-scheduling-simulator/
├── backend/                          # Node.js + Express API
│   ├── algorithms/
│   │   ├── fcfs.js                   # First Come First Served
│   │   ├── sstf.js                   # Shortest Seek Time First
│   │   ├── scan.js                   # Elevator Algorithm
│   │   └── cscan.js                  # Circular SCAN
│   ├── controllers/
│   │   └── schedulingController.js   # API logic (simulate + compare)
│   ├── routes/
│   │   └── scheduling.js            # Express routes
│   ├── utils/
│   │   └── metrics.js               # Performance metrics calculator
│   ├── server.js                     # Express entry point
│   └── package.json
│
├── frontend/                         # React + Tailwind CSS UI
│   ├── src/
│   │   ├── components/
│   │   │   ├── Header.jsx            # App header with gradient text
│   │   │   ├── InputPanel.jsx        # User configuration panel
│   │   │   ├── DiskChart.jsx         # Line chart (Recharts)
│   │   │   ├── MetricsCard.jsx       # Single metric display
│   │   │   └── ResultsPanel.jsx      # Results + comparison table
│   │   ├── services/
│   │   │   └── api.js                # API calls to backend
│   │   ├── App.jsx                   # Main app component
│   │   ├── main.jsx                  # React entry point
│   │   ├── index.css                 # Tailwind + custom styles
│   │   └── index.css                 # Tailwind + custom styles
│   ├── index.html
│   ├── vite.config.js                # Vite config with API proxy
│   ├── tailwind.config.js
│   ├── postcss.config.js
│   └── package.json
│
└── README.md                         # This file
```

---

## 🚀 How to Run (Step-by-Step)

### Prerequisites

Make sure you have **Node.js** installed (version 16 or higher).  
Check by running:

```bash
node --version
npm --version
```

If not installed, download from: https://nodejs.org

---

### Step 1: Open TWO Terminals

You need two terminal windows — one for the backend, one for the frontend.

---

### Step 2: Start the Backend

In **Terminal 1**, run these commands one by one:

```bash
cd disk-scheduling-simulator/backend
npm install
npm start
```

You should see:
```
🖥️  Server running at http://localhost:5000
```

✅ **Backend is running!** Keep this terminal open.

---

### Step 3: Start the Frontend

In **Terminal 2**, run these commands one by one:

```bash
cd disk-scheduling-simulator/frontend
npm install
npm run dev
```

You should see:
```
  VITE v5.x.x  ready in xxx ms

  ➜  Local:   http://localhost:5173/
```

✅ **Frontend is running!** Keep this terminal open.

---

### Step 4: Open in Browser

Open your browser and go to:

```
http://localhost:5173
```

🎉 **That's it! The app is running.**

---

## 🔗 How Frontend Connects to Backend

The connection is handled by the **Vite proxy** (configured in `vite.config.js`):

- Frontend runs on `http://localhost:5173`
- Backend runs on `http://localhost:5000`
- When the frontend makes a call to `/api/simulate`, Vite automatically **forwards** it to `http://localhost:5000/api/simulate`
- This avoids CORS issues during development

```
Browser → localhost:5173/api/simulate → (Vite Proxy) → localhost:5000/api/simulate
```

---

## 📡 API Endpoints

### `POST /api/simulate` — Run a single algorithm

**Request Body:**
```json
{
  "requests": [98, 183, 37, 122, 14, 124, 65, 67],
  "head": 53,
  "algorithm": "fcfs",
  "direction": "right",
  "maxTrack": 199
}
```

### `POST /api/compare` — Compare all four algorithms

**Request Body:**
```json
{
  "requests": [98, 183, 37, 122, 14, 124, 65, 67],
  "head": 53,
  "maxTrack": 199
}
```

---

## 🧠 Algorithms Explained

| Algorithm | How it Works |
|-----------|-------------|
| **FCFS**  | Processes requests in arrival order. Simple but slow. |
| **SSTF**  | Always picks the nearest request. Fast but can starve far requests. |
| **SCAN**  | Moves in one direction like an elevator, then reverses. |
| **C-SCAN**| Like SCAN but jumps back to start after reaching the end. Uniform wait time. |

---

## 📊 Performance Metrics

- **Total Seek Time** — Total tracks the head moved
- **Average Seek Time** — Total seek / number of requests
- **Throughput** — Requests serviced per unit of seek movement
- **Request Count** — Number of disk requests processed



      To run project-

  open terminal(start backend)= 
cd backend
npm install
npm start
  now open new terminal(start frontend)=
cd frontend
npm install
npm run dev
