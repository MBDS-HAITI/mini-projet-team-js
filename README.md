# School Management System

[![CI Pipeline](https://github.com/MBDS-HAITI/mini-projet-team-js-private/actions/workflows/ci.yml/badge.svg)](https://github.com/MBDS-HAITI/mini-projet-team-js-private/actions/workflows/ci.yml)

A comprehensive school management system built with Node.js, Express, MongoDB, React, and Material-UI.

## 🚀 Live Demo

- **Frontend**: [https://main.d3w0bfgl6938wl.amplifyapp.com/](https://main.d3w0bfgl6938wl.amplifyapp.com/)
- **Backend API**: [https://mbds-student-management-backend-main.onrender.com/](https://mbds-student-management-backend-main.onrender.com/)
- **API Health Check**: [https://mbds-student-management-backend-main.onrender.com/health](https://mbds-student-management-backend-main.onrender.com/health)

## Features

- 👥 **Student Management** - Manage student profiles, enrollment, and academic records
- 📚 **Course Management** - Create and manage courses and curricula
- ✏️ **Grade Management** - Track and manage student grades
- 📊 **Dashboard** - Real-time analytics and reporting
- 🔐 **Authentication** - Secure login with OAuth support (Google, GitHub, LinkedIn, Facebook)
- 👨‍💼 **Role-based Access** - Admin, Scolarité, and Student roles
- 🖨️ **Print Features** - Generate printable reports and documents
- 🌙 **Dark Mode** - Light and dark theme support

## Tech Stack

### Backend
- **Runtime**: Node.js 20+
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose
- **Authentication**: Passport.js with OAuth strategies
- **Security**: JWT, bcrypt

### Frontend
- **Framework**: React 19
- **UI Library**: Material-UI (MUI) v7
- **Routing**: React Router v7
- **State Management**: React Context API
- **HTTP Client**: Axios
- **Charts**: Recharts
- **Build Tool**: Vite

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- MongoDB (local or Atlas)
- Google, GitHub OAuth credentials (optional)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd mini-projet-team-js-private
   ```

2. **Backend Setup**
   ```bash
   cd school-backend
   npm install
   cp .env.example .env
   # Edit .env with your configuration
   npm run seed  # Seed database with test data
   npm run dev   # Start backend server
   ```

3. **Frontend Setup**
   ```bash
   cd school-front
   npm install
   cp .env.example .env
   # Edit .env with backend URL
   npm run dev   # Start frontend dev server
   ```

### Environment Variables

#### Backend (.env)
```env
NODE_ENV=development
PORT=7010
MONGODB_URI=mongodb://localhost:27017/school
JWT_SECRET=your-secure-secret-key
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
FRONTEND_URL=http://localhost:5173
```

#### Frontend (.env)
```env
VITE_API_URL=http://localhost:7010
```

### Default Test Accounts

After seeding the database:

- **Admin**: admin@mail.com / Admin@123
- **Scolarité**: scolarite@mail.com / Scolarite@123
- **Student**: student@mail.com / Student@123

## Development

### Backend Scripts
```bash
npm run dev      # Start development server with nodemon
npm start        # Start production server
npm run seed     # Seed database
npm run lint     # Run ESLint
npm test         # Run tests
```

### Frontend Scripts
```bash
npm run dev      # Start dev server
npm run build    # Build for production
npm run preview  # Preview production build
npm run lint     # Run ESLint
npm test         # Run tests
```

## CI/CD

The project uses GitHub Actions for continuous integration:

- **Automated Testing**: Runs on every push and pull request
- **Linting**: Code quality checks
- **Build Verification**: Ensures code compiles successfully
- **Artifact Upload**: Saves build artifacts

See [.github/workflows/ci.yml](.github/workflows/ci.yml) for details.

## Project Structure

```
mini-projet-team-js-private/
├── .github/
│   └── workflows/
│       └── ci.yml
├── school-backend/
│   ├── src/
│   │   ├── config/
│   │   ├── middleware/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── utils/
│   │   ├── seed.js
│   │   └── server.js
│   └── package.json
└── school-front/
    ├── src/
    │   ├── api/
    │   ├── auth/
    │   ├── components/
    │   ├── layout/
    │   ├── pages/
    │   ├── theme/
    │   └── main.jsx
    └── package.json
```

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

Please ensure:
- All tests pass
- Code follows the style guide (run `npm run lint`)
- Commit messages are clear and descriptive

## License

This project is part of an academic assignment for MBDS Haiti.

## Support

For issues and questions, please use the [GitHub Issues](https://github.com/MBDS-HAITI/mini-projet-team-js-private/issues) page.
