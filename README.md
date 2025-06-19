# AuthBackend

Authentication backend built with Node.js, Express, and Prisma. 
---
## Features

- User registration with validation and password hashing (bcrypt)  
- User login with JWT token generation and session storage  
- Middleware for token verification and session expiry check  
- Logout functionality with session deletion and activity logging  
- Rate limiting on registration, login, and logout routes 
- Prisma ORM for database interaction  

---

## Tech Stack

- Node.js  
- Express.js  
- Prisma ORM  
- PostgreSQL
- bcrypt for password hashing  
- jsonwebtoken (JWT) for authentication tokens  
- express-rate-limit for rate limiting  
- Jest for some unit tests
- REST Client for testing APIs endpoints by sending HTTP requests   

---

## To Add

- Token Refresh so that force logouts arent needed
- Role Based Acces Control
- Tests for onAccess, Logout and tokenverification
