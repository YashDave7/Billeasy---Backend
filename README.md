# 📚 Book Review API

This is a RESTful API built with Node.js, Express, and MongoDB that allows users to register, log in, and manage books and their reviews. Authentication is handled using JWT tokens, and password security is ensured using bcrypt hashing.

---

## 🚀 Features

- User registration and login
- JWT-based authentication
- Secure password storage with bcrypt
- Add books
- Post, update & delete reviews on books
- Proper validation and authorization middleware

---

## 🛠️ Tech Stack

- Node.js
- Express.js
- MongoDB + Mongoose
- JWT (jsonwebtoken)
- bcrypt
- express-validator

---

## 📦 Installation & Setup

### 1. Clone the repository

```bash
git clone https://github.com/your-username/book-review-api.git
cd book-review-api

   2. Install dependencies

```bash
npm install

   3. Create a .env file
Create a .env file in the root folder and add the following:

PORT=5000
MONGODB_URI=your_mongodb_connection_uri
JWT_SECRET=your_jwt_secret

4. Start the development server

```bash
npm start
    Server runs on http://localhost:5000
