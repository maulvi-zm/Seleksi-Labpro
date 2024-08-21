<p align="center">
 <img src="./public/assets/logo.png" width="200" alt="StreamVibe Logo" />
</p>

<p align="center">A modern streaming platform for your favorite movies and TV shows.</p>

## Description

StreamVibe is a cutting-edge movie streaming platform built with modern technologies to provide a seamless viewing experience.

## Developer Information

<div align="center">

| **Name**                | **NIM**  |
| ----------------------- | -------- |
| Maulvi Ziadinda Maulana | 13522122 |

</div>

## Running the App

1. Initialize Docker

```bash
# Change directory to dockerfiles
$ cd docker

# Build docker image
$ docker compose build -d -V --build
```

2. Migrate database

```bash
# Find docker image name/id
$ docker ps

# Run the migration command
$ docker exec -it <container_id_or_name> npx prisma migrate reset --force
```

## Test

```bash
# Unit tests
$ npm run test
```

## Design Pattern

For a detailed explanation about the design pattern, please refer to [design pattern explanation](/docs/design-pattern.md)

## Technology Stack

- NestJs (10.3.10)
- Swagger (5.0.1)
- Ejs (3.1.10)
- Prisma (5.17.0)
- Jest (29.5.0)
- Tailwind CSS (3.4.7)
- Redis (3.1.2)
- Postgresql (16.4)

## Endpoints

For a detailed explanation about the endpoints, please refer to <a>API documentation</a>.

## Bonus

| **Feature Code** | **Feature Description**                                                                                                                  | **Explanation**                              |
| ---------------- | ---------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------- |
| B01              | **OWASP**: Implement and demonstrate that your website is secure against 3 of the top 10 OWASP vulnerabilities of 2021.                  | [OWASP Security](/docs/bonus/b1.md)          |
| B02              | **Deployment**: Deploy the monorepo and database. Include the deployment link in the README.                                             | [Deployment](/docs/bonus/b2.md)              |
| B03              | **Polling**: Implement a polling system that updates the user's view without page reload/refresh after an admin adds a film.             | [Polling System](/docs/bonus/b3.md)          |
| B04              | **Caching**: Implement Redis caching for the most accessed database endpoint. Provide testing instructions in the README.                | [Caching with Redis](/docs/bonus/b4.md)      |
| B05              | **Lighthouse**: Run Google Lighthouse audits for frontend pages and improve the code to achieve a minimum score of 95 in each category.  | [Google Lighthouse Audit](/docs/bonus/b5.md) |
| B06              | **Responsive Layout**: Ensure all frontend pages are responsive and adapt to different screen sizes.                                     | [Responsive Layout](/docs/bonus/b6.md)       |
| B07              | **API Documentation**: Document the API for single service and monolith backend using Swagger. Include the link in the README.           | [API Documentation](/docs/bonus/b7.md)       |
| B08              | **SOLID Principles**: Apply SOLID principles to the backend or REST API. Explain how these principles were applied in the README.        | [SOLID Principles](/docs/bonus/b8.md)        |
| B09              | **Automated Testing**: Create unit or end-to-end tests covering at least 60% of the codebase. Include the coverage report in the README. | [Automated Testing](/docs/bonus/b9.md)       |
| B10              | **Additional Features**: Implement up to 3 additional features such as Film Recommendations, Rating + Review, Wishlist.                  | [Additional Features](/docs/bonus/b10.md)    |
| B11              | **Ember**: Use a bucket for storing uploaded films, separate from the source code server. It is recommended to use Cloudflare R2.        | [Ember Implementation](/docs/bonus/b11.md)   |

## Figma UI Template

This project uses a UI template from the Figma community made by Praha. You can find the template [here](https://www.figma.com/community/file/1294589591426976269/ott-dark-theme-website-ui-design-template-for-media-streaming-movies-and-tv-free-editable)

## Support

StreamVibe is an open-source project. It can grow thanks to sponsors and support by amazing backers. If you'd like to join them, please read more here.

## Stay in touch

Author - Maulvi
Website - https://maulvi-zm.me

## License

StreamVibe is MIT licensed.
