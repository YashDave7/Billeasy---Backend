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

 1. **Clone the repository**

```bash
git clone https://github.com/your-username/book-review-api.git
cd book-review-api
```

 2. **Install dependencies**

```bash
npm install
```

 3. **Create a .env file**
Create a .env file in the root folder and add the following:

```bash
PORT=5000
MONGODB_URI=your_mongodb_connection_uri
JWT_SECRET=your_jwt_secret
```

 4. **Start the development server**

```bash
npm start
```
Server runs on http://localhost:5000




---

## 🔐 API Requests

### **Signup**

- **Endpoint:** `POST /api/auth/signup/`
- **Description:** Register a new user.
- **Request Body:**
```json
{
  "name": "Yash Dave",
  "email": "yashdave307@gmail.com",
  "password": "12345678"
}
```

### **Login**

- **Endpoint:** `POST /api/auth/login/`
- **Description:** Login a user.
- **Request Body:**
```json
{
  "email": "yashdave307@gmail.com",
  "password": "12345678"
}
```

### **Add a Book**

- **Endpoint:** `POST  /api/books`
- **Description:** Adds a new book.
- **Request Body:**
```json
{ 
    "title": "Doglapan",    
    "author": "Ashneer Grover", 
    "genre": "Finance" 
}
```

### **Retrieve all Books**
 
- **Endpoint:** `GET /api/books`
                `GET http://localhost:5000/api/books?page=1&limit=2`
- **Description:** Retrieve all the books with option for pagination.


### **Retrive a particular Book details**

- **Endpoint:** `GET /api/books/:book_id`
- **Description:** Retrieve the book details having that id.


### **Write Review**

- **Endpoint:**`POST /api/books/:book_id/reviews`
- **Description:** Writes review of a book.
- **Request Body:**
```json
{ 
    "comment": "Good Book of Finance!",     
    "rating": 5 
}
```


### **Update Review**

- **Endpoint:**`POST /api/books/reviews/68394a5d04df0e35134627c2/`
- **Description:** Update review of a book.
- **Request Body:**
```json
{
  "rating": 4,
  "comment": "Good book on finance, very good!"
}
```


### **Delete Review**

- **Endpoint:**`POST /api/books/reviews/68394a5d04df0e35134627c2/`
- **Description:** Delete review of a book.


### **Search a book**

- **Endpoint:**`POST /api/books/search?query=ashneer`
- **Description:** Searching book by title or author name.



---

### 🔄 2. **MongoDB Relationship Mermaid Diagram**

```markdown
## 🛠 MongoDB Entity Relationships 

    USERS {
        ObjectId _id
        String name
        String email
        String password
        Date createdAt
    }

    BOOKS {
        ObjectId _id
        String title
        String author
        String genre
        Date published
        Date createdAt
    }

    REVIEWS {
        ObjectId _id
        Number rating
        String comment
        ObjectId userId
        ObjectId bookId
        Date createdAt
    }


