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

For a detailed explanation about the design pattern, please refer to [design pattern explanation](/docs/design-pattern.md).

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

For a detailed explanation about the endpoints, please refer to [API documentation](/docs/endpoints.md).

## Bonus

For a detailed explanation about bonuses implemented, please refer to [Bonus Implementation](/docs/bonus.md).

## Figma UI Template

This project uses a UI template from the Figma community made by Praha. You can find the template [here](https://www.figma.com/community/file/1294589591426976269/ott-dark-theme-website-ui-design-template-for-media-streaming-movies-and-tv-free-editable).

## Support

StreamVibe is an open-source project. It can grow thanks to sponsors and support by amazing backers. If you'd like to join them, please read more here.

## Stay in touch

Author - Maulvi
Website - https://maulvi-zm.me

## License

StreamVibe is MIT licensed.
