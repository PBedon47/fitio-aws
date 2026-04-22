import { progresos } from "../models/db.js";

export const guardarProgreso = (req, res) => {
  const { userId, peso } = req.body;

  progresos.push({
    userId,
    peso,
    fecha: new Date()
  });

  res.json({ message: "Progreso guardado" });
};

export const obtenerProgreso = (req, res) => {
  const data = progresos.filter(p => p.userId === req.params.userId);
  res.json(data);
};