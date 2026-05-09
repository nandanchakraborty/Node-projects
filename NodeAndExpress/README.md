# Node.js Blog Application

A full-stack blog web application built using Node.js, Express.js, MongoDB, and EJS.  
This project allows users/admins to create, read, update, and delete blog posts through a clean dashboard interface.

---

## Features

- Create blog posts
- Read all posts
- View single post
- Update existing posts
- Delete posts
- Admin dashboard
- Authentication middleware
- MongoDB database integration
- Responsive UI using EJS templates
- Search functionality
- MVC-like project structure

---

## Technologies Used

### Backend
- Node.js
- Express.js

### Frontend
- EJS
- CSS

### Database
- MongoDB
- Mongoose

### Authentication & Security
- bcrypt
- express-session
- cookie-parser

---

## Project Structure

```bash
project/
│
├── public/
│   ├── css/
│   ├── img/
│
├── server/
│   ├── config/
│   ├── models/
│   ├── routes/
│
├── views/
│   ├── admin/
│   ├── layouts/
│   ├── partials/
│
├── app.js
├── package.json
└── README.md