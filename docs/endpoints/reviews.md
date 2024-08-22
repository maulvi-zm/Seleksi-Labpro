<nav>
  <a href="/README.md">Home</a>
  <a href="/docs/endpoints.md">Back</a>
</nav>

## Reviews

### POST `/reviews/:film_id`

| **Description** | Add a review to a specific film.                                                                                                                                                        |
| --------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Request**     |                                                                                                                                                                                         |
| **Header**      | `Authorization: Bearer <token>`                                                                                                                                                         |
| **Body**        | `{ "rating": "number", "comment": "string" }`                                                                                                                                           |
| **Response**    | `{ "status": "success", "message": "Review added successfully", "data": { "review_id": "string", "film_id": "string", "user_id": "string", "rating": "number", "comment": "string" } }` |
| **Error**       | `{ "status": "error", "message": "Invalid request" }`                                                                                                                                   |

### GET `/reviews/:film_id`

| **Description** | Retrieve reviews of a specific film with pagination.                                                                                                                                             |
| --------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **Request**     |                                                                                                                                                                                                  |
| **Header**      | `Authorization: Bearer <token>`                                                                                                                                                                  |
| **Query**       | `{ "page": "number", "limit": "number" }`                                                                                                                                                        |
| **Response**    | `{ "status": "success", "message": "Reviews retrieved successfully", "data": [ { "review_id": "string", "film_id": "string", "user_id": "string", "rating": "number", "comment": "string" } ] }` |

### DELETE `/reviews/:id`

| **Description** | Delete a specific review by its ID.                                                                                                                                                       |
| --------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Request**     |                                                                                                                                                                                           |
| **Header**      | `Authorization: Bearer <token>`                                                                                                                                                           |
| **Response**    | `{ "status": "success", "message": "Review deleted successfully", "data": { "review_id": "string", "film_id": "string", "user_id": "string", "rating": "number", "comment": "string" } }` |
