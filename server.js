const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const path = require("path");
const connectDB = require("./src/config/db");
const authRoutes = require("./src/routes/authRoutes");
const propertyRoutes = require("./src/routes/propertyRoutes");
const { notFound, errorHandler } = require("./src/middleware/errorMiddleware");

dotenv.config();
connectDB && connectDB();

const app = express();

const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:5174",
  process.env.CLIENT_URL, 
].filter(Boolean);

app.use(
  cors({
    origin: allowedOrigins,
    credentials: false, 
  })
);

console.log("CORS allowed origins:", allowedOrigins);

app.use(express.json());

app.use("/public", express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => {
  res.json({ message: "BetaHouse API is running" });
});

app.use("/api/auth", authRoutes);
app.use("/api/properties", propertyRoutes);

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
