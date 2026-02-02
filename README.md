# Personal Milestone Tracker

A full-stack application for tracking personal achievements. Built with React and Node.js/Express.

## Prerequisites

- Node.js (v14 or higher)
- npm

## Installation & Setup

### Backend

```bash
cd backend
npm install
npm start
```

Server runs on `http://localhost:3001`

### Frontend

```bash
cd frontend
npm install
npm run dev
```

App runs on `http://localhost:3000`

## Features

- Add, view, and delete milestones
- Search and filter by category
- Sort by date or category
- Form validation and error handling
- Toast notifications
- Responsive design

## API Endpoints

- `GET /milestones` - Get all milestones
- `POST /milestones` - Create milestone (requires: title, category)
- `DELETE /milestones/:id` - Delete milestone
- `GET /health` - Health check

## Tech Stack

**Backend:** Express.js, MVC architecture (Controllers, Services, Routes)  
**Frontend:** React, Vite, Tailwind CSS  
**Storage:** In-memory (data resets on server restart)
