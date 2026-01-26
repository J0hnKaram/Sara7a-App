🕵️ Sara7a App – Anonymous Messaging API

A secure anonymous messaging backend application inspired by Sara7a. The application allows users to receive anonymous messages through unique links without revealing the sender’s identity. Built with Node.js and Express, focusing on security, scalability, and clean modular architecture.

🚀 Features

User signup and login

JWT authentication with access & refresh tokens
 
Social login (Google)

Email confirmation using OTP

Forget and reset password flow

Anonymous message sending

Retrieve received messages

Profile and cover image upload

Freeze and restore user accounts

Rate limiting & security headers

Secure cloud-based file uploads

🛠️ Tech Stack

Backend: Node.js, Express.js (ES Modules), MongoDB, Mongoose
Authentication & Security: JWT, bcrypt, Helmet, express-rate-limit, Joi, dotenv
Media & Utilities: Multer, Cloudinary, Nodemailer, UUID & NanoID, Morgan, Chalk

🏗 Project Structure

The project follows a feature-based modular structure, where each feature contains its own routes and controllers:

├─ index.js                 # Application entry point
├─ db/                      # Database connection & models
├─ config/                  # Environment & app configuration
├─ middlewares/             # Authentication, validation, rate limiting
├─  modules/
│  ├─ auth/
│  │  ├─ auth.validation.js
│  │  ├─ auth.service.js
│  │  └─ auth.controller.js
│  ├─ user/
│  │  ├─ user.validation.js
│  │  ├─ user.service.js
│  │  └─ user.controller.js
│  └─ message/
│     ├─ message.validation.js
│     ├─ message.service.js
│     └─ message.controller.js
└─ utils/                   # Helper and utility functions


This keeps each feature self-contained, improving maintainability and scalability.

🔐 Authentication System

Users authenticate using JWT access tokens

Refresh tokens are used to generate new access tokens

OTP is used for email confirmation and password reset

Social login supported via Google OAuth

Protected routes require valid tokens

📡 API Documentation

Base URL:
http://ec2-13-62-174-108.eu-north-1.compute.amazonaws.com/api/v1

Authentication:
POST /auth/signup
POST /auth/login
POST /auth/social-login
POST /auth/logout
POST /auth/refresh-token
PATCH /auth/forget-password
PATCH /auth/reset-password
PATCH /auth/confirm-email

User:
GET /user
PATCH /user/update
PATCH /user/profile-image
PATCH /user/cover-image
DELETE /user/freeze-account
PATCH /user/{userId}/restore-account

Message:
POST /message/send/{receiverId}
GET /message/getAll-messages

The API follows RESTful principles and returns JSON responses with proper HTTP status codes.

🔐 Security

Password hashing using bcrypt

JWT-based authentication

Request validation using Joi

Rate limiting to prevent spam & brute-force attacks

Secure HTTP headers with Helmet

Sensitive data stored in environment variables

🚀 Installation & Run
git clone https://github.com/J0hnKaram/Sara7a-App
cd Sara7a-App
npm install
npm run dev

☁️ Deployment

The application is deployed on AWS EC2 and running in a production environment.

🔮 Future Improvements

Message reporting & moderation

Admin dashboard

Real-time notifications

Frontend integration

Analytics for messages and users

👨‍💻 Author

Developed by John Karam
