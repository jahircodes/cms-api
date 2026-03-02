# Modular Backend

Modular Express.js backend with auth and user domains, Prisma ORM (MySQL), and JWT authentication.

## Prerequisites

- Node.js 18+
- MySQL 8+

## Setup

1. **Install dependencies:**

   ```sh
   npm install
   ```

2. **Configure environment — create a `.env` file** in the project root (see `.env` for the template):

   ```env
   DATABASE_URL="mysql://USER:PASSWORD@localhost:3306/DATABASE"
   JWT_SECRET=your-secret-here
   ```

   URL-encode special characters in passwords (e.g. `$` → `%24`).

3. **Create your MySQL database**, then generate the Prisma client and run migrations:

   ```sh
   npm run prisma:generate
   npm run prisma:migrate -- --name init
   ```

4. **Start the server:**
   ```sh
   npm run dev
   ```

## Scripts

| Script                    | Description                       |
| ------------------------- | --------------------------------- |
| `npm run dev`             | Start with nodemon (watch mode)   |
| `npm start`               | Start in production mode          |
| `npm run lint`            | Lint source files with ESLint     |
| `npm run format`          | Format source files with Prettier |
| `npm run prisma:generate` | Generate Prisma client            |
| `npm run prisma:migrate`  | Run database migrations           |
| `npm run prisma:studio`   | Open Prisma Studio                |

## API Routes

| Method | Path                 | Auth | Description            |
| ------ | -------------------- | ---- | ---------------------- |
| GET    | `/api`               | No   | Health check / welcome |
| POST   | `/api/auth/register` | No   | Register a new user    |
| POST   | `/api/auth/login`    | No   | Login and receive JWT  |
| GET    | `/api/users`         | JWT  | List users             |
| GET    | `/api/users/:id`     | JWT  | Get user by ID         |
| PATCH  | `/api/users/:id`     | JWT  | Update user            |
| DELETE | `/api/users/:id`     | JWT  | Delete user            |

## Project Structure

```
prisma/
  schema.prisma          # MySQL datasource + User model
src/
  app.js                 # Express app wiring (middlewares + routes)
  server.js              # HTTP server bootstrap
  config/
    env.js               # Environment variable loader
    logger.js            # Pino logger instance
  database/
    prismaClient.js      # Singleton Prisma client
  middlewares/
    auth.middleware.js   # JWT verification
    error.middleware.js  # Global error handler
    rateLimit.middleware.js
    requestId.middleware.js
  modules/
    auth/
      auth.controller.js
      auth.repository.js
      auth.routes.js
      auth.service.js
      auth.validator.js  # Joi schemas
    user/
      user.controller.js
      user.repository.js
      user.routes.js
      user.service.js
      user.validator.js  # Joi schemas
  shared/
    ApiError.js          # Custom error class
    BaseRepository.js    # Generic CRUD base
    BaseService.js       # Generic service base
  utils/
    hash.js              # bcrypt helpers
    response.js          # Standardized response helpers
    retry.js             # Async retry wrapper
    token.js             # JWT sign / verify helpers
eslint.config.cjs
prisma.config.js
package.json
```

## Notes

- `.env` is git-ignored — never commit it.
- All protected routes require an `Authorization: Bearer <token>` header.
- Passwords are hashed with bcrypt before storage.
- HTTP request logging and app logging are unified under **Pino** via `pino-http`. Log level is driven by status code: `info` (2xx), `warn` (4xx), `error` (5xx). Example output:
  ```
  INFO: GET /api 200 - 5ms
  WARN: GET /api/unknown 404 - Route not found - 1ms
  ```
- After cloning for a new project: update secrets/DSNs, run `npm install`, then `npm run prisma:generate` and `npm run prisma:migrate -- --name init`.
