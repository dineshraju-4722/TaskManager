# Team Task Manager - Full Stack Application

A complete full-stack web application for teams to collaboratively manage projects and tasks with secure JWT-based authentication and role-based access control.

## Technology Stack

### Backend
- **Framework**: Spring Boot 4.0.6 (Java 21)
- **Database**: PostgreSQL 18.3
- **Authentication**: JWT (JJWT 0.13.0) + Spring Security 6
- **Build Tool**: Gradle
- **API**: RESTful JSON endpoints

### Frontend
- **Framework**: React 19 + Vite 8
- **Styling**: Tailwind CSS v4
- **Routing**: React Router v6
- **HTTP Client**: Axios with JWT interceptor
- **Build Tool**: npm/Vite

## Features Implemented

✅ **Authentication & Authorization**
- JWT-based login/signup
- Username or email login support
- Protected routes (redirect to login if unauthenticated)
- Token stored in localStorage, attached to all API requests

✅ **Project Management**
- Create, read, update, delete projects
- Project members list
- Project-specific task management

✅ **Task Management**
- Create tasks within projects
- Task titles and descriptions
- Task status tracking (TODO, IN_PROGRESS, DONE)
- Fetch tasks by project

✅ **Security**
- Spring Security with CORS configuration
- BCrypt password encoding
- JWT token validation via AuthTokenFilter
- Unauthenticated access allowed for dashboard data fetching (for dev)

## Project Structure

```
Team-Task-Manager/
├── backend/
│   ├── src/main/java/com/taskmanager/backend/
│   │   ├── controller/          # REST endpoints
│   │   ├── service/             # Business logic
│   │   ├── repository/          # Data access
│   │   ├── model/               # Entity classes
│   │   ├── payload/             # Request/Response DTOs
│   │   ├── security/            # JWT and Spring Security config
│   │   └── config/              # DataInitializer and other configs
│   └── resources/
│       └── application.properties
├── frontend/
│   ├── src/
│   │   ├── pages/               # Login, Dashboard, Projects, etc.
│   │   ├── components/          # NavBar, PrivateRoute
│   │   ├── api/                 # Axios setup with interceptor
│   │   ├── App.jsx              # Router configuration
│   │   └── main.jsx
│   ├── package.json
│   ├── vite.config.js
│   ├── tailwind.config.cjs
│   └── postcss.config.cjs
└── README.md
```

## Setup Instructions

### Prerequisites
- Java 21 (with Gradle wrapper included)
- Node.js 18+ and npm
- PostgreSQL 15+ running locally
- Port 8080 (backend) and 5173/5174 (frontend) available

### Database Setup
```sql
CREATE DATABASE taskmanager;
```

Then start the backend—Hibernate will auto-create tables on first run.

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Configure database in `src/main/resources/application.properties`:
```properties
spring.datasource.url=jdbc:postgresql://localhost:5432/taskmanager
spring.datasource.username=postgres
spring.datasource.password=<your-password>
spring.app.jwtSecret=your-secret-key-here
spring.app.jwtExpirationMs=86400000
```

3. Start the backend:
```bash
.\gradlew.bat bootRun
```

Backend will run on `http://localhost:8080` and automatically seed a default admin user.

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the dev server:
```bash
npm run dev
```

Frontend will run on `http://localhost:5173` (or 5174 if port is in use).

## Test Credentials

Default seeded user (created on first backend run):
- **Username**: `admin`
- **Email**: `admin@example.com`
- **Password**: `password`

## API Endpoints

### Authentication
- `POST /api/auth/signin` - Login (returns JWT token)
- `POST /api/auth/signup` - Register new user

### Projects (Protected)
- `GET /api/projects` - List all projects
- `POST /api/projects` - Create project
- `GET /api/projects/{id}` - Get project details
- `PUT /api/projects/{id}` - Update project
- `DELETE /api/projects/{id}` - Delete project
- `POST /api/projects/{projectId}/tasks` - Create task in project
- `GET /api/projects/{projectId}/tasks` - List tasks in project
- `POST /api/projects/{projectId}/members/{userId}` - Add member to project

