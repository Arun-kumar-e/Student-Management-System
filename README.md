![Java](https://img.shields.io/badge/Java-21-orange)
![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.x-green)
![React](https://img.shields.io/badge/React-19-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue)
![Tailwind](https://img.shields.io/badge/Tailwind%20CSS-4.x-38bdf8)
![License](https://img.shields.io/badge/License-MIT-lightgrey)

# Student Management System — Aegis Academy Console

A full-stack student records platform with real-time validation, animated analytics dashboards, and duplicate-conflict handling — built to demonstrate production-style layered architecture end to end.

---

## Workspace Structure

```text
.
├── backend/                  # Spring Boot 3.x REST Service
│   ├── src/                  # Controller, Service, DTO, Repository, Entity, Config
│   ├── pom.xml               # Maven Dependencies
│   ├── mvnw                  # Linux maven wrapper script
│   └── mvnw.cmd              # Windows maven wrapper script
│
├── frontend/                 # React 19 + Vite + TS Client App
│   ├── src/                  # Components, Pages, Axios API client, CSS
│   ├── .env                  # Environment variables
│   ├── package.json          # Dependencies & scripts
│   └── vite.config.ts        # Vite plugins and server config
│
└── README.md
```

---

## Technical Stack

### Backend
- **Framework**: Spring Boot 3.x / Java 21 / Maven
- **Database**: PostgreSQL (JDBC: `jdbc:postgresql://localhost:5432/springdb`)
- **Port**: `8080` (base mapping: `/api/students`)
- **CORS Allowed Origin**: `http://localhost:3000`

### Frontend
- **Framework**: React 19 / Vite / TypeScript
- **Styling**: Tailwind CSS v4 with dark mode
- **Animations**: Framer Motion
- **Forms**: React Hook Form + Zod
- **Charts**: Recharts
- **Icons**: Lucide
- **Port**: `3000`

---

## API Reference

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/students` | Create a new student |
| GET | `/api/students?page=&size=&sortBy=&direction=` | Paginated student list |
| GET | `/api/students/{id}` | Get student by ID |
| PUT | `/api/students/{id}` | Update a student |
| DELETE | `/api/students/{id}` | Delete a student |
| GET | `/api/students/search?name=` | Search by name |
| GET | `/api/students/department?dept=` | Filter by department |

---

## Prerequisites

1. **JDK 21** or higher
2. **Node.js** v18+ (npm v9+)
3. **PostgreSQL** on port `5432`:
   - Database: `springdb`
   - Username: `arun`
   - Password: `arun`

*(Adjust credentials in `backend/src/main/resources/application.properties` if needed)*

---

## Run Instructions

### Backend

```bash
cd backend
./mvnw clean compile
./mvnw spring-boot:run
```

Server starts at **`http://localhost:8080`**.

### Frontend

```bash
cd frontend
npm install
npm run dev
```

App opens at **`http://localhost:3000`**.

---

## Features

- **Dark Mode**: Toggle between light and violet-slate dark theme
- **Analytics Dashboard**: Real-time stats and department distribution chart
- **Server Error Mapping**: Spring validation errors mapped directly to form fields
- **Duplicate Detection**: Email and roll number conflicts handled with 409 responses
- **Animations**: Page transitions, loading shimmers, counter animations via Framer Motion

---

## Why I Built This

I built this to practice a full layered Spring Boot architecture (Controller → Service → Repository → DTO) paired with a production-quality animated frontend, including real client/server validation parity and structured error handling.

---

## License

MIT
