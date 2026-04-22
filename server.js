import express from "express";
import cors from "cors";

import authRoutes from "./src/routes/authRoutes.js";
import progresoRoutes from "./src/routes/progresoRoutes.js";

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("API FITIO funcionando 🚀");
});

app.use("/", authRoutes);
app.use("/", progresoRoutes);

app.listen(3000, () => {
  console.log("Servidor corriendo en http://localhost:3000");
});