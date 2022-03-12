# Order Service

The `Order Service` implements REST API for managing orders.
The service persists the `Order` entity in MySQL database.
Using `Transactional outbox pattern`, it publishes `Order`
domain events that are consumed by the `Customer Service`.