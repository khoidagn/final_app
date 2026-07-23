# 📷 Fotobook — Fullstack Photo Sharing Platform

A modern, responsive photo-sharing social platform built for photography enthusiasts to express themselves, organize moments into multi-image albums, interact with community posts, and discover inspiring content.

This project was developed as part of the **NUS Advanced Training Program**, strictly adhering to full-stack software design principles, clean architecture, type safety, and modern web development practices.

---

 💡 _For detailed architectural documentation, API specifications, and folder breakdowns of each service, please refer to their respective README files:_

 - 📄 [Frontend Documentation (`fe/README.md`)](./fe/README.md)
 - 📄 [Backend Documentation (`be/README.md`)](./be/README.md)

---

## 🛠 Tech Stack Ecosystem

### 💻 Frontend Client

![React](https://img.shields.io/badge/React-19.2.6-61DAFB?logo=react&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-6.0.2-3178C6?logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-8.0.12-646CFF?logo=vite&logoColor=white)
![React Router DOM](https://img.shields.io/badge/React_Router_DOM-7.18.0-CA4245?logo=reactrouter&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.3.1-06B6D4?logo=tailwindcss&logoColor=white)
![Axios](https://img.shields.io/badge/Axios-1.18.1-5A29E4?logo=axios&logoColor=white)
![Lucide React](https://img.shields.io/badge/Lucide_React-1.21.0-F56565)
![Zod](https://img.shields.io/badge/Zod-4.4.3-3E67B1)

### ⚙️ Backend API Service

![Node.js](https://img.shields.io/badge/Node.js-v20+-339933?logo=node.js&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-v6.0+-3178C6?logo=typescript&logoColor=white)
![Express](https://img.shields.io/badge/Express-v5.2-000000?logo=express&logoColor=white)
![Prisma](https://img.shields.io/badge/Prisma-v7.8-2D3748?logo=prisma&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-v17-4169E1?logo=postgresql&logoColor=white)
![JWT](https://img.shields.io/badge/JWT-v9.0-000000?logo=jsonwebtokens&logoColor=white)
![Passport](https://img.shields.io/badge/Passport-v0.7-34E27A?logo=passport&logoColor=white)
![Cloudinary](https://img.shields.io/badge/Cloudinary-v2.5-3448C5?logo=cloudinary&logoColor=white)
![Nodemailer](https://img.shields.io/badge/Nodemailer-v6.10-22B573)
![Swagger](https://img.shields.io/badge/Swagger-v5.0-85EA2D?logo=swagger&logoColor=black)

### 🧰 Tools & Quality Control

![npm](https://img.shields.io/badge/npm-v10+-CB3837?logo=npm&logoColor=white)
![ESLint](https://img.shields.io/badge/ESLint-v10.3-4B32C3?logo=eslint&logoColor=white)
![Prettier](https://img.shields.io/badge/Prettier-v3.0-F7B93E?logo=prettier&logoColor=black)
![TSX](https://img.shields.io/badge/TSX-v4.22-3178C6)

---
## 🌐 Live Demo & Deployment

The application is fully deployed and accessible in production environment across modern cloud infrastructure platforms:

| Component | Platform | Status | Live URL |
| :--- | :--- | :--- | :--- |
| **Frontend Web App** | ![Vercel](https://img.shields.io/badge/Vercel-000000?logo=vercel&logoColor=white) | ![Active](https://img.shields.io/badge/Status-Active-2ea44f) | [https://rosy-fotobook.vercel.app](https://rosy-fotobook.vercel.app) |
| **Backend REST API** | ![Render](https://img.shields.io/badge/Render-46E3B7?logo=render&logoColor=white) | ![Active](https://img.shields.io/badge/Status-Active-2ea44f) | [https://fotobook-qit0.onrender.com](https://fotobook-qit0.onrender.com) |
| **Database (PostgreSQL)** | ![Supabase](https://img.shields.io/badge/Supabase-3ECF8E?logo=supabase&logoColor=white) | ![Active](https://img.shields.io/badge/Status-Active-2ea44f) | PostgreSQL Managed Database |


---

### ☁️ Deployment Architecture Highlights
- **Frontend Hosting (Vercel):** Continuous deployment automatically triggered on main branch updates with optimized static asset caching and global CDN distribution.
- **Backend Service (Render):** Docker/Node.js web service running instance environment with dynamic port mapping and environment isolation.
- **Managed Database (Supabase):** Managed PostgreSQL database cluster providing reliable SSL connections, transaction pooling, and automated backups.

---
## 📁 Repository Structure

```text
final_app/
├── be/                          # Express v5 + Prisma Backend REST API Service
│   ├── prisma/                  # Database Schema ERD, Migrations & Seeders
│   ├── src/                     # Core Business Logic Layered Architecture
│   │   ├── config/              # Centralized Environment, Passport & Swagger configs
│   │   ├── controllers/         # HTTP Request Parsers & Response Formatters
│   │   ├── middlewares/         # JWT Guards, Multer Upload & Error Interceptors
│   │   ├── routes/              # Express Endpoints Definition
│   │   ├── services/            # Business Logic & Prisma Transactions
│   │   └── validations/         # Zod Request Validation Schemas
│   ├── package.json             # Backend Dependencies & Scripts
│   └── README.md                # Detailed Backend API Documentation
│
├── fe/                          # React 19 + Vite Frontend Web Application
│   ├── public/                  # Static Public Assets (Favicon, Logos)
│   ├── src/                     # React Component Tree & Application Logic
│   │   ├── api/                 # Axios Client & Token Refresh Interceptors
│   │   ├── components/          # Reusable UI Primitives, Guards & Forms
│   │   ├── contexts/            # Global React Context State Management
│   │   ├── hooks/               # Custom React Hooks (useAuth, usePhotoForm)
│   │   ├── pages/               # Primary App Views (Auth, Feeds, Profile, Admin)
│   │   └── services/            # Client API Services Layer
│   ├── package.json             # Frontend Dependencies & Scripts
│   └── README.md                # Detailed Frontend Web Documentation
│
├── .gitignore                   # Workspace Root Git Ignore rules
├── .prettierrc                  # Workspace Prettier Code Formatting Config
├── package.json                 # Workspace Meta & Root Scripts
└── README.md                    # System Root Overview Documentation
```

## 🚀 Complete Functional Matrix

### 👤 1. Guest User (Unauthenticated)

- **Landing & Discovery:** Access Public Feeds and Discovery pages to browse public photos and albums.
- **Content Inspection:** Open interactive modals to view high-resolution photos and navigate through album image collections.
- **Profiles:** View Public User Profiles, including their public photos, public albums, follower list, and following list.
- **Authentication:** Sign up for a new account, confirm email via verification link, log in, and request password reset tokens.

### 🔐 2. Normal Authenticated User

- **Account Management:**
  - Edit Personal Profile: Update Avatar image (Max 2MB), First Name, Last Name, Email, and Password.
  - Auto-fallback initial avatars generated if no avatar photo is uploaded.
  - Session Synchronization: Cross-tab logout and state synchronization via `BroadcastChannel`.
- **Photo Management:**
  - Create/Upload new single photo (JPEG, PNG, GIF up to 5MB) with mandatory Title ($\le$ 140 chars) and Description ($\le$ 300 chars).
  - Set privacy mode: `Public` or `Private`.
  - Edit photo details or replace image file.
  - Delete photos with double-confirmation modal.
- **Album Management:**
  - Create new albums with batch uploading (up to 25 images per album).
  - Multi-image navigation carousel inside album preview modals.
  - Edit album details, update remaining image collections, or delete entire albums (automatically purges all associated stored images).
- **Social Engagement:**
  - **Feeds Page:** Personalized reverse-chronological timeline displaying public posts exclusively from followed photographers.
  - **Discovery Page:** Explore public posts platform-wide with content filters (`Photos` / `Albums`).
  - **Interactions:** One-click Like/Unlike photos and albums with real-time counter updates.
  - **Follow Graph:** One-click Follow/Unfollow other creators from feed cards, discovery grid, or profile pages.

### 🛡️ 3. Administrator (`ADMIN` Role)

- **User Moderation:**
  - View paginated list of all platform users with search capabilities.
  - Temporarily activate or deactivate (suspend) user accounts. Inactive users are immediately revoked access.
  - Permanently delete user accounts.
- **Global Asset Management:**
  - View, edit, or permanently remove **ANY** Photo or Album across the entire system, including assets marked as `PRIVATE`.

---

## 🏗️ Technical Highlights & Design Patterns

1. **Dual-Token Authentication with Queue Interceptor:**
   - Short-lived Access Tokens paired with long-lived Refresh Tokens.
   - Axios response interceptors transparently handle token expiration, queueing failed requests while fetching a new token without disturbing user session flow.

2. **Cascading Asset Lifecycle Management:**
   - Deleting a photo or album triggers automatic cleanup in both PostgreSQL relational database tables (`Media`, `Photo`, `Album`) and remote **Cloudinary CDN** storage to prevent orphan files.

3. **Strict Validation Pipeline:**
   - Both Client and Server enforce identical Zod validation schemas for request bodies, query strings, and file attributes (MIME types, file size boundaries).

4. **Self-Documenting RESTful API:**
   - Fully documented OpenAPI/Swagger endpoints available at `/api-docs` with interactive execution and JWT authorization support.

---

## 🛡️ License

This project was developed for educational purposes as part of the **NUS Advanced Training Program**.
