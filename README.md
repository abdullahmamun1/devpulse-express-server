# DevPulse – Express Server

**Internal Tech Issue & Feature Tracker**

A collaborative REST API for software teams to report bugs, suggest features, and coordinate resolutions. Built with Node.js, TypeScript, and PostgreSQL.

**Live URL:** https://devpulse-express-server.vercel.app/

---

## Features

- JWT-based authentication with role-level access control
- Create, view, update, and delete issues (bugs & feature requests)
- Issue workflow management: `open` → `in_progress` → `resolved`
- Role-based permissions: contributors manage their own issues, maintainers manage all
- Filtered and sorted issue listing by status, type, and date
- Request logging to file

---

## Tech Stack

| Technology   | Details                                                                                   |
| ------------ | ----------------------------------------------------------------------------------------- |
| Node.js      | LTS runtime (v24.x or higher)                                                             |
| TypeScript   | Latest stable version                                                                     |
| Express.js   | Modular router architecture                                                               |
| PostgreSQL   | Relational database hosted on Neon                                                        |
| Raw SQL      | Direct sql tagged template calls via @neondatabase/serverless — no ORMs or query builders |
| bcrypt       | Password hashing (salt rounds: 8–12)                                                      |
| jsonwebtoken | JWT generation and verification                                                           |

---

## User Roles & Permissions

| Role          | Permissions                                                                               |
| ------------- | ----------------------------------------------------------------------------------------- |
| `contributor` | Register & log in, create issues, view all issues, update own issues                      |
| `maintainer`  | All contributor permissions + update any issue, delete any issue, change any issue status |

---

## Setup

### Prerequisites

- Node.js v24.x or higher
- PostgreSQL database (e.g. [Neon](https://neon.tech))

### Installation

```bash
git clone https://github.com/your-username/devpulse-express-server.git
cd devpulse-express-server
npm install
```

### Environment Variables

Create a `.env` file in the root directory:

```env
PORT=3000
CONNECTION_STRING=your_postgresql_connection_string
JWT_SECRET=your_jwt_secret
```

### Run

```bash
# Development
npm run dev

# Production build
npm run build
npm start
```

The server will initialize the database tables automatically on startup.

---

## API Endpoints

Base URL: `https://devpulse-express-server.vercel.app`

### Auth

| Method | Endpoint           | Auth | Description              |
| ------ | ------------------ | ---- | ------------------------ |
| `POST` | `/api/auth/signup` | None | Register a new user      |
| `POST` | `/api/auth/login`  | None | Log in and receive a JWT |

### Issues

| Method   | Endpoint          | Auth                  | Description              |
| -------- | ----------------- | --------------------- | ------------------------ |
| `POST`   | `/api/issues`     | Required (any role)   | Create a new issue       |
| `GET`    | `/api/issues`     | None                  | Get all issues           |
| `GET`    | `/api/issues/:id` | None                  | Get a single issue by ID |
| `PATCH`  | `/api/issues/:id` | Required (any role)   | Update an issue          |
| `DELETE` | `/api/issues/:id` | Required (maintainer) | Delete an issue          |

### Query Parameters — `GET /api/issues`

| Parameter | Values                            | Description            |
| --------- | --------------------------------- | ---------------------- |
| `status`  | `open`, `in_progress`, `resolved` | Filter by issue status |
| `type`    | `bug`, `feature_request`          | Filter by issue type   |
| `sort`    | `newest` (default), `oldest`      | Sort by creation date  |

**Example:** `GET /api/issues?status=open&type=bug&sort=newest`

### Authentication Header

```
Authorization: <your_jwt_token>
```

---

## Database Schema

### `users`

| Column       | Type           | Constraints                                                            |
| ------------ | -------------- | ---------------------------------------------------------------------- |
| `id`         | `SERIAL`       | Primary key, auto-increment                                            |
| `name`       | `VARCHAR(64)`  | Not null                                                               |
| `email`      | `VARCHAR(255)` | Not null, unique                                                       |
| `password`   | `TEXT`         | Not null, bcrypt hashed, never returned in responses                   |
| `role`       | `VARCHAR(15)`  | Not null, default `contributor`, must be `contributor` or `maintainer` |
| `created_at` | `TIMESTAMP`    | Auto-generated on insert                                               |
| `updated_at` | `TIMESTAMP`    | Auto-refreshed on update                                               |

### `issues`

| Column        | Type           | Constraints                                                            |
| ------------- | -------------- | ---------------------------------------------------------------------- |
| `id`          | `SERIAL`       | Primary key, auto-increment                                            |
| `title`       | `VARCHAR(150)` | Not null, max 150 characters                                           |
| `description` | `TEXT`         | Not null, min 20 characters                                            |
| `type`        | `VARCHAR(20)`  | Not null, must be `bug` or `feature_request`                           |
| `status`      | `VARCHAR(15)`  | Not null, default `open`, must be `open`, `in_progress`, or `resolved` |
| `reporter_id` | `INT`          | References `users(id)`                                                 |
| `created_at`  | `TIMESTAMP`    | Auto-generated on insert                                               |
| `updated_at`  | `TIMESTAMP`    | Auto-refreshed on update                                               |

> **Note:** When an issue is updated without explicitly setting a status, it automatically transitions to `in_progress`.

---

## Project Structure

```
src/
├── config/          # Environment configuration
├── db/              # Database connection and schema initialization
├── middleware/       # Auth, logger, error handler
├── modules/
│   ├── auth/        # Signup, login — controller, service, routes
│   └── issues/      # CRUD — controller, service, routes
├── types/           # Shared types and role constants
├── utils/           # JWT signing, response helper
├── app.ts           # Express app setup
└── index.ts         # Entry point
```

---

## Author

**Abdullah Mamun**