### Tasks (Protected)
- `GET /api/tasks` - List all tasks
- `PUT /api/tasks/{id}` - Update task
- `DELETE /api/tasks/{id}` - Delete task
- `POST /api/tasks/{taskId}/assign/{userId}` - Assign task to user

## Frontend Flow

1. **Login Page** (`/login`)
   - Enter username/email and password
   - Submit form → calls `/api/auth/signin`
   - JWT token stored in localStorage
   - Redirects to `/dashboard`

2. **Dashboard** (`/dashboard`)
   - Shows project and task counts
   - Protected by PrivateRoute (redirects to login if no token)

3. **Projects** (`/projects`)
   - List all projects
   - "New Project" button shows inline form
   - Click project to view details

4. **Project Detail** (`/projects/:id`)
   - View project name, description, members
   - "Edit" button shows update form with delete option
   - "New Task" button shows task creation form
   - Tasks listed below

5. **Navigation**
   - NavBar shows "Logout" when authenticated
   - Logout clears token and redirects to `/login`

## Key Implementation Details

### JWT Flow
1. Frontend sends credentials to `/api/auth/signin`
2. Backend validates and returns JWT in response body
3. Frontend stores token: `localStorage.setItem('token', token)`
4. Axios interceptor adds to all requests: `Authorization: Bearer <token>`
5. Backend `AuthTokenFilter` reads header, validates JWT, sets SecurityContext

### Protected Routes
```javascript
<PrivateRoute>
  <Dashboard />
</PrivateRoute>
```
Checks `localStorage.getItem('token')` and redirects to `/login` if not found.

### Flexible Login
Backend `UserDetailsServiceImpl` queries by username OR email:
```java
userRepository.findByUsernameOrEmail(username, username)
```
Allows users to sign in with either their username or email address.

### CORS Configuration
Backend allows requests from `http://localhost:*` (any port on localhost) for development:
```java
corsConfigurationSource()
  .allowedOriginPatterns("http://localhost:*")
  .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
  .allowedHeaders("*")
  .allowCredentials(true)
```

## Running the Full Stack

1. **Terminal 1**: Backend
```bash
cd backend
.\gradlew.bat bootRun
```

2. **Terminal 2**: Frontend
```bash
cd frontend
npm run dev
```

3. Open browser: `http://localhost:5173` (or 5174)

## Troubleshooting

### Port Already in Use
If port 8080 or 5173 is in use:
```bash
npx kill-port 8080
npx kill-port 5173
```

### Database Connection Fails
- Ensure PostgreSQL is running
- Check `application.properties` connection string
- Verify database `taskmanager` exists

### Frontend Dependencies Issue
```bash
cd frontend
rm -r node_modules package-lock.json
npm install
npm run dev
```

### Backend Compilation Error
```bash
cd backend
.\gradlew.bat clean build
```

## Testing the Application

1. Navigate to `http://localhost:5174`
2. Login with `admin` / `password`
3. Click "Projects" in navbar
4. Click "New Project" and fill in details
5. Click the created project
6. Click "New Task" and add a task
7. Verify task appears in the list with "Status: TODO"

## Next Steps for Enhancement

- [ ] Edit/delete tasks UI
- [ ] Task assignment to team members
- [ ] Task filtering by status/priority
- [ ] Project member management UI
- [ ] Email notifications on task assignment
- [ ] Real-time updates with WebSocket
- [ ] Docker containerization
- [ ] GitHub Actions CI/CD pipeline
- [ ] Deployment to AWS/GCP
- [ ] Unit and integration tests
- [ ] End-to-end tests with Cypress/Playwright

## Architecture Highlights

**Backend Layered Architecture**
```
Request → Filter (JWT) → Security Context → Controller → Service → Repository → Database
```

**Frontend Component Structure**
```
App (Routes) → PrivateRoute → Pages → Components → API (axios)
```

**Data Flow**
```
User Input → Form Submit → API Call (with JWT) → Backend Validation → Database → Response → State Update → Render
```

---

**Status**: ✅ Fully functional full-stack application with working authentication, CRUD operations, and protected routes.

**Last Updated**: May 7, 2026
