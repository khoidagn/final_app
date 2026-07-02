# Fotobook - Backend Architecture 

This is the core Backend service for the Fotobook Enterprise application, built using **Node.js** with native **ES Modules (ESM)**, **TypeScript**, **Express**, and **Prisma 7** connected to a PostgreSQL database.

---

## 🚀 Tech Stack & Core Libraries Installed

The system includes the following pre-configured dependencies within its architecture:

![Node.js](https://img.shields.io/badge/Node.js-v18+-339933?logo=node.js&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-6.0.3-3178C6?logo=typescript&logoColor=white)
![Express](https://img.shields.io/badge/Express-5.2.1-000000?logo=express&logoColor=white)
![Prisma](https://img.shields.io/badge/Prisma-7.8.0-2D3748?logo=prisma&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-17-4169E1?logo=postgresql&logoColor=white)
![JWT](https://img.shields.io/badge/JWT-9.0.3-000000?logo=jsonwebtokens&logoColor=white)
![Passport](https://img.shields.io/badge/Passport-0.7.0-34E27A?logo=passport&logoColor=white)
![Zod](https://img.shields.io/badge/Zod-4.4.3-3E67B1)
![ESLint](https://img.shields.io/badge/ESLint-10.6.0-4B32C3?logo=eslint&logoColor=white)
![TSX](https://img.shields.io/badge/TSX-4.22.4-3178C6)
![npm](https://img.shields.io/badge/npm-v10+-CB3837?logo=npm&logoColor=white)

## 🛠️ Prerequisites

Before setting up the project locally, ensure you have the following installed:

- **Node.js** (v18.x or higher recommended)
- **npm** (v9.x or higher)
- **PostgreSQL** (running locally or hosted)

---

# 💻 Getting Started

Follow these steps to set up the backend from scratch.

## 1. Clone the Repository

```bash
git clone https://github.com/khoidagn/final_app.git
cd be
```

---

## 2. Install Dependencies

All required libraries are already listed in `package.json`.

```bash
npm install 
```

---

## 3. Configure Environment Variables

Create a `.env` file inside the `be/` directory.

```bash
touch .env
```

Add the following configuration:

```env
# Server
PORT=3002
NODE_ENV=development

# PostgreSQL
DATABASE_URL="postgresql://<username>:<password>@localhost:5432/<database_name>?schema=public"

# JWT Access Token
JWT_ACCESS_SECRET="sieu_mat_ma_access_token_2026_khoi"
JWT_ACCESS_EXPIRES_IN="15m"

# JWT Refresh Token
JWT_REFRESH_SECRET="sieu_mat_ma_refresh_token_2026_khoi"
JWT_REFRESH_EXPIRES_IN="7d"
```

---

## 4. Initialize Prisma

Generate the Prisma Client and synchronize the database schema.

```bash
# Generate Prisma Client
npx prisma generate

# Run migrations
npx prisma migrate dev --name init
```

---

## 5. Seed Initial Data

Populate the database with default mock data.

```bash
npm run seed
```

---

# 🏃 Available Scripts

| Command | Description |
|----------|-------------|
| `npm run dev` | Starts the Express development server using **tsx** in watch mode on port **3002**. |
| `npm run lint` | Runs ESLint using the ESM Flat Config to check code quality. |
<!-- | `npm run build` | Compiles the TypeScript source into the `dist/` directory. | -->

---

# 📡 API Testing & Documentation

Once the server is running (`npm run dev`), you can explore the APIs using the following methods.

## Swagger UI

Open:

```
http://localhost:3002/api-docs
```

### Features

- Interactive API documentation
- JSON request/response schemas
- Error response examples
- Built-in **Authorize** button for JWT authentication

---

## REST Client (.http)

Open the file:

```
auth_test.http
```

inside **Visual Studio Code** (with the **REST Client** extension installed).

Click **Send Request** above each request block to test the API endpoints directly.

---

# 📁 Project Structure

```text
be/
├── prisma/
│   ├── schema.prisma           # Database schema definition
│   └── seed.ts                 # Seed initial data into PostgreSQL
│
├── src/
│   ├── app.ts                  # Application entry point
│   │
│   ├── config/                 # Global configurations
│   │   ├── passport.ts         # JWT Passport authentication strategy
│   │   ├── prisma.ts           # Prisma Client singleton
│   │   └── swagger.ts          # Swagger/OpenAPI configuration
│   │
│   ├── controllers/            # Handle HTTP requests & responses
│   │   └── auth.controller.ts
│   │
│   ├── services/               # Business logic layer
│   │   └── auth.service.ts
│   │
│   ├── routes/                 # Express route definitions
│   │   └── auth.routes.ts
│   │
│   ├── middlewares/            # Custom Express middlewares
│   │   ├── auth.middleware.ts
│   │   ├── error.middleware.ts
│   │   └── validate.middleware.ts
│   │
│   ├── validations/            # Zod validation schemas
│   │   └── auth.validation.ts
│   │
│   └── views/                  # Pug templates (if needed)
│
├── .env.example                # Environment variable template
├── auth_test.http              # REST Client API testing file
├── eslint.config.js            # ESLint Flat Config
├── package.json                # Project metadata & dependencies
├── prisma.config.ts            # Prisma configuration
├── tsconfig.json               # TypeScript configuration
└── README.md                   # Project documentation
```

---

## 📂 Folder Responsibilities

| Folder | Responsibility |
|---------|----------------|
| **prisma/** | Contains the database schema, migrations, and seed scripts. |
| **config/** | Stores global configurations such as Prisma Client, Passport JWT, and Swagger. |
| **controllers/** | Receives HTTP requests, validates inputs, invokes services, and returns responses. |
| **services/** | Implements the application's business logic and communicates with the database. |
| **routes/** | Maps API endpoints to their corresponding controllers. |
| **middlewares/** | Houses reusable Express middleware (authentication, validation, error handling, etc.). |
| **validations/** | Defines request validation schemas using Zod. |
| **views/** | Stores Pug templates used for server-rendered pages (if applicable). |

---

## 🏗️ Request Flow

```text
Client
   │
   ▼
Routes
   │
   ▼
Middlewares
(Authentication / Validation)
   │
   ▼
Controllers
   │
   ▼
Services
   │
   ▼
Prisma ORM
   │
   ▼
PostgreSQL
```