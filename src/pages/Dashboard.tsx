import { useState, useEffect } from "react";
import logo from "../assets/log.jpg";
import banner from "../assets/fit.jpg";
import rutinaImg from "../assets/rutinas.jpg";
import { ReferenceLine } from "recharts";

// ICONOS
import {FaHome,FaDumbbell,FaChartLine,FaCog,FaUser,FaAppleAlt,} from "react-icons/fa";

// GRÁFICA
import {LineChart,Line,XAxis,YAxis,Tooltip,ResponsiveContainer,} from "recharts";

import { FaHistory, FaBullseye, FaWeight } from "react-icons/fa";

function Dashboard() {
  const [vista, setVista] = useState("dashboard");
  const [resultado, setResultado] = useState("");

  const [nombre, setNombre] = useState("");

  const [peso, setPeso] = useState("");
  const [talla, setTalla] = useState("");
  const [deporte, setDeporte] = useState("");

  //

  const [editando, setEditando] = useState(false);

const [perfil, setPerfil] = useState({
  nombre: "",
  apellido: "",
  edad: "",
  email: "",
  telefono: "",
  direccion: "",
});

  const [metaPeso, setMetaPeso] = useState("");
  const [frecuencia, setFrecuencia] = useState("");
  const [avatar, setAvatar] = useState("FaUser");

  const [objetivo, setObjetivo] = useState("");
  const [pesoHoy, setPesoHoy] = useState("");
  const [data, setData] = useState([]);

  const ultimoPeso = data.length > 0 ? data[data.length - 1].progreso : 0;
  const diferencia = objetivo ? Number(objetivo) - ultimoPeso : 0;

  const [macros, setMacros] = useState({
    proteina: 0,
    carbs: 0,
    grasas: 0,
  });

  const [planComida, setPlanComida] = useState([]);

  // CARGA INICIAL
  useEffect(() => {
  const savedConfig = localStorage.getItem("configUser");

  if (savedConfig) {
    const data = JSON.parse(savedConfig);
    setPerfil((prev) => ({
      ...prev,
      ...data
    }));
  }

  const user = localStorage.getItem("usuarioNombre") || "";
  const email = localStorage.getItem("usuarioEmail");

  if (user || email) {
    setNombre(user);

    setPerfil((prev) => ({
      ...prev,
      nombre: user || prev.nombre,
      email: email || prev.email
    }));
  }

  const saved = localStorage.getItem("progresoPeso");
  if (saved) setData(JSON.parse(saved) || []);

}, []);

  // TIPOS DEPORTE
  const obtenerTipo = (dep) => {
    const resistencia = ["Running","Ciclismo","Natación","Triatlón","Atletismo"];
    const equipo = ["Fútbol","Básquetbol","Vóleibol","Rugby","Futsal","Balonmano"];
    const fuerza = ["Gimnasio","Powerlifting","Calistenia","Crossfit","Halterofilia"];
    const combate = ["Boxeo","MMA","Jiu-Jitsu","Karate","Taekwondo"];

    if (resistencia.includes(dep)) return "resistencia";
    if (equipo.includes(dep)) return "equipo";
    if (fuerza.includes(dep)) return "fuerza";
    if (combate.includes(dep)) return "combate";
    return "bienestar";
  };

  // MACROS
  const calcularMacros = (peso, deporte) => {
    const tipo = obtenerTipo(deporte);

    let factor = 30;
    if (tipo === "resistencia") factor = 35;
    if (tipo === "equipo") factor = 32;
    if (tipo === "fuerza") factor = 30;
    if (tipo === "combate") factor = 34;
    if (tipo === "bienestar") factor = 28;

    const calorias = peso * factor;

    const proteina = Math.round((calorias * 0.3) / 4);
    const carbs = Math.round((calorias * 0.5) / 4);
    const grasas = Math.round((calorias * 0.2) / 9);

    setMacros({ proteina, carbs, grasas });

    generarPlanComida(proteina);
  };

  // PLAN COMIDA
  const generarPlanComida = (proteina) => {
    setPlanComida([
      {
        titulo: "Desayuno",
        comida: `${Math.round(proteina * 0.3)}g proteína → Huevos + Avena`,
      },
      {
        titulo: "Almuerzo",
        comida: `${Math.round(proteina * 0.4)}g proteína → Pollo + Arroz`,
      },
      {
        titulo: "Cena",
        comida: `${Math.round(proteina * 0.3)}g proteína → Atún + Ensalada`,
      },
    ]);
  };

  const obtenerRutinas = (deporte) => {
  const tipo = obtenerTipo(deporte);
  

  if (tipo === "fuerza") {
    return [
      { nombre: "Press banca", series: "4x10" },
      { nombre: "Sentadillas", series: "4x12" },
      { nombre: "Peso muerto", series: "4x8" },
    ];
  }

  if (tipo === "resistencia") {
    return [
      { nombre: "Running", series: "30 min" },
      { nombre: "Sprints", series: "6x100m" },
      { nombre: "Saltos", series: "3x15" },
    ];
  }

  if (tipo === "combate") {
    return [
      { nombre: "Sombra", series: "3x3 min" },
      { nombre: "Saco", series: "5x3 min" },
      { nombre: "Burpees", series: "4x15" },
    ];
  }

  return [
    { nombre: "Yoga Flow", series: "20 min" },
    { nombre: "Movilidad", series: "15 min" },
  ];
};

const [completados, setCompletados] = useState({});

const toggleCompletado = (index) => {
  setCompletados((prev) => ({
    ...prev,
    [index]: !prev[index],
  }));
};

const calcularProgreso = () => {
  const rutinas = obtenerRutinas(deporte);

  if (!deporte || rutinas.length === 0) return 0;

  const completadosCount = Object.values(completados).filter(Boolean).length;

  return Math.round((completadosCount / rutinas.length) * 100);
};

  // GUARDAR PROGRESO REAL
      const guardarProgreso = () => {
      if (!pesoHoy) return alert("Ingresa tu peso");

      const fecha = new Date();

      const nuevo = {
        dia: fecha.toLocaleDateString("es-PE", { weekday: "short" }),
        fecha: fecha.toLocaleDateString("es-PE"),
        progreso: Number(pesoHoy),
      };

      const anterior = data[data.length - 1];
      if (anterior) {
        nuevo.diff = Number(pesoHoy) - anterior.progreso;
      }

      const nuevoData = [...data, nuevo];
      setData(nuevoData);

      localStorage.setItem("progresoPeso", JSON.stringify(nuevoData));

      // 🔥 actualizar macros automáticamente
      if (deporte) {
        calcularMacros(Number(pesoHoy), deporte);
      }

      setPesoHoy("");
    };

  // GENERAR PLAN
  const generar = () => {
    if (!peso || !talla || !deporte) {
      alert("Completa todos los datos");
      return;
    }

    calcularMacros(Number(peso), deporte);

    setResultado(
      `Plan para ${deporte}: adaptado a ${peso}kg y ${talla}cm`
    );
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white flex">

      {/* SIDEBAR */}
      <aside className="w-64 bg-slate-900 p-6 hidden md:flex flex-col border-r border-slate-800">
        <div className="mb-10 flex items-center gap-3">
          <img src={logo} className="w-10 h-10" />
          <span className="text-xl font-semibold">FITIO</span>
        </div>

        <nav className="space-y-5 text-slate-300">
          <div onClick={() => setVista("dashboard")} className="flex gap-3 cursor-pointer hover:text-white">
            <FaHome /> Dashboard
          </div>

          <div onClick={() => setVista("rutinas")} className="flex gap-3 cursor-pointer hover:text-white">
            <FaDumbbell /> Rutinas
          </div>

          <div onClick={() => setVista("progreso")} className="flex gap-3 cursor-pointer hover:text-white">
            <FaChartLine /> Progreso
          </div>

          <div onClick={() => setVista("config")} className="flex gap-3 cursor-pointer hover:text-white">
            <FaCog /> Configuración
          </div>
        </nav>
      </aside>

      {/* MAIN */}
      <main className="flex-1 p-6">

        <h1 className="text-3xl font-bold mb-2">
          Bienvenido, <span className="text-emerald-400">{nombre || "Usuario"}</span>
        </h1>

        {/* DASHBOARD */}
        {vista === "dashboard" && (
          <>

<div className="bg-slate-900 p-6 rounded-2xl border border-slate-700 mb-6 flex items-center gap-6">

  {/* FOTO */}
  <div className="w-20 h-20 rounded-full bg-slate-700 flex items-center justify-center text-2xl border-2 border-emerald-500">
    <FaUser />
  </div>

  {/* INFO */}
  <div className="flex-1">

    <p className="text-xs text-slate-500 uppercase tracking-widest">
        Usuario
    </p>

    <h2 className="text-xl font-bold text-white">
      {[perfil.nombre, perfil.apellido].filter(Boolean).join(" ") || "Usuario"}
    </h2>

    <p className="text-slate-400 text-sm">
      {perfil.email || "Sin email"}
    </p>

    <div className="flex gap-6 mt-2 text-sm">
      <span>Edad: {perfil.edad || "--"}</span>
      <span>Peso: {peso || "--"} kg</span>
      <span>Deporte: {deporte || "--"}</span>
    </div>
  </div>

</div>

          <img
              src={banner}
              alt="Banner"
              className="w-full h-80 object-cover rounded-xl mt-4 mb-6"
            />
            <div className="grid md:grid-cols-2 gap-6 mb-6">

              {/* PERFIL */}
              <div className="bg-slate-800 p-6 rounded-xl">
                <div className="flex items-center gap-3 mb-4">
                  <FaUser className="text-emerald-400" />
                  <h2>Perfil Deportivo</h2>
                </div>

                <input type="number" placeholder="Peso (kg)" value={peso} onChange={(e) => setPeso(e.target.value)} className="w-full p-3 mb-3 rounded bg-slate-700"/>

                <input type="number" placeholder="Talla (cm)" value={talla} onChange={(e) => setTalla(e.target.value)} className="w-full p-3 mb-3 rounded bg-slate-700"/>

                <select value={deporte} onChange={(e) => setDeporte(e.target.value)} className="w-full p-3 rounded bg-slate-700">

                  <option value="">Selecciona deporte</option>

                  <optgroup label="Deportes de Equipo">
                    <option>Fútbol</option>
                    <option>Básquetbol</option>
                    <option>Vóleibol</option>
                    <option>Rugby</option>
                    <option>Futsal</option>
                    <option>Balonmano</option>
                  </optgroup>

                  <optgroup label="Resistencia">
                    <option>Running</option>
                    <option>Ciclismo</option>
                    <option>Natación</option>
                    <option>Triatlón</option>
                    <option>Atletismo</option>
                  </optgroup>

                  <optgroup label="Fuerza">
                    <option>Gimnasio</option>
                    <option>Powerlifting</option>
                    <option>Calistenia</option>
                    <option>Crossfit</option>
                    <option>Halterofilia</option>
                  </optgroup>

                  <optgroup label="Combate">
                    <option>Boxeo</option>
                    <option>MMA</option>
                    <option>Jiu-Jitsu</option>
                    <option>Karate</option>
                    <option>Taekwondo</option>
                  </optgroup>

                  <optgroup label="Bienestar">
                    <option>Yoga</option>
                    <option>Pilates</option>
                    <option>Entrenamiento Funcional</option>
                  </optgroup>

                </select>
              </div>

              {/* NUTRICIÓN */}
              <div className="bg-slate-800 p-6 rounded-xl">
                <div className="flex items-center gap-3 mb-4">
                  <FaAppleAlt className="text-emerald-400" />
                  <h2>Plan Nutricional</h2>
                </div>

                <p>Proteínas: {macros.proteina}g</p>
                <p>Carbohidratos: {macros.carbs}g</p>
                <p>Grasas: {macros.grasas}g</p>

                <div className="mt-4 space-y-2">
                  {planComida.map((item, i) => (
                    <div key={i} className="bg-slate-700 p-3 rounded">
                      <p className="font-semibold">{item.titulo}</p>
                      <p className="text-sm text-slate-300">{item.comida}</p>
                    </div>
                  ))}
                </div>
              </div>

            </div>

            <button onClick={generar} className="bg-emerald-500 px-6 py-3 rounded">
              Generar Plan
            </button>

            <p className="mt-4 text-emerald-400">{resultado}</p>
          </>
        )}

       {/* PROGRESO */}
{vista === "progreso" && (
  <div className="space-y-6">

    <div className="grid md:grid-cols-2 gap-6">

      {/* IZQUIERDA: GRÁFICO */}
      <div className="bg-slate-800 p-6 rounded-2xl border border-slate-700">

        <h2 className="text-lg font-semibold mb-1 flex items-center gap-2">
          <FaWeight className="text-emerald-400" />
          Evolución de Peso
        </h2>

        <p className="text-slate-400 text-sm mb-4">
          Monitoreo de progreso corporal
        </p>

        <input
          type="number"
          placeholder="Peso actual (kg)"
          value={pesoHoy}
          onChange={(e) => setPesoHoy(e.target.value)}
          className="p-3 rounded-xl bg-slate-700 mb-3 w-full outline-none focus:ring-2 focus:ring-emerald-500"
        />

        <input
          type="number"
          placeholder="Meta objetivo (kg)"
          value={objetivo}
          onChange={(e) => setObjetivo(e.target.value)}
          className="p-3 rounded-xl bg-slate-700 mb-4 w-full outline-none focus:ring-2 focus:ring-emerald-500"
        />

        <button
          onClick={guardarProgreso}
          className="bg-emerald-500 hover:bg-emerald-600 transition px-4 py-2 rounded-xl w-full font-semibold"
        >
          Guardar progreso
        </button>

        {/* GRÁFICO */}
        <div className="mt-6 bg-slate-900 p-4 rounded-xl">
          <ResponsiveContainer width="100%" height={260}>
            <LineChart data={data}>

              <XAxis dataKey="dia" stroke="#94a3b8" />
              <YAxis stroke="#94a3b8" />
              <Tooltip />

              <Line
                type="monotone"
                dataKey="progreso"
                stroke="#10b981"
                strokeWidth={3}
                dot={{ r: 4 }}
              />

              {objetivo && (
                <ReferenceLine
                  y={Number(objetivo)}
                  stroke="#ef4444"
                  strokeDasharray="6 6"
                  label={{ value: "Meta", fill: "#ef4444" }}
                />
              )}

            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* DERECHA */}
      <div className="space-y-4">

        {/* META */}
        <div className="bg-slate-800 p-6 rounded-2xl border border-slate-700">

          <h3 className="text-slate-400 text-sm flex items-center gap-2">
            <FaBullseye className="text-red-400" />
            Objetivo actual
          </h3>

          <p className="text-2xl font-bold mt-1">
            {objetivo ? `${objetivo} kg` : "Sin objetivo definido"}
          </p>

          <p className="text-sm mt-2 text-slate-400">
            Peso actual: <span className="text-white">{ultimoPeso} kg</span>
          </p>

          <p className="mt-2 text-sm">
            {diferencia > 0 ? (
              <span className="text-yellow-400">
                Faltan {diferencia.toFixed(1)} kg
              </span>
            ) : (
              <span className="text-emerald-400">
                Objetivo alcanzado
              </span>
            )}
          </p>
        </div>

        {/* PROGRESO GENERAL */}
        <div className="bg-slate-800 p-6 rounded-2xl border border-slate-700 text-center">

          <h3 className="text-slate-400 text-sm mb-3">
            Progreso general
          </h3>

          <div className="relative w-28 h-28 mx-auto">

            <div className="absolute inset-0 rounded-full border-8 border-slate-700"></div>

            <div
              className="absolute inset-0 rounded-full border-8 border-emerald-500"
              style={{
                clipPath: `inset(${100 - calcularProgreso()}% 0 0 0)`
              }}
            />

            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-xl font-bold text-emerald-400">
                {calcularProgreso()}%
              </span>
            </div>

          </div>

          <p className="text-xs text-slate-400 mt-3">
            Rutinas completadas
          </p>
        </div>

        {/* HISTORIAL */}
        <div className="bg-slate-800 p-6 rounded-2xl border border-slate-700">

          <h3 className="text-slate-300 text-sm mb-4 flex items-center gap-2">
            <FaHistory className="text-slate-400" />
            Historial
          </h3>

          <div className="space-y-3 max-h-[260px] overflow-y-auto pr-2">

            {data.slice().reverse().map((item, i) => (
              <div
                key={i}
                className="flex justify-between items-center bg-slate-900 p-3 rounded-xl border border-slate-700"
              >

                <div className="flex flex-col">
                  <span className="text-sm text-slate-300">
                    {item.fecha}
                  </span>
                  <span className="text-xs text-slate-500">
                    Registro de peso
                  </span>
                </div>

                <div className="text-right">
                  <p className="text-white font-semibold">
                    {item.progreso} kg
                  </p>

                  <p
                    className={`text-xs ${
                      item.diff > 0
                        ? "text-red-400"
                        : item.diff < 0
                        ? "text-emerald-400"
                        : "text-slate-400"
                    }`}
                  >
                    {item.diff
                      ? `${item.diff > 0 ? "+" : ""}${item.diff} kg`
                      : "—"}
                  </p>
                </div>

              </div>
            ))}

          </div>

        </div>

      </div>
    </div>

  </div>
)}

        {/* RUTINAS */}
{vista === "rutinas" && (
  <>

    {/* IMAGEN */}
    <img
      src={rutinaImg}
      alt="Rutinas"
      className="w-full h-80 object-cover rounded-2xl mt-4 mb-6 shadow-lg border border-white/10"
    />

    {/* VALIDACIÓN */}
    {!deporte ? (
      <p className="text-slate-400">
        Primero selecciona un deporte en el panel
      </p>
    ) : (
      <div className="grid md:grid-cols-3 gap-6">

        {obtenerRutinas(deporte).map((ej, i) => (
          <div
            key={i}
            className="bg-slate-800 p-6 rounded-xl hover:bg-slate-700 transition"
          >
            <h3 className="text-lg font-semibold mb-2">
              {ej.nombre}
            </h3>

            <p className="text-slate-300 mb-3">
              {ej.series}
            </p>

            {/* CHECKBOX */}
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={completados[i] || false}
                onChange={() => toggleCompletado(i)}
              />
              Completado
            </label>
          </div>
        ))}

      </div>
    )}

  </>
)}
        {/* CONFIGURACION */}
{vista === "config" && (
  <div className="flex justify-center">
    <div className="bg-slate-900 p-8 rounded-2xl border border-slate-700 w-full max-w-3xl">

      <h2 className="text-2xl font-bold mb-6 text-center">
        Configuración del Perfil
      </h2>

      {/* BOTÓN EDITAR */}
      <div className="flex justify-end mb-6">
        <button
          onClick={() => setEditando(!editando)}
          className="text-sm text-emerald-400 hover:underline"
        >
          {editando ? "Cancelar" : "Editar"}
        </button>
      </div>

      {/* FOTO */}
      <div className="flex flex-col items-center mb-6">

  {/* FOTO */}
  <div className="w-28 h-28 rounded-full bg-slate-700 flex items-center justify-center text-3xl border-2 border-emerald-500">
    <FaUser />
  </div>

  {/* NOMBRE */}
  <h3 className="mt-3 text-lg font-semibold text-white">
    {perfil.nombre || "Usuario"} {perfil.apellido || ""}
  </h3>

</div>

      {/* FORM */}
      <div className="grid grid-cols-2 gap-4">

        <input
          type="text"
          placeholder="Nombre"
          value={perfil.nombre}
          disabled={!editando}
          onChange={(e) =>
            setPerfil({ ...perfil, nombre: e.target.value })
          }
          className="p-3 rounded bg-slate-800 col-span-1"
        />

        <input
          type="text"
          placeholder="Apellidos"
          value={perfil.apellido}
          disabled={!editando}
          onChange={(e) =>
            setPerfil({ ...perfil, apellido: e.target.value })
          }
          className="p-3 rounded bg-slate-800 col-span-1"
        />

        <input
          type="number"
          placeholder="Edad"
          value={perfil.edad}
          disabled={!editando}
          onChange={(e) =>
            setPerfil({ ...perfil, edad: e.target.value })
          }
          className="p-3 rounded bg-slate-800"
        />

        <input
          type="email"
          placeholder="Email"
          value={perfil.email}
          disabled={!editando}
          onChange={(e) =>
            setPerfil({ ...perfil, email: e.target.value })
          }
          className="p-3 rounded bg-slate-800"
        />

        <input
          type="text"
          placeholder="Teléfono"
          value={perfil.telefono}
          disabled={!editando}
          onChange={(e) =>
            setPerfil({ ...perfil, telefono: e.target.value })
          }
          className="p-3 rounded bg-slate-800 col-span-2"
        />

        <input
          type="text"
          placeholder="Dirección"
          value={perfil.direccion}
          disabled={!editando}
          onChange={(e) =>
            setPerfil({ ...perfil, direccion: e.target.value })
          }
          className="p-3 rounded bg-slate-800 col-span-2"
        />

      </div>

      {/* BOTÓN GUARDAR */}
      {editando && (
        <button
          onClick={() => {
            localStorage.setItem("configUser", JSON.stringify(perfil));
            setNombre(perfil.nombre);
            setEditando(false);
          }}
          className="bg-emerald-500 mt-6 px-6 py-3 rounded w-full font-semibold"
        >
          Guardar cambios
        </button>
      )}

    </div>
  </div>
)}


      </main>
    </div>
  );
}

export default Dashboard;