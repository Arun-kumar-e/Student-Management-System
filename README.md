# Student Management System — Aegis Academy Console

This repository is structured as a monorepo containing a Spring Boot 3.x REST API backend and a high-fidelity animated React + Vite + TypeScript frontend.

---

## Workspace Structure

```text
.
├── backend/                  # Spring Boot 3.x REST Service
│   ├── src/                  # Controller, Service, DTO, Repository, Entity, Config
│   ├── pom.xml               # Maven Dependencies & Compiler configuration
│   ├── mvnw                  # Linux maven wrapper script
│   └── mvnw.cmd              # Windows maven wrapper script
│
├── frontend/                 # React 18 + Vite + TS Client App
│   ├── src/                  # Components, Pages, Axios API client, CSS variables
│   ├── .env                  # Port environment variables (VITE_API_BASE_URL)
│   ├── package.json          # Node modules & execution scripts
│   └── vite.config.ts        # Vite plugins and server mapping configurations
│
└── README.md                 # Root execution guidelines
```

---

## Technical Stack & Configuration

### Backend
- **Framework**: Spring Boot 3.x / Java 21 / Maven
- **Database**: PostgreSQL (JDBC: `jdbc:postgresql://localhost:5432/springdb`)
- **Port**: `8080` (base mapping corrected to `/api/students`)
- **CORS Allowed Origin**: `http://localhost:3000`

### Frontend
- **Framework**: React 18 / Vite / TypeScript
- **Styling & Theme**: Tailwind CSS v4 (dark-mode-first theme, glassmorphism card accents)
- **Animations**: Framer Motion (page transitions, count ups, staggered tables, sliding drawers)
- **Forms & Validation**: React Hook Form + Zod (mirroring Spring `@NotBlank`, `@Email`, and decimal CGPA boundaries)
- **Data & Visuals**: Axios client, Recharts analytics, Lucide icons, React Hot Toast notifications
- **Port**: `3000` (defined in `vite.config.ts`)

---

## Prerequisites

Ensure you have the following installed locally:
1. **Java Development Kit (JDK) 21** or higher.
2. **Node.js** v18+ (with npm v9+).
3. **PostgreSQL Database** running on standard port `5432`:
   - Database name: `springdb`
   - Username: `arun`
   - Password: `arun`
   *(Or adjust these credentials in [backend/src/main/resources/application.properties](file:///home/arunchz/Code/Spring%20boot/StudentManagment/backend/src/main/resources/application.properties))*

---

## Run Instructions

### Step 1: Start the Spring Boot Backend

Open a terminal at the project root and navigate to the `backend/` directory, then start the application using the Maven wrapper:

```bash
cd backend
# Clean build the Java application
./mvnw clean compile

# Boot the REST service
./mvnw spring-boot:run
```

The server will start and be available at **`http://localhost:8080`**.

### Step 2: Start the React Frontend

Open a new terminal at the project root, navigate to the `frontend/` directory, install packages, and launch the dev environment:

```bash
cd frontend
# Install dependencies
npm install

# Start the Vite local server
npm run dev
```

The application will build and be accessible at **`http://localhost:3000`**.

---

## Design Accents & Features

- **Cohesive Dark Mode**: Dynamic toggles let you choose between a soft light layout and an immersive violet-slate dark theme.
- **Aggregated Analytics**: The landing page calculates statistics on the fly, feeding department distributions into a Recharts column bar.
- **Server Error Intercepts**: Spring 400 validation field maps and 409 conflict duplicates (email/roll number already in use) are captured by Axios interceptors and mapped back directly to the matching input borders.
- **Framer Motion Orchestration**: Sliding details, staggered data tables, loading shimmers, and dynamic counter increments provide fluid visual feedback.
