**KaRima restaurant API**

WEB Technologies 2 – Assignment 4
Teacher: Samat Tankeyev
Made by Alpamys Abylaikhan

This project is a secure RESTful backend API built with Node.js, Express, MongoDB (Atlas), and Mongoose using a professional MVC (Model–View–Controller) architecture.

It implements:

- Modular MVC structure
- Two related objects with full CRUD
- Authentication with JWT
- Password hashing with bcrypt
- Role-Based Access Control (RBAC)
- Public + Protected + Admin routes

**Project Architecture (MVC)**

The project is structured using the MVC pattern for scalability and maintainability.

Assignment8/

- controllers/   → business logic
- models/        → MongoDB schemas
- routes/        → API endpoints
- middleware/    → auth + error handling
- config/        → database connection
- public/        → frontend static files
- server.js      → server startup
- app.js         → express app config
- .env

**Objects (Database Models)**
- Primary Object — MenuItem

Represents food items available in the restaurant.
Fields:

1)name
2)description
3)price
4)category

CRUD:

Create
Read
Update
Delete

- Secondary Object — Reservation

Represents table reservations made by customers.
Fields:

1)name
2)phone
3)date
4)time
5)guests

*selectedItems → references MenuItem (relationship)*

Relationship

Each reservation can reference multiple MenuItems using MongoDB ObjectIds.

This creates:

Reservation → MenuItem (one-to-many)

**Authentication & Security**
User Model:

Each user has:

- email
- password (hashed with bcrypt)
- role ("user" or "admin")

!Password Hashing!

Passwords are never stored in plain text.Before saving:

bcrypt.hash(password)

**JWT Authentication**

After login/register:

server returns JWT token

token must be sent in header:

Authorization: Bearer <token>

**Role-Based Access Control (RBAC)**

POST, PUT and DELETE methods can be used by Admin only. 
GET can be used by everyone

Rules:
No token → 401 Unauthorized
User token → 403 Forbidden
Admin token → Success

**API Endpoints**
Auth
POST /api/auth/register
POST /api/auth/login

Menu
GET    /api/menu
GET    /api/menu/:id
POST   /api/menu       (admin)
PUT    /api/menu/:id   (admin)
DELETE /api/menu/:id   (admin)

Reservations
GET    /api/reservations
GET    /api/reservations/:id
POST   /api/reservations       (admin)
PUT    /api/reservations/:id   (admin)
DELETE /api/reservations/:id   (admin)

**Setup Instructions**
1. Install dependencies
npm install

2. Create .env

Create .env file:

PORT=5000
MONGO_URI=mongodb+srv://USERNAME:PASSWORD@cluster.mongodb.net/karima
JWT_SECRET=your_secret_key
JWT_EXPIRES=7d

3. Start server
node server.js


Server runs at:

http://localhost:5000

**Frontend**

Static frontend is served from:

public/

Open:

http://localhost:5000

Creating a USER using POSTMAN:
![CREATE USER](image.png)

LOGIN a USER using POSTMAN:
![LOGIN USER](image-1.png)

Output menu items using POSTMAN:
![GET MENU](image-2.png)

POST menu with no token:
![POST without token](image-3.png)

POST menu with user token:
![POST with user token](image-4.png)

POST menu with admin token:
![POST with admin token](image-5.png)

UPDATE with user token:
![UPDATE with user token](image-6.png)

UPDATE with admin token:
![UPDATE with admin token](image-7.png)

DELETE with admin token:
![DELETE with admin token](image-8.png)

