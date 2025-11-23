const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./src/config/db");
const authRoutes = require("./src/routes/authRoutes");
const propertyRoutes = require("./src/routes/propertyRoutes");
const { notFound, errorHandler } = require("./src/middleware/errorMiddleware");

dotenv.config();
connectDB && connectDB();

const app = express();

app.use(
  cors({
    origin: ["http://localhost:5173", "http://localhost:5174"],
    credentials: false, 
  })
);

console.log(
  "CORS allowed origins: http://localhost:5173, http://localhost:5174"
);

app.use(express.json());

app.use("/public", express.static("public"));


app.get("/", (req, res) => {
  res.json({ message: "BetaHouse API is running" });
});

// ROUTES
app.use("/api/auth", authRoutes);
app.use("/api/properties", propertyRoutes);

// ERROR HANDLERS
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
