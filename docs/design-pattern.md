<nav>
  <a href="/README.md">Home</a>
</nav>

# Design Patterns Implemented

## 1. Strategy Pattern

The **Strategy Pattern** is implemented in the `StorageModule` to define multiple storage strategies, such as `LocalStorageService` and `CloudflareStorageService`. This pattern allows the application to choose a storage strategy dynamically at runtime based on the configuration (e.g., environment variable `STORAGE_TYPE`). By doing so, it provides flexibility in switching between different storage backends without altering the core logic of the application.

### Why Strategy Pattern?

Using the Strategy Pattern allows the application to be easily extendable and maintainable. If a new storage service needs to be added, it can be done without modifying the existing code. This separation of concerns ensures that the storage logic is decoupled from the business logic, enhancing the scalability of the application.

## 2. Builder Pattern

The **Builder Pattern** is implemented in the `RecommendationQueryBuilder` class. This pattern allows for constructing complex queries step by step, providing a flexible way to add or exclude genres, directors, or film IDs from the query. It also makes the code more readable and maintainable.

### Why Builder Pattern?

The Builder Pattern is particularly useful in scenarios where an object requires multiple steps to be constructed, and different configurations might be needed based on various conditions. It prevents the need for multiple constructors or extensive method overloading and ensures that the code remains clean and easy to understand.

## 3. Singleton Pattern

The **Singleton Pattern** is implemented by default in NestJS for services and modules, which ensures that a single instance of each service is created and shared across the entire application. This pattern is crucial for scenarios where centralized management of resources is required, such as configuration services, caching mechanisms, and database connections so that there only 1 database connection from the application.

### Why Singleton Pattern?

Using the Singleton Pattern helps in reducing memory usage by sharing a single instance of a service throughout the application. This pattern aligns well with the dependency injection model of NestJS, ensuring that the application is efficient and maintainable.
