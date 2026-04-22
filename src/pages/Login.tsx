import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import fondo from "../assets/login.jpg";
import logo from "../assets/log.jpg";

// ICONOS
import { FaFacebookF, FaTwitter, FaInstagram, FaYoutube } from "react-icons/fa";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async () => {
  if (!email.trim() || !password.trim()) {
    alert("Completa todos los campos");
    return;
  }

  setLoading(true);

  try {
    const res = await fetch("http://localhost:3000/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: email.trim().toLowerCase(),
        password: password.trim(),
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      alert(data.message || "Error de login");
      return;
    }

    // ✅ EXTRAER NOMBRE DE FORMA SEGURA (IMPORTANTE)
    const nombre =
      data?.nombre ||
      data?.user?.nombre ||
      data?.usuario?.nombre ||
      data?.name;

    if (!nombre) {
      console.error("RESPUESTA BACKEND:", data);
      alert("El backend no devolvió el nombre del usuario");
      return;
    }

    // ✅ GUARDAR SEGURO
    localStorage.setItem("userId", data.id || "");
    localStorage.setItem("usuarioNombre", nombre);
    localStorage.setItem("usuarioEmail", data.email || "");

    navigate("/dashboard");

  } catch (error) {
    console.error(error);
    alert("No se pudo conectar al servidor");
  } finally {
    setLoading(false);
    setEmail("");
    setPassword("");
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
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/70"></div>

      {/* CONTENIDO */}
      <div className="relative z-10 w-full max-w-6xl flex">

        {/* IZQUIERDA */}
        <div className="hidden md:flex w-1/2 items-center justify-center px-12">
          <div className="text-white text-center max-w-lg">

            <h1 className="text-5xl font-extrabold mb-6 leading-tight">
              Tu momento es ahora
            </h1>

            <p className="text-gray-300 mb-8">
              El equilibrio perfecto entre entrenamiento de alto rendimiento
              y nutrición inteligente, diseñado para que superes tus límites
              y conquistes tu mejor versión cada día.
            </p>

            <div className="flex justify-center gap-5 text-xl">
              <FaFacebookF className="hover:text-emerald-400 cursor-pointer transition" />
              <FaTwitter className="hover:text-emerald-400 cursor-pointer transition" />
              <FaInstagram className="hover:text-emerald-400 cursor-pointer transition" />
              <FaYoutube className="hover:text-emerald-400 cursor-pointer transition" />
            </div>

          </div>
        </div>

        {/* DERECHA */}
        <div className="w-full md:w-1/2 flex items-center justify-center">
          <div className="w-full max-w-md bg-slate-700/60 backdrop-blur-lg p-8 rounded-2xl shadow-xl border border-white/20">

          <div className="flex flex-col items-center mb-8">
            <img
              src={logo}
              alt="FITIO Logo"
              className="w-14 h-14 object-contain rounded-xl shadow-lg mb-4"
            />

            <h2 className="text-3xl font-semibold text-white tracking-wide">
              Iniciar sesión
            </h2>
          </div>

            {/* EMAIL */}
            <input
            type="email"
            placeholder="Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full bg-slate-600/60 border border-slate-500 text-white p-3 mb-4 rounded focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />

            {/* PASSWORD */}
            <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full bg-slate-600/60 border border-slate-500 text-white p-3 mb-4 rounded focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />

            {/* CHECKBOX */}
            <div className="flex items-center mb-4 text-sm text-white/80">
              <input type="checkbox" className="mr-3" />
              Mantener sesión iniciada
            </div>

            {/* BOTÓN */}
            <button
              onClick={handleLogin}
              disabled={loading}
              className="w-full bg-emerald-500 hover:bg-emerald-600 disabled:opacity-50 text-white p-3 rounded-lg transition shadow-lg shadow-emerald-500/30"
            >
              {loading ? "Cargando..." : "¡Empezar ahora!"}
            </button>

            {/* LINKS */}
            <p className="text-sm text-white/70 mt-4">
              Recuperar contraseña
            </p>

            <p className="text-sm mt-4 text-white/80">
              ¿No tienes cuenta?{" "}
              <Link
                to="/register"
                className="text-emerald-400 hover:text-emerald-300"
              >
                Regístrate
              </Link>
            </p>

          </div>
        </div>

      </div>
    </div>
  );
}

export default Login;