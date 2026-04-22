import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import fondo from "../assets/regis.jpg"; // usa tu imagen

function Register() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    acceptTerms: false,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleRegister = async (e) => {
  e.preventDefault();

  if (!formData.name || !formData.email || !formData.password) {
    alert("Completa todos los campos");
    return;
  }

  if (!formData.acceptTerms) {
    alert("Debes aceptar los términos");
    return;
  }

  setLoading(true);

  try {
    const res = await fetch("http://localhost:3000/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: formData.name.trim(),   // 🔥 IMPORTANTE
        email: formData.email.trim(),
        password: formData.password.trim(),
      }),
    });

    const data = await res.json();

    if (res.status === 201) {
      alert("Usuario registrado correctamente");
      navigate("/"); // vuelve al login
    } else {
      alert(data.message || "Error al registrar");
    }
  } catch (error) {
    console.error(error);
    alert("No se pudo conectar al servidor");
  }
  finally {
  setLoading(false);
}
};

  return (
    <div
      className="min-h-screen flex items-center justify-center relative"
      style={{
        backgroundImage: `url(${fondo})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* OVERLAY */}
      <div className="absolute inset-0 bg-black/70"></div>

      {/* CARD */}
      <div className="relative z-10 w-full max-w-md bg-slate-800/70 backdrop-blur-lg p-8 rounded-2xl shadow-xl border border-white/20">

        <h2 className="text-3xl font-bold text-white text-center mb-8">
          Crear cuenta
        </h2>

        <form onSubmit={handleRegister} className="space-y-5">

          <input
            name="name"
            type="text"
            placeholder="Nombre"
            value={formData.name}
            onChange={handleChange}
            className="w-full bg-slate-700/60 border border-slate-500 text-white p-3 rounded focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />

          <input
            name="email"
            type="email"
            placeholder="Correo"
            value={formData.email}
            onChange={handleChange}
            className="w-full bg-slate-700/60 border border-slate-500 text-white p-3 rounded focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />

          <input
            name="password"
            type="password"
            placeholder="Contraseña"
            value={formData.password}
            onChange={handleChange}
            className="w-full bg-slate-700/60 border border-slate-500 text-white p-3 rounded focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />

          <div className="flex items-center text-sm text-white/80">
            <input
              type="checkbox"
              name="acceptTerms"
              checked={formData.acceptTerms}
              onChange={handleChange}
              className="mr-3 accent-emerald-500"
            />
            Acepto términos y condiciones
          </div>

          <button
          type="submit"
          disabled={loading}
          className="w-full bg-emerald-500 hover:bg-emerald-600 disabled:opacity-50 text-white p-3 rounded-lg transition"
        >
          {loading ? "Creando cuenta..." : "Crear cuenta"}
        </button>
        </form>

        <p className="text-sm text-white/70 text-center mt-6">
          ¿Ya tienes cuenta?{" "}
          <Link to="/" className="text-emerald-400 hover:underline">
            Inicia sesión
          </Link>
        </p>

      </div>
    </div>
  );
}

export default Register;