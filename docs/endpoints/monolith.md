<nav>
  <a href="/README.md">Home</a>
  <a href="/docs/endpoints.md">Back</a>
</nav>

## Monolithic Endpoints

### GET `/`

| **Description** | Render the homepage.             |
| --------------- | -------------------------------- |
| **Request**     |                                  |
| **Response**    | `{ "isAuthenticated": boolean }` |

---

### GET `/login`

| **Description** | Render login page or redirect to homepage if user is already logged in.                      |
| --------------- | -------------------------------------------------------------------------------------------- |
| **Request**     |                                                                                              |
| **Response**    | `{ "status": "success", "message": "You are not logged in", "data": {} }` or redirect to `/` |

---

### GET `/logout`

| **Description** | Logout the user by clearing the authentication token and redirect to login page. |
| --------------- | -------------------------------------------------------------------------------- |
| **Request**     | **Header**: `Authorization: Bearer <token>`                                      |
| **Response**    | Redirects to `/login`                                                            |

---

### GET `/register`

| **Description** | Render registration page.        |
| --------------- | -------------------------------- |
| **Request**     |                                  |
| **Response**    | `{ "scripts": ["register.js"] }` |

---

### POST `/login`

| **Description** | Authenticate user and set token cookie.                                                            |
| --------------- | -------------------------------------------------------------------------------------------------- |
| **Request**     | **Body**: `{ "username": "string", "password": "string" }`                                         |
| **Response**    | Redirects to `/` if authentication is successful, otherwise renders login page with error message. |

---

### POST `/register`

| **Description** | Register a new user and redirect to login page.                               |
| --------------- | ----------------------------------------------------------------------------- |
| **Request**     | **Body**: `{ "username": "string", "email": "string", "password": "string" }` |
| **Response**    | Redirects to `/login`                                                         |

---

### GET `/films`

| **Description** | Get a list of all films with pagination.                                                 |
| --------------- | ---------------------------------------------------------------------------------------- |
| **Request**     | **Query**: `q` (string, optional), `page` (number, optional), `limit` (number, optional) |
| **Response**    | `{ "isAuthenticated": boolean, "films": Array, "scripts": ["films.js"] }`                |

---

### GET `/my-films`

| **Description** | Get the user's films with pagination.                                                                                                 |
| --------------- | ------------------------------------------------------------------------------------------------------------------------------------- |
| **Request**     | **Header**: `Authorization: Bearer <token>`, **Query**: `q` (string, optional), `page` (number, optional), `limit` (number, optional) |
| **Response**    | `{ "recommendations": Array, "films": Array, "scripts": ["films.js"] }`                                                               |

---

### GET `/wishlist`

| **Description** | Get the user's wishlist with pagination.                                                                                              |
| --------------- | ------------------------------------------------------------------------------------------------------------------------------------- |
| **Request**     | **Header**: `Authorization: Bearer <token>`, **Query**: `q` (string, optional), `page` (number, optional), `limit` (number, optional) |
| **Response**    | `{ "recommendations": Array, "films": Array, "scripts": ["films.js"] }`                                                               |

---

### GET `/films/:id`

| **Description** | Get details of a specific film.                                                                                                                     |
| --------------- | --------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Request**     | **Param**: `id` (string)                                                                                                                            |
| **Response**    | `{ "film": object, "reviews": Array, "isPurchased": boolean, "isWishlisted": boolean, "isAuthenticated": boolean, "scripts": ["film-details.js"] }` |

---

### GET `/films/:id/watch`

| **Description** | Render page to watch a film if purchased.                               |
| --------------- | ----------------------------------------------------------------------- |
| **Request**     | **Param**: `id` (string), **Header**: `Authorization: Bearer <token>`   |
| **Response**    | `{ "video_url": string }` if film is purchased; otherwise, no response. |

---

### GET `/user-info`

| **Description** | Get authenticated user information.         |
| --------------- | ------------------------------------------- |
| **Request**     | **Header**: `Authorization: Bearer <token>` |
| **Response**    | `{ "balance": number, "username": string }` |

---
