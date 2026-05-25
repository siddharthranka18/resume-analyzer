<h1 align="center">
  <br>
  🧠 Resume Analyzer
  <br>
</h1>

<p align="center">
  <strong>AI-powered resume review & job-fit analysis — powered by Groq LLaMA 3.3 70B</strong>
</p>

<p align="center">
  <a href="#-features">Features</a> •
  <a href="#-tech-stack">Tech Stack</a> •
  <a href="#-architecture">Architecture</a> •
  <a href="#-getting-started">Getting Started</a> •
  <a href="#-api-reference">API Reference</a> •
  <a href="#-environment-variables">Environment Variables</a> •
  <a href="#-deployment">Deployment</a>
</p>

---

## 📌 Overview

**Resume Analyzer** is a full-stack web application that takes a candidate's resume (PDF or DOCX) and a target job description, then uses **Groq's LLaMA 3.3-70B** large language model to deliver a comprehensive, structured analysis — including a match score, matched/missing skills, key strengths, and actionable improvement suggestions.

A built-in rule-based **skill matcher** cross-references 60+ industry skills across Frontend, Backend, DevOps, AI/ML, and more, providing an additional layer of keyword-level matching on top of the AI analysis. All analyses are persisted to **MongoDB** and viewable in a dedicated history page.

