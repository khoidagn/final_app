# ⚙️ Fotobook Engine (Backend API Service)

The core Backend RESTful API service powering the **Fotobook** platform. Built with **Node.js (ESM)**, **TypeScript**, **Express v5**, and **Prisma ORM**, this service delivers a high-performance, scalable, and secure full-stack backend architecture backed by **PostgreSQL** and integrated with **Cloudinary** and **Nodemailer**.

This project was developed as part of the **NUS Advanced Training Program**.

---

## 🌟 1.Core Architecture & Key Features

### 🔒 1.1. Authentication & Security

- **JWT Authentication:** Dual-token mechanism using short-lived Access Tokens and long-lived Refresh Tokens.
- **Email Verification & Password Recovery:** Secure single-use expiring token mechanism for account verification and password resets using Nodemailer.
- **Role-Based Access Control (RBAC):** Middleware-enforced permissions (`GUEST`, `USER`, `ADMIN`).
- **Data Hashing & Security:** Robust password hashing with `bcryptjs`, structured CORS control, and sensitive field masking.

### 📷 1.2. Photo & Media Management

- **Multipart Cloud Storage Integration:** Multi-file stream uploads using `Multer` combined with **Cloudinary** for image processing and CDN hosting.
- **Relational Asset Mapping:** Efficient mapping between core assets (`Media`, `Photo`, `Album`) preventing orphan image files.
- **Prisma Cascading Operations:** Automated cleanup of Cloudinary media assets and relational records upon deletion.

### 📂 1.3. Albums & Feed Engine

- **Dynamic Album Management:** Single and multi-image album uploads, positional image reordering, and updating capabilities (`remainingImageIds`).
- **Reverse Chronological Feeds:** Optimized queries for personalized user feeds (following-only) and community discovery streams.
- **Privacy Controls:** Strict row-level validation for `PUBLIC` vs `PRIVATE` asset accessibility.

### 👥 1.4. Social Network Graph & Interaction Engine

- **Like Engine:** Polymorphic like mechanism for Photos and Albums with transactional counter synchronization (`likesCount`).
- **Follow System:** Bi-directional user follow graph with cached counts (`followersCount`, `followingsCount`).

### 🛡️ 1.5. Dedicated Admin Subsystem

- **Full Domain Authority:** Complete administrative control to view, update, lock/activate (`isActive`), or permanently delete users.
- **Global Asset Moderation:** Administrative access to inspect and moderate any platform photo or album regardless of privacy settings.

---

## 🛠️ 2. Tech Stack & Ecosystem

