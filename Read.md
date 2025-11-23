Backend README (Node.js + Express + MongoDB)
BetaHouse Backend
A RESTful API powering the BetaHouse real estate platform. Built with Express and MongoDB, providing authentication, property management, and search capabilities.
Tech Stack


Node.js


Express


MongoDB + Mongoose


JSON Web Tokens


bcrypt


dotenv


cors


Key Features


User registration and login


JWT-based authentication


Property listing and filtering


Sorting and search queries


Image serving from static folder


Universal CORS support


Database seeding for test properties


Project Structure
src/
  config/
    db.js
  models/
    Property.js
    User.js
  routes/
    authRoutes.js
    propertyRoutes.js
  middleware/
    errorMiddleware.js

seed.js
server.js

How It Works
The backend accepts universal origins for CORS. All property data is stored in MongoDB and accessed through Mongoose models. API routes handle search, sorting, and authentication. Static assets like property images are served from /public.
Setup
npm install
npm start

Environment
Create a .env with:
PORT=5000
MONGO_URI=your_connection_string
JWT_SECRET=your_secret_key
