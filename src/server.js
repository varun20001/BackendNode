import express from "express";
import dotenv from "dotenv";
import cors from "cors";
const app = express();
import inventoryRoutes from "./routes/inventory.routes.js";
dotenv.config({
  path: "./.env",
});
const port = 5000;
app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  })
);
app.use(express.json());
app.use(express.static("public/build"));

app.use("/api", inventoryRoutes);

app.listen(port, () => {
  console.log(`⚙️ Server is running at port : ${port}`);
});
