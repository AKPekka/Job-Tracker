# 🎯 Job Search Tracker Dashboard

A modern, feature-rich dashboard built with Next.js and Express to help track and manage your job search process. This single-user application provides an intuitive interface for logging applications, monitoring progress, and analyzing your job search journey through insightful visualizations.

![Project Status](https://img.shields.io/badge/status-active-success.svg)
![License](https://img.shields.io/badge/license-MIT-blue.svg)

## ✨ Features

- **📊 Interactive Dashboard**
  - Real-time statistics and metrics
  - Progress tracking across application stages
  - Visual analytics with charts and graphs
  - Dark/light mode support

- **💼 Job Management**
  - Comprehensive job entry system
  - Track applications through multiple stages
  - Search, filter, and sort capabilities
  - Quick inline editing and status updates

- **👥 Contact Tracking**
  - Store recruiter and interviewer details
  - Maintain communication history
  - LinkedIn profile integration
  - Notes and follow-up tracking

- **📅 Interview Management**
  - Schedule and track interviews
  - Log interview questions and feedback
  - Track interview types and stages
  - Store preparation notes

## 🛠️ Tech Stack

| Layer      | Technologies                                  |
|------------|----------------------------------------------|
| Frontend   | Next.js 15 • React 19 • TypeScript 5         |
| UI/UX      | Chakra UI v3 • Framer Motion • Recharts 3    |
| Backend    | Node 20 • Express 4 • Prisma 5               |
| Database   | PostgreSQL 15                                 |

## 📂 Project Structure

```
Job Search Tracker Dashboard/
├─ client/                # Next.js frontend (App Router)
│  └─ src/
│     ├─ app/            # Route segments & pages
│     ├─ components/     # UI components & charts
│     │  ├─ ui/          # Shared UI components
│     │  └─ JobStatsChart.tsx
│     └─ lib/           # API helpers & utilities
├─ server/               # Express + Prisma backend
│  ├─ src/
│  │  ├─ controllers/   # Request handlers
│  │  ├─ services/      # Business logic
│  │  ├─ repositories/  # Data access
│  │  └─ routes/       # API endpoints
│  └─ prisma/          # Database schema & migrations
└─ start.sh            # Development startup script
```

## 🚀 Getting Started

### Prerequisites

- Node.js 20 or higher
- PostgreSQL 15 or higher
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd job-search-tracker-dashboard
   ```

2. **Install dependencies**
   ```bash
   npm install --workspaces
   ```

3. **Configure environment**
   ```bash
   # Copy example env file
   cp server/.env.example server/.env
   
   # Update DATABASE_URL in server/.env
   ```

4. **Initialize database**
   ```bash
   cd server
   npx prisma migrate deploy
   ```

### Running the Application

**Option 1: Single Command (Recommended)**
```bash
./start.sh
```
- Frontend: http://localhost:3000
- Backend: http://localhost:3001

**Option 2: Separate Terminals**
```bash
# Terminal 1 - Backend
cd server && npm run dev

# Terminal 2 - Frontend
cd client && npm run dev
```

## 📝 Development Scripts

| Command                 | Description                          |
|------------------------|--------------------------------------|
| `./start.sh`           | Start both frontend and backend      |
| `npm run dev`          | Run development server (in respective directories) |
| `npx prisma studio`    | Open Prisma database GUI             |
| `npx prisma migrate dev`| Create and apply database migrations |

## 🎨 Features in Detail

### Application Stages
- Saved
- Applied
- Phone Screen
- Interview
- Offer
- Rejected

### Analytics
- Total applications submitted
- Applications by stage
- Success rate metrics
- Timeline visualization
- Stage conversion analytics

### Job Entry Fields
- Job title
- Company name
- Location
- Application date
- Job posting URL
- Resume version
- Notes and comments
- Current stage

## 📚 Best Practices

- Full TypeScript implementation
- Controller-Service-Repository pattern
- Chakra UI theming system
- Form validation with React Hook Form
- Environment variable management
- Component modularity and reusability

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

---

> **Note**: This is a single-user application designed for personal use. There is no authentication system implemented. All data is stored locally in PostgreSQL. 