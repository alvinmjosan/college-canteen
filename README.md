# 🍔 College Canteen Food Ordering System

Welcome to the **College Canteen Food Ordering System**, a comprehensive full-stack web application designed to streamline the process of ordering food within a college campus. 

## ✨ Features

- **Secure Authentication**: User login and registration using JWT and bcrypt.
- **Responsive UI**: Built with React, Bootstrap, and Framer Motion for smooth, accessible, and interactive user experiences.
- **Menu Management**: Browse through different food categories and select available items.
- **Cart & Order System**: Easily add items to the cart, manage quantities, and place orders.
- **Notifications**: Email notifications (integrated with Nodemailer) and toast notifications (React Toastify) to keep users informed.
- **Modern Architecture**: Clean separation between frontend (React/Vite) and backend (Node.js/Express) connected via RESTful APIs.

## 💻 Tech Stack

### Frontend
- **React.js** (via Vite for lightning-fast builds)
- **Bootstrap** (for responsive styling)
- **Framer Motion** (for dynamic page transitions and interactive animations)
- **Lucide React & FontAwesome** (for scalable vector icons)
- **Axios** (for making HTTP requests to the backend)
- **React Router DOM** (for seamless client-side routing)
- **React Toastify** (for elegant push notifications)
- **Moment.js** (for date manipulation/formatting)

### Backend
- **Node.js & Express.js** (for scalable server architecture)
- **MongoDB & Mongoose** (for flexible, document-oriented database storage)
- **JSON Web Token (JWT)** (for stateless API authentication)
- **Bcrypt.js** (for secure password hashing)
- **Nodemailer** (for sending transactional emails)
- **Cors & Dotenv** (for cross-origin resource sharing and environment management)

## 📂 Project Structure

```text
college-canteen/
└── College Canteen Food Ordering System/
    ├── backend/
    │   ├── controllers/      # API logic and handlers
    │   ├── middleware/       # Express middlewares (e.g., Auth)
    │   ├── models/           # Mongoose schemas for MongoDB
    │   ├── routes/           # Express route definitions
    │   ├── index.js          # Entry point for backend server
    │   └── package.json
    └── frontend/
        ├── src/              # React components, pages, context, and assets
        ├── public/           # Static files
        ├── index.html        # Main HTML template
        ├── vite.config.js    # Vite configuration
        └── package.json
```

## 🚀 Getting Started

### Prerequisites
Before you begin, ensure you have the following installed on your local machine:
- [Node.js](https://nodejs.org/en/download/) (v16.0 or higher recommended)
- [MongoDB](https://www.mongodb.com/) (Local server or a MongoDB Atlas connection URI)

### Installation

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd college-canteen
   cd "College Canteen Food Ordering System"
   ```

2. **Backend Setup:**
   Open a new terminal and navigate to the backend directory:
   ```bash
   cd backend
   npm install
   ```
   **Create a `.env` file** in the `backend` root and configure the necessary environment variables:
   ```env
   PORT=5000
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret_key
   
   # Nodemailer config (optional depending on your setup)
   EMAIL_USER=your_email@example.com
   EMAIL_PASS=your_email_password
   ```

3. **Frontend Setup:**
   Open a new terminal and navigate to the frontend directory:
   ```bash
   cd frontend
   npm install
   ```

### Running the Application

1. **Start the Backend Server:**
   ```bash
   cd backend
   npm run dev
   ```
   *The Express server should now be running on `http://localhost:5000` (or your defined PORT).*

2. **Start the Frontend Server:**
   ```bash
   cd frontend
   npm run dev
   ```
   *Vite will start the React app locally, typically running on `http://localhost:5173`.*
