# 📱 Pinky Mobile — Service Management App

A full-stack MERN application for managing mobile repair service records.

## 🚀 Tech Stack

| Layer    | Technology                                  |
| -------- | ------------------------------------------- |
| Frontend | React 18, Tailwind CSS, Lucide Icons, jsPDF |
| Backend  | Node.js, Express 5, Mongoose                |
| Database | MongoDB Atlas                               |

---

## ✨ Features

- **Customer Management** — Add, Edit, View, Delete service records
- **Status Tracking** — Pending / Completed / Delivery
- **Table & Card Views** — Switch between layouts
- **PDF Export** — Export by Today / Last Week / Last Month / Last Year / Custom Date Range
- **Search** — Filter customers by name, phone, model, or status
- **Per-record PDF** — Individual service report for each customer
- **Animated Modals** — Premium popup design with spring animations

---

## 🛠️ Local Setup

### Prerequisites

- Node.js ≥ 18
- MongoDB Atlas account (or local MongoDB)

### 1. Clone the repo

```bash
git clone https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
cd YOUR_REPO_NAME
```

### 2. Setup Backend

```bash
cd backend
npm install

# Create .env file (copy from example)
cp .env.example .env
# Edit .env and add your MongoDB URI
```

`.env` format:

```
PORT=5000
MONGODB_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/<dbname>
```

```bash
npm run dev   # starts backend on port 5000
```

### 3. Setup Frontend

```bash
cd frontend
npm install
npm start     # starts React app on port 3000
```

---

## 🌐 Deployment

### Backend → [Render](https://render.com)

1. Go to [render.com](https://render.com) → New Web Service
2. Connect your GitHub repo
3. Set **Root Directory** to `backend`
4. Set **Build Command**: `npm install`
5. Set **Start Command**: `node server.js`
6. Add Environment Variables: `PORT`, `MONGODB_URI`

### Frontend → [Vercel](https://vercel.com)

1. Go to [vercel.com](https://vercel.com) → New Project
2. Import your GitHub repo
3. Set **Root Directory** to `frontend`
4. Add Environment Variable:
   - `REACT_APP_API_URL` = your Render backend URL (e.g. `https://your-app.onrender.com/api`)
5. Deploy ✅

---

## 📁 Project Structure

```
Rishi/
├── backend/
│   ├── server.js          # Express server + API routes
│   ├── .env.example       # Environment variable template
│   └── package.json
└── frontend/
    ├── src/
    │   ├── pages/
    │   │   ├── CustomerList.jsx   # Main customer management page
    │   │   └── EntryForm.jsx      # Add new customer form
    │   └── components/
    │       └── Sidebar.jsx
    └── package.json
```

---

## 🔐 Environment Variables

| Variable      | Description                     |
| ------------- | ------------------------------- |
| `PORT`        | Backend server port             |
| `MONGODB_URI` | MongoDB Atlas connection string |

> ⚠️ Never commit your `.env` file. It's listed in `.gitignore`.

---

## 📄 License

MIT © Pinky Mobile
