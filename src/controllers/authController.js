import bcrypt from "bcryptjs";
import { usuarios } from "../models/db.js";

// REGISTER
export const register = async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ message: "Faltan datos" });
  }

  const existe = usuarios.find(u => u.email === email);
  if (existe) {
    return res.status(400).json({ message: "Usuario ya existe" });
  }

  // 🔐 encriptar contraseña
  const hashedPassword = await bcrypt.hash(password, 10);

  const nuevo = {
    id: Date.now().toString(),
    name,
    email,
    password: hashedPassword
  };

  usuarios.push(nuevo);

  res.status(201).json({ message: "Usuario creado" });
};

// LOGIN
export const login = async (req, res) => {
  const { email, password } = req.body;

  const user = usuarios.find(u => u.email === email);

  if (!user) {
    return res.status(401).json({ message: "Usuario no encontrado" });
  }

  // 🔐 comparar contraseña
  const esValido = await bcrypt.compare(password, user.password);

  if (!esValido) {
    return res.status(401).json({ message: "Contraseña incorrecta" });
  }

  res.json({
    id: user.id,
    nombre: user.name,
    email: user.email
  });
};