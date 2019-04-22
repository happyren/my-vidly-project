## Node.js Express vidly project

This is my Node.js - Express RESTful API _vidly project_, it is a proof of my node.js and RESTful API experience and skill.

Unit testing and Integration testing are provided, and I will continue increase the test coverage.

## Current endpoints

By running this project, you would have following endpoints available:

- "/api/users":
  - "GET /me" would return user details about current user (**user** is different from **customer** in this project).
  - "POST /" allows to register a new user.
- "/api/auth":
  - "POST /" allows authentication of current user and returns a proper JWT (Json Web Token).
- "/api/customers":
  - "GET /" returns the list of all customers
  - "POST /" allows registration of a new customer
  - "PUT /:id" allows information update to an exist customer
  - "DELETE /:id" allows deletion of an exist customer
  - "GET /:id" allows information retrivel on an exist customer
- "/api/genres":
  - "GET /" returns the list of all genres
  - "POST /" allows create a new genres
  - "PUT /:id" allows information update to an exist genres
  - "DELETE /:id" allows deletion of an exist genres
  - "GET /:id" allows information retrivel on an exist genres
- "/api/movies":
  - "GET /" returns the list of all movies
  - "POST /" allows stock in a new movies
  - "PUT /:id" allows information update to an exist movies
  - "DELETE /:id" allows deletion of an exist movies
  - "GET /:id" allows information retrivel on an exist movies
- "/api/rentals":
  - "GET /" returns the list of all rental records
  - "POST /" allows adding a new rental
  - "GET /:id" allows retrival of a rental record
- "/api/returns":
  - "POST /" allows a rented movie to be returned with given customerId and movieId.

## Database of choice

Database of choice is MongoDB for its versitility. However, I also have SQL experience with Relational Database: eg. MySQL, Postgresql.

## Testing framework of choice

JEST is used in for both unit testing and integration testing for its simplicity and practicality.

## Web framework of choice

Express is used since it is one of the most popular one with great performance.

## Current Test Coverage

![Current Test Coverage](/currentCoverage.png)