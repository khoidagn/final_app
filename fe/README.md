# 📷 Fotobook Client (Frontend)

The official Web Frontend client for **Fotobook** — a modern, responsive photo-sharing social platform built for photography enthusiasts to share precious life moments.

Built with **React 19**, **TypeScript**, **Vite**, and **Tailwind CSS v4**, this application delivers a fast, interactive user interface supporting rich media management, social networking features, and administrative moderation controls.

This project was developed as part of the **NUS Advanced Training Program**.

---

## 🛠 1. Tech Stack

![React](https://img.shields.io/badge/React-19.2.6-61DAFB?logo=react&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-6.0.2-3178C6?logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-8.0.12-646CFF?logo=vite&logoColor=white)
![React Router DOM](https://img.shields.io/badge/React_Router_DOM-7.18.0-CA4245?logo=reactrouter&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.3.1-06B6D4?logo=tailwindcss&logoColor=white)
![Axios](https://img.shields.io/badge/Axios-1.18.1-5A29E4?logo=axios&logoColor=white)
![Lucide React](https://img.shields.io/badge/Lucide_React-1.21.0-F56565)
![Zod](https://img.shields.io/badge/Zod-4.4.3-3E67B1)

---

## 🚀 2. Implemented Features

### 🔑 2.1. Authentication & Session Management

- **Registration & Email Verification:** Clean sign-up interface supporting Client-side input validation using Zod schemas. Integrated verification token confirmation flow (`/verify-email`).
- **Authentication Flows:** Secure Login, Logout, and Forgot/Reset Password workflows with automated access token refresh interceptors.
- **Cross-Tab Synchronization:** Integrated `BroadcastChannel` and polling mechanisms to maintain synchronized authentication states and automatic redirects across browser tabs/devices.
- **Route Guards & RBAC:** Protected route wrappers restricting views based on user roles (`Guest`, `User`, and `Admin`).

### 🖼️ 2.2. Media & Content Management

- **Photo Publishing:** Upload single photos with strict validation rules (title $\le$ 140 chars, description $\le$ 300 chars, formats: `JPEG`, `PNG`, `GIF` up to 5MB).
- **Album Collections:** Multi-image album creator supporting batch uploads (up to 25 images per album). Includes interactive album carousel viewers.
- **Privacy Controls:** Dynamic toggle between `Public` and `Private` sharing modes with visual status indicators (lock badges).
- **Edit & Delete Operations:** Edit media details, add/replace images, and delete items with double-confirmation modal dialogs.

### 🌐 2.3. Social & Discovery Hubs

- **Personalized Feeds:** Reverse-chronological timeline displaying public photos and albums exclusively from followed photographers.
- **Discovery Page:** Explore all public community content with seamless pagination and content type filters (`Photos` / `Albums`).
- **Interactions:** One-click Like/Unlike system with instant count updates, and Follow/Unfollow user capabilities.
- **Interactive Modals:** Accessible preview modals for photo details and album gallery navigation without full page reloads.

### 👤 2.4. Profiles & Account Settings

- **Public Profiles:** View member profiles displaying public photo/album collections, follow statistics, and social links.
- **Personal Dashboard ("My Profile"):** Unified workspace featuring dedicated tabs for personal Photos (with privacy status), Albums, Followers, and Followings.
- **Edit Profile:** Customize avatar image (Max 2MB), update name, email, and password. Auto-generated fallback avatars based on user initials when no image is provided.

### 🛡️ 2.5. Dedicated Administration Portal

- **User Management:** Paginated user table supporting search, account status activation/deactivation (suspend/reactivate), and permanent account deletion.
- **Global Content Moderation:** Comprehensive administrative oversight to view, edit, or remove any Photo or Album platform-wide (including private assets).

---

## 📂 3. Project Structure

```
fe/
├── public/                 # Static public assets (favicon, branding, logos)
├── src/
│   ├── api/                # Axios instance client & token refresh interceptors
│   ├── assets/             # Global media files and styling resources
│   ├── components/         # Reusable UI components
│   │   ├── forms/          # Form fields with inline validation support
│   │   ├── guards/         # Route guards for Auth and Role-Based Access Control (RBAC)
│   │   ├── layouts/        # Media and Account setting layout wrappers
│   │   └── ui/             # Reusable UI primitives (Buttons, Modals, Spinners, Inputs)
│   ├── configs/            # Application environment and global configurations
│   ├── constants/          # Application-wide constants & error messages
│   ├── contexts/           # React Context providers (AuthContext, Theme, etc.)
│   ├── hooks/              # Custom React hooks (useAuth, usePhotoForm, useAlbumForm)
│   ├── pages/              # Primary application views
│   │   ├── Admin/          # Admin portal for User, Photo, and Album moderation
│   │   ├── Albums/         # Album creation, edit, and management views
│   │   ├── Auth/           # Login, Register, Password Reset, and Email Verification
│   │   ├── Feeds/          # Feeds timeline and Discovery hub pages
│   │   ├── not-found/      # 404 Not Found fallback page
│   │   ├── Photos/         # Photo upload, edit, and management views
│   │   ├── Search/         # Global search results page for Photos and Albums
│   │   └── Profile/        # My Profile, Public User Profiles, and Edit Profile
│   ├── services/           # Reusable REST API service layer (authService, photoService)
│   ├── types/              # TypeScript interfaces and type definitions
│   ├── utils/              # Helper utilities (error parsing, date formatting, authChannel)
│   ├── App.tsx             # Main application component & router setup
│   ├── index.css           # Tailwind CSS imports & global style overrides
│   └── main.tsx            # Application entry point
├── .env                    # Local environment variables
├── .env.example            # Environment variables template
├── package.json            # Project dependencies & npm scripts
└── vite.config.ts          # Vite bundler configuration
```

## ⚙️ 4. Getting Started

### 4.1. Prerequisites

Ensure you have installed:

- **Node.js**: `>= 20.0.0`
- **npm**: `>= 10.0.0`
- **Git**

### 4.2. Installation

1. **Clone the repository and navigate to the frontend folder:**

   ```bash
   git clone https://github.com/khoidagn/final_app.git
   cd final_app/fe
   ```

2. **Configure Environment Variables:**

   Create a `.env` file in the root of the `fe/` directory:

   ```bash
   cp .env.example .env
   ```

3. **Running Development Server:**

   Start the Vite development server:

   ```bash
   cp .env.example .env
   ```

   The application will be accessible at `http://localhost:5173`.

4. **Building for Production:**

   To create an optimized production build:

   ```bash
   npm run build
   ```

   To preview the built production bundle locally:

   ```bash
   npm run preview
   ```

## 📜 5. Available Scripts

| Command           | Description                                                               |
| ----------------- | ------------------------------------------------------------------------- |
| `npm run dev`     | Starts the Vite development server with Hot Module Replacement (HMR)      |
| `npm run build`   | Compiles and optimizes the TypeScript React code into the dist/ directory |
| `npm run preview` | Serves the production build locally for verification                      |
| `npm run lint`    | Executes ESLint to check for code style and quality issues                |
