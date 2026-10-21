# Architecture Review and Project Walkthrough

## Summary

This project has a solid Clean Architecture foundation for a small backend. Responsibilities are separated into presentation, application, domain, and infrastructure layers, and the dependency direction is mostly correct. It is more accurate to describe it as **Clean Architecture inspired** than to claim it is a complete or exemplary implementation of every SOLID principle.

The recent shared repository work is in place: application repository interfaces inherit `IRepository<TEntity>`, and Mongo repositories inherit common create/update behavior from `MongoBaseRepository`. The user repository provides its own update-operations mapper so `$unset` behavior is retained.

The TypeScript build completed successfully during this review. This is a structural/code review, not a complete correctness or production-readiness audit.

## How a request moves through the code

```text
HTTP request
  -> Express route and Zod validation          presentation
  -> controller                                presentation
  -> use case                                  application
  -> repository/service interface              application boundary
  -> Mongo/email/JWT/password implementation   infrastructure
  -> mapper converts Mongo document <-> entity infrastructure
  -> result returns through controller as HTTP response
```

For example, login is routed and validated in `presentation/auth`, handled by `LoginUseCase`, and uses `IUserRepository`, `IPasswordService`, and `ITokenService`. The dependency container connects those interfaces to Mongo, Argon2, and JWT implementations.

## What is working well

- **Layer separation:** HTTP concerns live in `presentation`; workflows live in `application`; business-shaped entities live in `domain`; MongoDB and external services live in `infrastructure`.
- **Dependency direction:** use cases depend on repository and service interfaces, rather than importing Mongo models or concrete infrastructure services.
- **Persistence mapping:** infrastructure mappers translate between Mongo documents and domain entities, preventing Mongoose documents from becoming the application's domain model.
- **Dependency injection:** `DI/container.ts` constructs concrete services and repositories and supplies them to use cases.
- **Focused ports:** repositories expose domain-oriented queries such as `findByEmail` and `findByUserId`. The admin pagination query has its own interface instead of adding admin-specific behavior to every user consumer.
- **Runtime input checks:** Zod schemas validate request bodies at the presentation boundary.
- **Shared repository behavior:** common persistence writes are reused while the user mapper retains its special unset semantics.

## Main gaps and improvements

### High priority

1. **Recruiter registration is a multi-write workflow without a transaction.** It creates a user, company/profile, and verification request in sequence. A later failure can leave earlier records behind. Consider a Mongo session/transaction or an explicit compensation/retry design.
2. **Admin role validation happens after the general login use case has issued tokens and persisted a refresh-token hash.** A non-admin using the admin login route can cause a refresh-token hash to be stored before receiving 403. Put the role requirement into an admin-specific authentication use case or pass an authorization policy into the application flow before issuing/persisting tokens.
3. **`AppError` carries HTTP status codes in the application layer.** This couples use cases to HTTP. A cleaner boundary is application/domain errors with codes, translated to status codes in presentation middleware.

### Worth improving as the API grows

- **Controllers have several responsibilities per file.** `auth.controller.ts` handles registration, sessions, email verification, and password reset. It is acceptable at this project size; split by workflow/resource when it becomes difficult to navigate.
- **Success response shapes are not a single envelope.** Error responses share `{ success, message, error }`, but success payloads vary. Decide whether that variation is intentional; if you need a common contract, define it in presentation and keep endpoint-specific `data` shapes.
- **DTOs and validators can drift.** DTO interfaces describe compile-time data, while Zod schemas validate runtime input. Derive request types from schemas (for example, `z.infer<typeof loginSchema>`) or otherwise make their relationship explicit.
- **`MongoBaseRepository` uses `as never` casts to bridge Mongoose's generic update/create types.** This compiles, but it suppresses type checking at the persistence boundary. Treat these casts as a known compromise; consider tightening generic types or hiding the casts in a narrow, documented adapter.
- **Pagination validation is embedded in the admin controller.** A query schema/middleware would make validation consistent with body validation and keep the controller focused on HTTP translation.
- **Testing is not represented in the package scripts or the inspected tree.** Unit tests for use cases and mapper/repository integration tests would give confidence in behavior beyond compilation.

