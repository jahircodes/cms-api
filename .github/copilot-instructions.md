Follow Clean Architecture with Dependency Injection and Factory Pattern.

Tech Stack:

- Node.js
- Express
- Prisma ORM
- Joi validation

Architecture Rules:

1. Repository Layer:

- Use factory function: create<Entity>Repository({ prisma })
- Extend BaseRepository where applicable
- Contain ONLY database logic
- No business logic
- No HTTP logic
- No Express usage
- No direct response handling

2. Service Layer:

- Use factory function: create<Entity>Service({ entityRepository })
- Inject repository via dependency injection
- Contain ONLY business logic
- Throw ApiError for all operational errors
- Never use Prisma directly
- Never use Express (req, res)
- Keep logic clean and testable

3. Controller Layer:

- Use builder function: build<Entity>Controller({ entityService })
- Handle ONLY HTTP logic (req, res)
- Use sendSuccess() for all successful responses
- Do not implement business logic
- Do not access database directly

4. Router Layer:

- Use builder function: build<Entity>Router({ entityController })
- Apply Joi validation middleware
- No business logic
- No database access

5. Error Handling:

- Use centralized ApiError class
- Use global errorHandler middleware
- Do not expose internal errors
- Use consistent error response structure

6. Code Quality Standards:

- Use async/await
- Use early returns
- Avoid deep nesting
- Follow SOLID principles
- Avoid duplication
- Use clear, descriptive naming
- Write scalable, modular, maintainable code
- No commented-out dead code
- No console.log in production code

7. Professional Commenting Standards:

- Do NOT comment obvious code.
- Do NOT explain what the code does line-by-line.
- Comment WHY something exists, not WHAT it does.
- Add a top-level file description for each module.
- Use JSDoc for all public functions and factory builders.
- Add comments only for:
  - Complex business logic
  - Security decisions
  - Non-obvious implementation choices
  - Architectural decisions

Example file header:

/\*\*

- Auth Service
- ***
- Handles authentication business logic.
- Uses dependency injection for testability.
- Does NOT handle HTTP or direct database access.
  \*/

Example factory documentation:

/\*\*

- Factory function for Auth Service.
- Injects dependencies to keep module decoupled and testable.
  \*/

Example business logic comment:

// Prevent user enumeration attack by returning generic error

Do NOT write unnecessary comments like:

- "Import express"
- "Call service"
- "Return response"
- "Loop through array"

Write clean, production-ready, enterprise-level code.
