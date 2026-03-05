Follow Clean Architecture using Dependency Injection and Factory Pattern.

Tech Stack:

- Node.js
- Express
- Prisma ORM
- Joi validation

---

## ARCHITECTURE RULES

1. Repository Layer:

- Use factory function: create<Entity>Repository({ prisma })
- Extend BaseRepository when applicable
- Contain ONLY database logic
- No business logic
- No HTTP logic
- No Express usage
- No response formatting

2. Service Layer:

- Use factory function: create<Entity>Service({ entityRepository })
- Inject repository via dependency injection
- Contain ONLY business logic
- Throw ApiError for operational errors
- Never use Prisma directly
- Never use Express (req, res)
- Keep logic testable and clean

3. Controller Layer:

- Use builder function: build<Entity>Controller({ entityService })
- Handle ONLY HTTP logic (req, res)
- Use sendSuccess() for successful responses
- No business logic
- No database access

4. Router Layer:

- Use builder function: build<Entity>Router({ entityController })
- Apply Joi validation middleware
- No business logic
- No database logic

5. Error Handling:

- Use centralized ApiError class
- Use global errorHandler middleware
- Do not expose internal errors
- Maintain consistent error structure

---

## CODE QUALITY STANDARDS

- Use async/await
- Use early returns
- Avoid deep nesting
- Follow SOLID principles
- Avoid duplication
- Use clear, descriptive naming
- No commented-out code
- No console.log in production
- Write scalable, modular, maintainable code

---

## DESTRUCTURING STANDARDS (MANDATORY)

1. Always destructure dependencies in factory functions:

Correct:
createUserService({ userRepository })

Incorrect:
createUserService(dependencies)

2. Destructure request data in controllers:

Correct:
const { name, email } = req.body
const { id } = req.params
const { page, limit } = req.query

Do NOT use:
req.body.name
req.params.id

3. Destructure service payloads early:

Correct:
async function register({ email, password }) {}

4. Destructure Prisma models when appropriate:

Correct:
const { user } = prisma

5. Avoid over-destructuring deeply nested objects if it reduces readability.

---

## PROFESSIONAL COMMENTING STANDARDS

- Do NOT comment obvious code.
- Do NOT explain what code does line-by-line.
- Comment WHY something exists, not WHAT it does.
- Add a top-level file description for each module.
- Use JSDoc for public functions and factory builders.
- Add comments only for:
  - Complex business logic
  - Security decisions
  - Non-obvious implementation choices
  - Architectural decisions

Example file header:

/\*\*

- User Service
- ***
- Handles user-related business logic.
- Uses dependency injection for decoupling and testability.
- Does NOT handle HTTP or database access directly.
  \*/

Example business comment:

// Prevent user enumeration attack by returning generic error

Do NOT write unnecessary comments like:

- "Import express"
- "Call service"
- "Return response"
- "Loop through array"

---

Generate clean, production-ready, enterprise-level code.
