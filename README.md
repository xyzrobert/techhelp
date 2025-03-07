# TechHelp Platform

A full-stack web application connecting tech helpers with clients who need technical assistance. Built with React, Express, and Neon PostgreSQL.

## 🚀 Quick Start

1. **Clone the repository**
```bash
git clone [your-repo-url]
cd techhelp
```

2. **Set up environment variables**
Create a `.env` file in the root directory:
```env
DATABASE_URL=your_neon_postgres_url
JWT_SECRET=your_jwt_secret
```

3. **Run setup script**
```bash
npm run setup
```
This will:
- Install all dependencies
- Push database schema to Neon
- Initialize Tailwind CSS

4. **Start development environment**
```bash
npm run dev
```
This launches:
- Backend server (http://localhost:3000)
- Frontend dev server (http://localhost:5173)
- Database Studio (http://localhost:4983)

## 📚 Available Scripts

- `npm run dev` - Start all development servers
- `npm run setup` - First-time project setup
- `npm run build` - Build for production
- `npm run start` - Run production server
- `npm run db:push` - Push schema changes to database
- `npm run db:studio` - Open Drizzle Studio for database management

## 🏗️ Tech Stack

### Frontend
- React 18
- Vite
- TailwindCSS
- Radix UI Components
- React Query
- Wouter for routing
- TypeScript

### Backend
- Express.js
- Drizzle ORM
- Neon PostgreSQL
- JWT Authentication
- WebSocket for real-time features

## 📋 Features

### For Clients
- Create account and profile
- Search for tech helpers
- Book appointments
- Real-time chat with helpers
- Rate and review services

### For Helpers
- Professional profile creation
- Service listing management
- Appointment management
- Client communication
- Payment processing

## 🗄️ Database Schema

### Main Tables
- `users` - User profiles (both helpers and clients)
- `services` - Tech help services offered
- `bookings` - Appointment bookings
- `reviews` - Service reviews
- `payments` - Payment records

## 🔐 Authentication

Uses JWT-based authentication with secure HTTP-only cookies. Supports:
- User registration
- Login/Logout
- Role-based access control (helper/client)

## 🛠️ Development

### Adding New Features
1. Create feature branch
2. Implement changes
3. Update schema if needed (`npm run db:push`)
4. Test thoroughly
5. Submit PR

### Database Changes
1. Modify schema in `shared/schema.ts`
2. Run `npm run db:push`
3. Use Drizzle Studio to verify changes

## 📱 API Endpoints

### Authentication
- POST `/api/auth/signup` - Register new user
- POST `/api/auth/login` - User login
- POST `/api/auth/logout` - User logout

### Services
- GET `/api/services` - List services
- POST `/api/services` - Create service
- GET `/api/services/:id` - Get service details

### Bookings
- POST `/api/bookings` - Create booking
- GET `/api/bookings/:id` - Get booking details
- PATCH `/api/bookings/:id/status` - Update booking status

## 🤝 Contributing

1. Fork the repository
2. Create feature branch
3. Commit changes
4. Push to branch
5. Open pull request

## 📄 License

MIT License - see LICENSE file for details 