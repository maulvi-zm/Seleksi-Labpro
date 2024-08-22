<nav>
  <a href="/README.md">Home</a>
  <a href="/docs/endpoints.md">Back</a>
</nav>

## Authentication

### POST `/login`

| **Description** | Authenticate the user and obtain a token.                                                                                          |
| --------------- | ---------------------------------------------------------------------------------------------------------------------------------- |
| **Request**     |                                                                                                                                    |
| **Body**        | `{ "username": "string", "password": "string" }`                                                                                   |
| **Response**    | `{ "status": "success"                           \| "error", "message": string, "data": { "username": string, "token": string } }` |

### GET `/self`

| **Description** | Get the details of the authenticated user.                                                                                                         |
| --------------- | -------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Request**     |                                                                                                                                                    |
| **Header**      | `Authorization: Bearer <token>`                                                                                                                    |
| **Response**    | `{ "status": "success"                     \| "error, "message": "User retrieved successfully", "data": { "username": string, "token": string } }` |
