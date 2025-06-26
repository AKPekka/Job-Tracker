# 🧭 Project Brief: Job Search Tracker Dashboard

## 🎯 Objective

Build a **personal job application tracker dashboard** that allows the user (me) to log, manage, and analyze the status of job applications in a structured and intuitive way. This is not a multi-user application and does not require authentication.

The system should allow input of job listings, track progress through application stages, store recruiter/interview details, and visualize the process with simple analytics.

---

## 🧱 Tech Stack

### Frontend
- **Next.js (React Framework)**
- **TypeScript**
- **Chakra UI** (for UI components and layout)
- **Recharts** or **Chart.js** (for data visualizations)

### Backend
- **Node.js**
- **Express.js** (REST API routing and controller separation)
- **Prisma ORM** (type-safe DB queries)

### Database
- **PostgreSQL** (Relational, hosted locally)


---

## 🧩 MVP Features

### 📋 Job Entry & Tracking
- Add/edit/delete job entries
  - Fields: job title, company, location, application date, job URL, resume used, notes
- Track current stage: `["Saved", "Applied", "Phone Screen", "Interview", "Offer", "Rejected"]`

### 📞 Contact Management
- Add/edit contacts per job
  - Fields: name, role (e.g., recruiter, interviewer), email, phone, LinkedIn, notes

### 📅 Interview Logs
- Log interview events:
  - Fields: type, date/time, notes, questions asked, feedback

### 📊 Dashboard
- Summarized views and metrics:
  - Total jobs applied
  - Number per stage
  - Conversion rate (applied → interview → offer)
  - Timeline of applications

## 📌 Development Best Practices

- Use **TypeScript** throughout for type safety.
- Maintain **controller-service-repository** separation in backend.
- Use **Chakra's theme** system for consistent styling.
- Implement **form validation** using React Hook Form or Zod.
- Use **.env** files to store sensitive keys 
- Modularize and reuse components where possible.

### 🎯 Design Goals
- Ultra-clean, minimal interface
- Black background for focus and contrast
- Modern, readable typography
- Spaced layout with no visual clutter
- Thoughtful use of color and whitespace 