![Node.js](https://img.shields.io/badge/Node.js-v20+-339933?logo=node.js&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-v6.0+-3178C6?logo=typescript&logoColor=white)
![Express](https://img.shields.io/badge/Express-v5.2-000000?logo=express&logoColor=white)
![Prisma](https://img.shields.io/badge/Prisma-v7.8-2D3748?logo=prisma&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-v17-4169E1?logo=postgresql&logoColor=white)
![JWT](https://img.shields.io/badge/JWT-v9.0-000000?logo=jsonwebtokens&logoColor=white)
![Passport](https://img.shields.io/badge/Passport-v0.7-34E27A?logo=passport&logoColor=white)
![Zod](https://img.shields.io/badge/Zod-v4.4-3E67B1)
![Cloudinary](https://img.shields.io/badge/Cloudinary-v2.5-3448C5?logo=cloudinary&logoColor=white)
![Nodemailer](https://img.shields.io/badge/Nodemailer-v6.10-22B573)
![Swagger](https://img.shields.io/badge/Swagger-v5.0-85EA2D?logo=swagger&logoColor=black)

---

## 📁 3. Layered Architecture & Project Structure

The service follows a **Layered Service-Oriented Architecture (SOA)**, enforcing a strict separation of concerns:

```text
be/
├── prisma/
│   ├── schema.prisma           # Prisma ERD & relational database schema
│   └── seed.ts                 # Master Database Seed script
│
├── src/
│   ├── app.ts                  # Application entry point & Express server bootstrap
│   │
│   ├── config/                 # Centralized environment & strategy configurations
│   │   ├── env.ts              # Zod/Strict environment variable loader
│   │   ├── passport.ts         # Passport JWT authentication strategy
│   │   ├── prisma.ts           # Prisma Client singleton initialization
│   │   └── swagger.ts          # OpenAPI / Swagger UI configuration
│   │
│   ├── controllers/            # HTTP Request handling & response serialization
│   │   ├── admin.controller.ts
│   │   ├── album.controller.ts
│   │   ├── auth.controller.ts
│   │   ├── photo.controller.ts
│   │   └── user.controller.ts
│   │
│   ├── services/               # Core business logic & Prisma DB operations
│   │   ├── admin.service.ts
│   │   ├── album.service.ts
│   │   ├── auth.service.ts
│   │   ├── photo.service.ts
│   │   └── user.service.ts
│   │
│   ├── routes/                 # Express API routing definitions
│   │   ├── admin.routes.ts
│   │   ├── album.routes.ts
│   │   ├── auth.routes.ts
│   │   ├── photo.routes.ts
│   │   └── user.routes.ts
│   │
│   ├── middlewares/            # Custom Express middleware chain
│   │   ├── auth.middleware.ts  # JWT & Admin privilege guards
│   │   ├── error.middleware.ts # Global centralized error handler
│   │   ├── upload.middleware.ts# Multer multipart file interceptor
│   │   └── validate.middleware.ts # Zod request body/query validator
│   │
│   ├── validations/            # Zod validation schemas for request integrity
│   └── utils/                  # Shared utilities (logging, mailer, cloudinary)
│       ├── cloudinary.ts
│       ├── logging.ts
│       └── mail.ts
│
├── .env.example                # Environment variable template
├── auth_test.http              # REST Client testing suite
├── eslint.config.js            # ESLint Flat Config
├── package.json                # Project metadata & scripts
├── prisma.config.ts            # Prisma custom configuration
└── tsconfig.json               # TypeScript configuration
```

## 🏗️ 4. Request Flow

```text
Client Request (HTTP/HTTPS)
   │
   ▼
Express Routes
   │
   ▼
Middlewares (Authentication Guard ➔ Zod Validation ➔ Multer Upload)
   │
   ▼
Controllers (Parses Request Input & Sends Response HTTP JSON)
   │
   ▼
Services (Executes Business Logic, Transactions & DB Computations)
   │
   ▼
Prisma ORM ───► PostgreSQL Database
   │
   ▼
External Integrations (Cloudinary CDN / SMTP Mailer)
```

## 💻 5. Getting Started

### 🛠️ 5.1. Prerequisites

Before setting up the project locally, ensure you have the following installed:

- **Node.js** (v18.x or higher recommended)
- **npm** (v9.x or higher)
- **PostgreSQL** Local instance or Supabase Cloud instance

---

Follow these steps to set up the backend from scratch.

### 5.2. Clone the Repository and enter the backend workspace:

```bash
git clone https://github.com/khoidagn/final_app.git
cd be
npm install
```

---

### 5.3. Configure Environment Variables

Create a `.env` file inside the `be/` directory.

```bash
touch .env
```

Add the following configuration:

```env
# SERVER & APP CONFIGURATION
NODE_ENV=development
PORT=3002
HOST=http://localhost:3002
CLIENT_URL=http://localhost:5173

# DATABASE (PostgreSQL / Supabase)
DATABASE_URL="postgresql://postgres:password@localhost:5432/fotobook?schema=public"

# JWT SECRETS
JWT_ACCESS_SECRET="your_access_token_secret_key"
JWT_ACCESS_EXPIRES_IN="15m"
JWT_REFRESH_SECRET="your_refresh_token_secret_key"
JWT_REFRESH_EXPIRES_IN="7d"
JWT_VERIFICATION_SECRET="your_verification_secret_key"
JWT_RESET_PASSWORD_SECRET="your_reset_password_secret_key"

# CLOUDINARY CONFIGURATION
CLOUDINARY_CLOUD_NAME="your_cloud_name"
CLOUDINARY_API_KEY="your_api_key"
CLOUDINARY_API_SECRET="your_api_secret"
CLOUDINARY_FOLDER="fotobook_assets"

# MAIL / SMTP CONFIGURATION (Gmail App Password or Ethereal)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=youremail@gmail.com
SMTP_PASS=xxxx xxxx xxxx xxxx
SMTP_FROM="Fotobook System" <youremail@gmail.com>
```

---

### 5.4. Database Migration & Initialization

Synchronize your PostgreSQL database schema using Prisma ORM:

```bash
# Push schema changes to the database
npx prisma db push

# Generate Prisma Client
npx prisma generate
```

---

### 5.5. Seed Initial Data

Populate the database with default mock data.

```bash
npm run seed
```

---

### 5.6. Start Development Server

Run the development server with hot-reload via tsx:

```bash
npm run dev
```

The API service will start listening at:
👉 `http://localhost:3002/api/v1`

---

## 📡 6. Swagger UI Documentation & Testing

Once the server is running, navigate to the auto-generated Swagger OpenAPI interface in your browser:

👉 `http://localhost:3002/api-docs`

Full list of RESTful API endpoints.

Interactive "Try it out" request executor with JWT authorization support.

Complete Zod-backed JSON Request and Response Schemas.

## 🏃 7. Available Scripts

| Comment         | Action Description                                                  |
| --------------- | ------------------------------------------------------------------- |
| `npm run dev`   | Runs the Express server in watch mode using tsx.                    |
| `npm run seed`  | Executes `prisma/seed.ts` to wipe and seed fresh test data.         |
| `npm run lint`  | Checks code quality and formatting using ESLint Flat Config.        |
| `npm run build` | Transpiles TypeScript into optimized production JavaScript (dist/). |

---
## 🛡️ 7. Security & Best Practices Implemented
- Input Validation & Sanitization: All incoming body parameters, query parameters, and URL path variables are validated at runtime via Zod schemas.

- Centralized Error Handling: Global Express error middleware intercepts all unhandled exceptions, returning standardized JSON error payloads without leaking stack traces in production.

- Cascading Delete Integrity: Managed through Prisma schema relationships to avoid orphaned records across PostgreSQL tables.

- Environment Isolation: Centralized `src/config/env.ts` module guarantees the server fails immediately at startup if required variables are missing.