## SOLID, in terms of this code

### S — Single Responsibility Principle

Each use case represents one workflow, each mapper handles a persistence conversion, and each repository handles a resource's persistence queries. This is a good start. The auth controller and DI container are broader files, but composition files and small controllers can reasonably coordinate several related actions.

### O — Open/Closed Principle

Use cases can work with another repository or service implementation as long as it honors the interface. For example, `LoginUseCase` could use an in-memory `IUserRepository` in a test or another database adapter without changing its login rules.

### L — Liskov Substitution Principle

This means implementations should be usable anywhere their interface/base class is expected without changing the expected behavior. The Mongo repositories implement the application contracts. The principle is supported by the design, but it is confirmed by behavioral tests, not just class declarations.

### I — Interface Segregation Principle

Interfaces are reasonably focused: `IAdminUserQueryRepository` isolates paginated admin listing from the everyday user repository contract, and password, token, and email concerns have separate service interfaces. `IRepository<TEntity>` is intentionally small and includes only create/update operations common to all current repositories.

### D — Dependency Inversion Principle

High-level use cases depend on abstractions such as `IUserRepository` and `ITokenService`; `DI/container.ts` supplies concrete Mongo/JWT implementations. This is one of the clearest SOLID strengths in the project. The HTTP-oriented `AppError` is a small exception to the separation.

## OOP concepts demonstrated

- **Classes and objects:** `LoginUseCase`, `User`, and `MongoUserRepository` define behavior/state; the container creates instances.
- **Encapsulation:** the use case owns login decisions, while the repository hides Mongo queries and mappers hide document conversion details.
- **Abstraction:** interfaces such as `IUserRepository` expose needed behavior without exposing Mongoose.
- **Polymorphism:** a use case can receive different implementations of the same repository/service interface.
- **Inheritance:** Mongo repositories inherit shared writes from `MongoBaseRepository`. This is used for technical code reuse; resource-specific lookups remain in each concrete repository.
- **Composition:** use cases are assembled from repository and service dependencies. This is the primary reuse mechanism and keeps business workflows configurable.

## A short explanation you can give someone

> “I organized the backend into four layers. The presentation layer handles HTTP routes, validation, and responses. The application layer contains use cases and depends on interfaces for persistence and external services. The domain layer holds the main business entities and types. The infrastructure layer implements those interfaces with MongoDB, JWT, email, and password hashing, using mappers at the database boundary. The DI container wires the pieces together. This keeps business workflows from depending directly on Express or Mongoose, makes implementations replaceable, and makes use cases easier to test. I also use a small generic repository contract and Mongo base class for shared create/update behavior, while allowing special cases like the user `$unset` update to provide their own mapper.”

If asked whether it fully follows Clean Architecture/SOLID, say:

> “It follows the main dependency and separation ideas, but it is still evolving. I would improve transaction handling for multi-record workflows, move HTTP status mapping out of application errors, and add behavioral tests to verify the repository implementations and use cases.”

## Useful files to walk through

1. `src/presentation/auth/routes/auth.routes.ts` — route composition and request validation.
2. `src/presentation/auth/controllers/auth.controller.ts` — HTTP-to-use-case translation.
3. `src/application/use-cases/auth/login.use-case.ts` — business workflow using abstractions.
4. `src/application/interfaces/repositories/user.repository.ts` — application-owned persistence contract.
5. `src/infrastructure/repositories/mongo-user.repository.ts` — Mongo adapter and resource queries.
6. `src/infrastructure/mappers/user.mapper.ts` — persistence/domain conversion, including `$set`/`$unset` rules.
7. `src/DI/container.ts` — dependency composition root.
