# Insta Clone 📸

A full-stack Instagram clone application built with modern web technologies, featuring user authentication, post management, and a responsive user interface.

## 🌐 Live Demo

[View Live Demo](https://your-deployed-url.com)

## 🛠️ Tech Stack

- **Frontend:** React.js
- **Backend:** Node.js, Express.js
- **Database:** MongoDB Atlas
- **Authentication:** JWT (JSON Web Tokens)
- **Deployment:** Render

## ✨ Features

- ✅ User Authentication (JWT-based login & register)
- ✅ Create, like, and delete posts
- ✅ Protected routes
- ✅ RESTful API
- ✅ Responsive UI design

## 📁 Project Structure

```
Insta-Clone/
├── Backend/
│   ├── routes/
│   ├── models/
│   ├── controllers/
│   ├── middleware/
│   ├── .env
│   └── server.js
├── Frontend/
│   ├── src/
│   ├── public/
│   └── package.json
└── README.md
```

## 🚀 Installation

### Prerequisites
- Node.js (v14 or higher)
- MongoDB Atlas account
- npm or yarn

### Backend Setup

```bash
cd Backend
npm install
npm start
```

### Frontend Setup

```bash
cd Frontend
npm install
npm run build
```

## 🔐 Environment Variables

Create a `.env` file in the Backend folder:

```
MONGO_URI=your_mongodb_atlas_connection_string
JWT_SECRET=your_jwt_secret_key
PORT=3000
NODE_ENV=development
```

## 🔌 API Routes Overview

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | User registration |
| POST | `/api/auth/login` | User login |
| GET | `/api/posts` | Get all posts |
| POST | `/api/posts` | Create new post |
| DELETE | `/api/posts/:id` | Delete post |
| POST | `/api/posts/:id/like` | Like a post |

## 🌍 Deployment

Deployed on [Render](https://instagram-clone-vibemesh.onrender.com/login)

1. Push code to GitHub
2. Connect repository to Render
3. Set environment variables in Render dashboard
4. Deploy

## 👤 Author

**Sadhna Gautam**
- GitHub: https://github.com/Sadhnagautam25/Instagram-clone---VibeMesh-
- Email: sadhnagautam813@gmail.com

---

Made with ❤️ by Sadhna gautam