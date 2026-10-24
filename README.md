# Todo List App — MERN Stack

A full-stack Todo List application built with React, Node.js, Express.js, and MongoDB. Users can create, view, edit, complete, delete, and filter tasks through a simple and responsive interface.

## Features

- Add new tasks
- View all tasks
- Edit existing tasks
- Mark tasks as completed or active
- Delete tasks
- Filter tasks by All, Active, and Completed
- Store tasks in MongoDB for persistent storage
- REST API for task management
- Responsive user interface

## Technologies Used

**Frontend**
- React
- Vite
- CSS

**Backend**
- Node.js
- Express.js
- Mongoose
- CORS
- dotenv

**Database**
- MongoDB Atlas

**Tools**
- Git and GitHub
- Visual Studio Code
- npm

## Project Structure

```text
Task-app/
├── src/
│   ├── models/
│   │   └── Task.js
│   ├── routes/
│   │   └── taskRoutes.js
│   ├── App.jsx
│   ├── index.css
│   ├── main.jsx
│   └── server.js
├── index.html
├── vite.config.js
├── package.json
├── package-lock.json
├── .env
├── .gitignore
└── README.md
```

## Prerequisites

Install the following before running the application:

- Node.js and npm
- A MongoDB Atlas account or a MongoDB instance
- Git (optional, for cloning the repository)

## Installation and Setup

### 1. Clone the repository

```bash
git clone https://github.com/Aleetta007/Task-app.git
cd Task-app
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Create a `.env` file in the project root directory and add the MongoDB connection string and port configuration expected by `src/server.js`.

Example, **if your server reads `MONGO_URI`**:

```env
MONGO_URI=your_mongodb_connection_string
PORT=8000
```

Replace the placeholder with your own MongoDB connection string. Never commit your `.env` file or publish database credentials.

### 4. Start the backend

```bash
npm run dev
```

The backend runs on port `8000` by default, if configured that way in the server.

### 5. Start the frontend

Open a second terminal in the project directory and run:

```bash
npm run client
```

Open the local frontend URL printed by Vite. With the current configuration, it should be:

http://127.0.0.1:5173

## API Endpoints

The API base URL for local development is:

`http://127.0.0.1:8000/api/tasks`

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/tasks` | Retrieve all tasks |
| POST | `/api/tasks` | Create a task |
| PATCH | `/api/tasks/:id` | Update a task |
| DELETE | `/api/tasks/:id` | Delete a task |
| GET | `/api/health` | Check backend and database status |

## Database

The application uses MongoDB with Mongoose to store task data. When MongoDB is connected, tasks persist in the database across backend restarts.

## Deployment

The application is being prepared for deployment. The intended hosting setup is:

- **Frontend:** Vercel
- **Backend:** Render
- **Database:** MongoDB Atlas

Live deployment URLs will be added here after deployment is complete.

## Future Improvements

- User authentication
- User-specific task lists
- Task deadlines and priorities
- Search functionality
- Improved error handling

## Author

**Aleetta Viju**

GitHub: [@Aleetta007](https://github.com/Aleetta007)

## License

This project is available for educational purposes. Add a specific open-source license if you intend to grant others formal permission to reuse or modify the code.