> 🚀 **Live Demo:** [resume-analyzer-lovat-delta.vercel.app](https://resume-analyzer-lovat-delta.vercel.app)

---

## ✨ Features

| Feature | Description |
|---|---|
| 📄 **Multi-format Upload** | Supports PDF and DOCX resume uploads via drag-and-drop or file picker |
| 🤖 **AI Analysis** | Uses Groq's LLaMA 3.3-70B to generate a structured JSON analysis |
| 🎯 **Match Score** | Percentage-based job fit score returned by the AI model |
| 🔍 **Skill Matcher** | Rule-based extractor covering 60+ skills across 7 technology categories |
| ✅ **Matched / Missing Skills** | Side-by-side view of what you have vs. what the job requires |
| 💪 **Strengths & Improvements** | Specific, actionable feedback tailored to the JD |
| 🗂️ **Analysis History** | All analyses are saved to MongoDB and browsable from the History page |
| ⚡ **Real-time Loading Steps** | Animated progress indicators during analysis (Parsing → Extracting → Analyzing) |

---

## 🛠️ Tech Stack

### Backend
| Technology | Purpose |
|---|---|
| **Node.js + Express 5** | REST API server |
| **Groq SDK** (`llama-3.3-70b-versatile`) | AI analysis engine |
| **pdf-parse** | Extract text from PDF resumes |
| **mammoth** | Extract text from DOCX resumes |
| **Multer** | Multipart file upload handling |
| **Mongoose + MongoDB** | Persist analysis results |
| **dotenv** | Environment configuration |
| **cors** | Cross-origin request support |

### Frontend
| Technology | Purpose |
|---|---|
| **React 19 + Vite** | Frontend framework & build tool |
| **React Router DOM v7** | Client-side routing (3 pages) |
| **Axios** | HTTP client for API calls |
| **Vanilla CSS** | Custom styling with dark theme |

---

## 🏗️ Architecture

```
resume-analyzer/
│
├── index.js                    # Express app entry point
├── package.json                # Backend dependencies
│
├── src/
│   ├── routes/
│   │   └── analyzeRoutes.js    # POST /parse, POST /analyze, GET /history
│   ├── services/
│   │   ├── aiServices.js       # Groq LLaMA 3.3 70B integration
│   │   ├── resumeParser.js     # PDF (pdf-parse) & DOCX (mammoth) parser
│   │   └── skillMatcher.js     # Rule-based skill extraction & matching
│   └── models/
│       └── Analysis.js         # Mongoose schema for saved analyses
│
└── client/                     # React + Vite frontend
    ├── src/
    │   ├── App.jsx             # Root app with BrowserRouter & routes
    │   ├── pages/
    │   │   ├── Uploads.jsx     # Upload page (drag-and-drop + JD input)
    │   │   ├── Results.jsx     # Analysis results display
    │   │   └── History.jsx     # Past analyses viewer
    │   └── components/
    │       └── Navbar.jsx      # Navigation bar
    └── vite.config.js
```

### Data Flow

```
User Uploads Resume + Job Description
         │
         ▼
  [Multer] → Save file to /uploads
         │
         ▼
  [resumeParser] → Extract raw text (PDF / DOCX)
         │
     ┌───┴───┐
     ▼       ▼
[aiServices]  [skillMatcher]
(Groq LLaMA)  (Rule-based)
     │              │
     └──────┬───────┘
            ▼
     [MongoDB] ← Save Analysis
            │
            ▼
     Return JSON to React Frontend
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** v18+
- **MongoDB** (local or [MongoDB Atlas](https://www.mongodb.com/atlas))
- **Groq API Key** — free at [console.groq.com](https://console.groq.com)

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/resume-analyzer.git
cd resume-analyzer
```

### 2. Install Backend Dependencies

```bash
npm install
```

### 3. Install Frontend Dependencies

```bash
cd client
npm install
cd ..
```

### 4. Configure Environment Variables

Create a `.env` file in the **project root**:

```env
PORT=3000
MONGO_URI=mongodb://localhost:27017/resume-analyzer
GROQ_API_KEY=your_groq_api_key_here
```

Create a `.env` file inside the **`client/`** folder:

```env
VITE_API_URL=http://localhost:3000
```

### 5. Run the Application

**Backend** (from project root):
```bash
node index.js
```
> Or with auto-reload: `npx nodemon index.js`

**Frontend** (from `client/` directory):
```bash
npm run dev
```

Open your browser at **http://localhost:5173**

---

## 📡 API Reference

Base URL: `http://localhost:3000/api/analyze`

### `POST /parse`
Parse a resume file and return raw extracted text.

| Field | Type | Description |
|---|---|---|
| `resume` | `File` (form-data) | PDF or DOCX file |

**Response:**
```json
{
  "success": true,
  "filename": "resume.pdf",
  "mimetype": "application/pdf",
  "text": "Extracted raw text..."
}
```

---

### `POST /analyze`
Analyze a resume against a job description.

| Field | Type | Description |
|---|---|---|
| `resume` | `File` (form-data) | PDF or DOCX file |
| `jobDescription` | `string` (form-data) | Plain text job description |

**Response:**
```json
{
  "success": true,
  "id": "mongo_document_id",
  "aiAnalysis": {
    "matchScore": 78,
    "matchedSkills": ["React", "Node.js", "MongoDB"],
    "missingSkills": ["AWS", "Docker"],
    "strengths": ["Strong full-stack experience", "Relevant project portfolio"],
    "improvements": ["Add cloud deployment experience", "Mention CI/CD pipelines"],
    "summary": "A strong candidate with solid full-stack fundamentals..."
  },
  "skillMatch": {
    "resumeSkills": ["react", "nodejs", "mongodb", "git"],
    "jdSkills": ["react", "nodejs", "mongodb", "aws", "docker"],
    "matchedSkills": ["react", "nodejs", "mongodb"],
    "missingSkills": ["aws", "docker"],
    "matchPercentage": 60
  }
}
```

---

### `GET /history`
Retrieve all past analyses, sorted by most recent.

**Response:**
```json
{
  "success": true,
  "analyses": [{ "filename": "...", "aiAnalysis": {...}, "skillMatch": {...}, "createdAt": "..." }]
}
```

---

## 🔐 Environment Variables

| Variable | Location | Description |
|---|---|---|
| `PORT` | Root `.env` | Port the Express server listens on |
| `MONGO_URI` | Root `.env` | MongoDB connection string |
| `GROQ_API_KEY` | Root `.env` | Your Groq Cloud API key |
| `VITE_API_URL` | `client/.env` | Backend API base URL for the frontend |

---

## ☁️ Deployment

The application is configured for deployment with:

- **Frontend → [Vercel](https://vercel.com)** (set `VITE_API_URL` as an environment variable in Vercel project settings)
- **Backend → [Render](https://render.com) / [Railway](https://railway.app)** (set `PORT`, `MONGO_URI`, `GROQ_API_KEY` as env vars)
- **Database → [MongoDB Atlas](https://www.mongodb.com/atlas)** (use the Atlas connection string for `MONGO_URI`)

> The backend CORS configuration already whitelists `https://resume-analyzer-lovat-delta.vercel.app` and `http://localhost:5173`.

---

## 📋 Skill Categories Covered

The built-in skill matcher covers **60+ skills** across 7 categories:

| Category | Skills |
|---|---|
| **Frontend** | React, Vue, Angular, JavaScript, TypeScript, HTML, CSS, Tailwind, Bootstrap, Next.js, Redux |
| **Backend** | Node.js, Express, Django, Flask, FastAPI, Spring, Laravel, REST, GraphQL, Socket.IO |
| **Databases** | MongoDB, MySQL, PostgreSQL, Redis, Firebase, SQLite, DynamoDB |
| **Cloud & DevOps** | AWS, GCP, Azure, Docker, Kubernetes, CI/CD, GitHub Actions, Linux |
| **AI / ML** | Python, TensorFlow, PyTorch, LangChain, OpenAI, LLM, NLP, Computer Vision |
| **Tools** | Git, GitHub, Postman, Jira, Figma, Vercel, Render |
| **Concepts** | OOP, Data Structures, Algorithms, System Design, Microservices, Agile, JWT |

---

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

---

## 📄 License

This project is licensed under the **ISC License**.

---

<p align="center">
  Built with ❤️ using Groq AI, React, and Node.js
</p>
