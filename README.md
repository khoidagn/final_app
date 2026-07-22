# Fotobook

A modern photo-sharing platform where users can upload, organize, and share photos and albums with the community. Users can discover public content, follow other photographers, interact with posts, and manage their own photo collections.

This project is developed as part of the NUS Advanced Training Program and follows a full-stack architecture with a focus on scalability, maintainability, and modern web development practices.

---

## 🚧 Project Status

This project is currently under development.

- ✅ Frontend implementation completed
- ✅ Mock API using JSON Server
- ✅ Backend implementation in progress
- ✅ Authentication and database integration planned

---

## Final Application

Fotobook allows users to:

- Create and manage personal accounts.
- Upload and organize photos into albums.
- Set photos and albums as public or private.
- Follow and unfollow other users.
- Explore community content through feeds and discovery pages.
- Like photos and albums.
- Manage personal profiles and uploaded content.
- Access administrator features for user and content management.

### Key Features

#### Authentication & Authorization

- User registration and login
- JWT-based authentication
- Email verification
- Password reset
- Role-based access control (User/Admin)

#### Photo Management

- Upload photos
- Edit and delete photos
- Public/private visibility
- Image preview and gallery view

#### Album Management

- Create albums
- Upload multiple images
- Edit and delete albums
- Public/private visibility

#### Social Features

- Follow / unfollow users
- Like photos and albums
- Personalized feed
- Public user profiles

#### Admin Features

- Manage users
- Manage photos
- Manage albums
- Activate/deactivate user accounts

---

## 🛠 Tech Stack

### Frontend

![React](https://img.shields.io/badge/React-19.2.6-61DAFB?logo=react&logoColor=white)
![React DOM](https://img.shields.io/badge/React_DOM-19.2.6-61DAFB?logo=react&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-6.0.2-3178C6?logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-8.0.12-646CFF?logo=vite&logoColor=white)
![React Router](https://img.shields.io/badge/React_Router-8.0.1-CA4245?logo=reactrouter&logoColor=white)
![React Router DOM](https://img.shields.io/badge/React_Router_DOM-7.18.0-CA4245?logo=reactrouter&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.3.1-06B6D4?logo=tailwindcss&logoColor=white)
![Axios](https://img.shields.io/badge/Axios-1.18.1-5A29E4?logo=axios&logoColor=white)
![Lucide React](https://img.shields.io/badge/Lucide_React-1.21.0-F56565)

### Backend 

![Node.js](https://img.shields.io/badge/Node.js-v18+-339933?logo=node.js&logoColor=white)
![Express](https://img.shields.io/badge/Express-5.2.1-000000?logo=express&logoColor=white)
![Prisma](https://img.shields.io/badge/Prisma-7.8.0-2D3748?logo=prisma&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-17-4169E1?logo=postgresql&logoColor=white)
![JWT](https://img.shields.io/badge/JWT-9.0.3-000000?logo=jsonwebtokens&logoColor=white)
![Passport](https://img.shields.io/badge/Passport-0.7.0-34E27A?logo=passport&logoColor=white)
![Zod](https://img.shields.io/badge/Zod-4.4.3-3E67B1)
![TSX](https://img.shields.io/badge/TSX-4.22.4-3178C6)


### Development Tools

![npm](https://img.shields.io/badge/npm-Latest-CB3837?logo=npm&logoColor=white)
![ESLint](https://img.shields.io/badge/ESLint-10.3.0-4B32C3?logo=eslint&logoColor=white)
![TypeScript ESLint](https://img.shields.io/badge/typescript--eslint-8.59.2-3178C6?logo=typescript&logoColor=white)
![JSON Server](https://img.shields.io/badge/JSON_Server-1.0.0--beta.15-000000)
![GitHub Actions](https://img.shields.io/badge/GitHub_Actions-Ready-2088FF?logo=githubactions&logoColor=white)

---

## Project Structure

```text
final_app/
├── be/
│   ├── src/
│   │   ├── app.ts                  # Application entry point
│   │   ├── config/                 # Global configurations
│   │   ├── controllers/            # Handle HTTP requests & responses
│   │   ├── services/               # Business logic layer
│   │   ├── routes/                 # Express route definitions
│   │   ├── middlewares/            # Custom Express middlewares
│   │   ├── validations/            # Zod validation schemas
│   │   └── views/                  # Pug templates
│   │
│   ├── .env.example                # Environment variable template
│   ├── auth_test.http              # REST Client API testing file
│   ├── eslint.config.js            # ESLint Flat Config
│   ├── package.json                # Project metadata & dependencies
│   ├── prisma.config.ts            # Prisma configuration
│   ├── tsconfig.json               # TypeScript configuration
│   └── README.md                   # Project documentation│
│ 
└── fe/
    ├── public/
    ├── src/
    │   ├── api/            # API configuration and requests
    │   ├── assets/         # Static assets
    │   ├── components/     # Reusable UI components
    │   ├── hooks/          # Custom React hooks
    │   ├── mocks/          # Mock data and API mocks
    │   ├── pages/          # Application pages
    │   ├── services/       # Business logic and API services
    │   ├── types/          # TypeScript type definitions
    │   ├── utils/          # Utility functions
    │   ├── App.tsx
    │   ├── App.css
    │   ├── index.css
    │   └── main.tsx
    │
    ├── .env
    ├── .env.example
    ├── package.json
    └── vite.config.ts
```

---

## ⚙️ Getting Started

### Prerequisites

Make sure you have installed:

- Node.js >= 20
- npm >= 10
- Git

### Clone Repository

```bash
git clone https://github.com/khoidagn/final_app.git
cd final_app/fe
```

### Install Dependencies

```bash
npm install
```

### Environment Variables

Create a local environment file:

```bash
cp .env.example .env
```

Update the environment variables if needed.

### Run Development Server

```bash
npm run dev
```

The application will be available at:

```text
http://localhost:5173
```

### Run Mock API

This project currently uses JSON Server as a mock backend.

```bash
npm run mock-api
```

Mock API will be available at:

```text
http://localhost:5000
```

<!-- ### Build for Production

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
``` -->

---

## 📜 Available Scripts

| Command            | Description                   |
| ------------------ | ----------------------------- |
| `npm run dev`      | Start Vite development server |
| `npm run mock-api` | Start JSON Server mock API    |
| `npm run lint`     | Run ESLint                    |

<!-- | `npm run build`    | Build application for production |
| `npm run preview`  | Preview production build         | -->

---

## 🔧 Environment Variables

Example:

```env
VITE_API_URL=http://localhost:5000
```

Never commit real environment files or secrets to the repository.

---

## Future Improvements

- Real-time notifications
- Advanced search functionality
- Social login (Google, Facebook, X)
- Infinite scrolling optimization
- Cloud image storage (AWS S3 / Cloudinary)
- Email notification system
- Docker deployment

---

## Contributing

1. Create a feature branch.
2. Commit your changes.
3. Open a Pull Request.

Please follow the project's coding standards and best practices.

---

## License

This project is developed for educational purposes as part of the NUS Advanced Training Program.
