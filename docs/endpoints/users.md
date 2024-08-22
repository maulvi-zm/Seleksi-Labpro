<nav>
  <a href="/README.md">Home</a>
  <a href="/docs/endpoints.md">Back</a>
</nav>

## User Management

### GET `/users`

| **Description** | Search for users by username.                                                                                                                                |
| --------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **Request**     |                                                                                                                                                              |
| **Header**      | `Authorization: Bearer <token>`                                                                                                                              |
| **Query**       | `{ "q": "string" }`                                                                                                                                          |
| **Response**    | `{ "status": "success" \| "error", "message": string, "data": [ { "id": "string", "username": "string", "email": "string", "balance": integer } ] \| null }` |

### GET `/users/:id`

| **Description** | Get details of a specific user by their ID.                                                                                                              |
| --------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Request**     |                                                                                                                                                          |
| **Header**      | `Authorization: Bearer <token>`                                                                                                                          |
| **Response**    | `{ "status": "success" \| "error", "message": string, "data": { "id": "string", "username": "string", "email": "string", "balance": integer } \| null }` |

### POST `/users/:id/balance`

| **Description** | Increment the balance of a user.                                                                                                                         |
| --------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Request**     |                                                                                                                                                          |
| **Header**      | `Authorization: Bearer <token>`                                                                                                                          |
| **Body**        | `{ "increment": integer }`                                                                                                                               |
| **Response**    | `{ "status": "success" \| "error", "message": string, "data": { "id": "string", "username": "string", "email": "string", "balance": integer } \| null }` |

### DELETE `/users/:id`

| **Description** | Delete a user by their ID.                                                                                                                               |
| --------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Request**     |                                                                                                                                                          |
| **Header**      | `Authorization: Bearer <token>`                                                                                                                          |
| **Response**    | `{ "status": "success" \| "error", "message": string, "data": { "id": "string", "username": "string", "email": "string", "balance": integer } \| null }` |
