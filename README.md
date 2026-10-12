# Blog Management REST API

A REST API for a blog application with three access levels: **Admin**, **User** and **Guest**.
Built with **Node.js, Express, MySQL (Sequelize)** and **JWT** authentication.

> 📮 **Postman Documentation:** [https://documenter.getpostman.com/view/50581521/2sBYHRU1Wj](https://documenter.getpostman.com/view/50581521/2sBYHRU1Wj)
>
> 📦 **Postman Collection (JSON):** [Google Drive link](https://drive.google.com/file/d/1TViPxFOwMX-c9ixf6QirD2WcSA10XddX/view?usp=sharing) | [postman/blog-api.postman_collection.json](postman/blog-api.postman_collection.json)

## Features

- Register / login with JWT token authentication
- Passwords hashed with bcrypt, and never returned by any API
- Role-based authorization (Admin / User / Guest)
- Admin: list users, view a user, activate / deactivate users, edit or delete any blog
- User: manage own profile, password and blogs
- Guest: view blogs, search by title (partial match), filter by category
- Input validation with meaningful error messages and correct HTTP status codes

## Tech Stack

| Purpose        | Library              |
| -------------- | -------------------- |
| Server         | Express              |
| Database / ORM | MySQL + Sequelize    |
| Auth           | jsonwebtoken, bcryptjs |
| Config         | dotenv               |

## Project Structure

```
blog-api/
├── database/schema.sql        # Optional manual SQL for blogdb
├── postman/                   # Postman collection (import this)
├── scripts/seedAdmin.js       # Creates an admin user
└── src/
    ├── config/                # Environment config + DB connection
    ├── models/                # User and Blog models (+ relations)
    ├── routes/                # URL -> controller mapping
    ├── controllers/           # Request handling / business logic
    ├── middleware/            # auth, validation, error handling
    ├── validators/            # Request body validation rules
    ├── utils/                 # ApiError, asyncHandler, JWT helpers
    ├── app.js                 # Express app setup
    └── server.js              # Starts DB + server
```

## Getting Started

**Prerequisites:** Node.js 18+ and a running MySQL server.

```bash
# 1. Install dependencies
npm install

# 2. Create your env file and fill in your MySQL password + JWT secret
cp .env.example .env

# 3. Start the server (database "blogdb" and tables are created automatically)
npm run dev        # development (nodemon)
npm start          # production

# 4. Create an admin user (admin@example.com / password123)
npm run seed:admin
```

You can also create an admin manually:

```sql
UPDATE users SET role = 'admin' WHERE email = 'your@email.com';
```

## API Endpoints

| #  | Method | Endpoint                    | Access       | Purpose                          |
| -- | ------ | --------------------------- | ------------ | -------------------------------- |
| 1  | POST   | `/api/auth/register`        | Public       | Register a new user              |
| 2  | POST   | `/api/auth/login`           | Public       | Login and receive a token        |
| 3  | GET    | `/api/users`                | Admin        | Get all users                    |
| 4  | GET    | `/api/users/:id`            | Admin        | Get a specific user              |
| 5  | PATCH  | `/api/users/:id/status`     | Admin        | Activate / deactivate a user     |
| 6  | GET    | `/api/users/profile`        | User / Admin | Get own profile                  |
| 7  | PUT    | `/api/users/profile/update` | User / Admin | Update own profile               |
| 8  | PATCH  | `/api/users/password`       | User / Admin | Update own password              |
| 9  | POST   | `/api/blogs/create`         | User / Admin | Create a blog                    |
| 10 | GET    | `/api/blogs`                | Public       | List / search (`title`) / filter (`category`) |
| 11 | GET    | `/api/blogs/:id`            | Public       | Get a specific blog              |
| 12 | PUT    | `/api/blogs/update/:id`     | User / Admin | Update a blog (owner or admin)   |
| 13 | DELETE | `/api/blogs/delete/:id`     | User / Admin | Delete a blog (owner or admin)   |

`DELETE /api/blogs/:id` is also supported as an alias.

Protected routes need the header: `Authorization: Bearer <token>`

## Status Codes

| Code | Meaning                                                |
| ---- | ------------------------------------------------------ |
| 200  | Success                                                |
| 201  | Created (register, create blog)                        |
| 400  | Validation error / invalid ID                          |
| 401  | Missing or invalid token / wrong credentials           |
| 403  | Forbidden (wrong role, not blog owner, deactivated user) |
| 404  | User / blog / route not found                          |
| 409  | Duplicate email                                        |
| 500  | Internal server error                                  |

## Postman

- Documentation: [https://documenter.getpostman.com/view/50581521/2sBYHRU1Wj](https://documenter.getpostman.com/view/50581521/2sBYHRU1Wj)
- Collection file: [Google Drive link](https://drive.google.com/file/d/1TViPxFOwMX-c9ixf6QirD2WcSA10XddX/view?usp=sharing) | [postman/blog-api.postman_collection.json](postman/blog-api.postman_collection.json)

Import the collection and run the whole collection in the Runner. Every run registers fresh users, and tokens and IDs
are saved to collection variables automatically. One-time setup: create the Postman admin with
`ADMIN_EMAIL=postman.admin@example.com ADMIN_PASSWORD=Admin@12345 npm run seed:admin`
(or change the `adminEmail` / `adminPassword` collection variables to an existing admin).

## Environment Variables

See `.env.example`. **`.env` and `node_modules` are git-ignored.**
