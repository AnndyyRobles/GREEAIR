import { useState, useEffect } from "react";
import axios from "axios";

export default function Register() {
  const [formData, setFormData] = useState({
    nombre: "",
    correo: "",
    ubicacion: "",
    telefono: "",
    direccion: "",
    id_region: "",
    tipo_usuario: "cliente",
    contraseña: "",
  });
  const [regions, setRegions] = useState([]);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchRegions = async () => {
      try {
        const { data } = await axios.get("/api/regions");
        setRegions(data);
      } catch (err) {
        console.error("Error al cargar las regiones:", err);
      }
    };
    fetchRegions();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.post("/api/users/register", formData);
      setSuccess(true);
      setFormData({
        nombre: "",
        correo: "",
        ubicacion: "",
        telefono: "",
        direccion: "",
        id_region: "",
        tipo_usuario: "cliente",
        contraseña: "",
      });
    } catch (err) {
      setError("Error al registrar el usuario. Por favor, inténtalo de nuevo.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900">
      <form
        onSubmit={handleRegister}
        className="bg-gray-800 p-8 rounded-lg shadow-lg w-full max-w-2xl space-y-6"
      >
        <h2 className="text-3xl font-bold text-white text-center">Crear Cuenta</h2>
        {success && (
          <p className="text-green-500 text-center">Cuenta creada con éxito. ¡Ahora puedes iniciar sesión!</p>
        )}
        {error && <p className="text-red-500 text-center">{error}</p>}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Nombre */}
          <div>
            <label className="block text-gray-400 mb-1">Nombre Completo</label>
            <input
              type="text"
              name="nombre"
              value={formData.nombre}
              onChange={handleChange}
              className="w-full p-3 rounded-lg bg-gray-700 text-white"
              placeholder="Ingresa tu nombre completo"
              required
            />
          </div>
          {/* Correo */}
          <div>
            <label className="block text-gray-400 mb-1">Correo Electrónico</label>
            <input
              type="email"
              name="correo"
              value={formData.correo}
              onChange={handleChange}
              className="w-full p-3 rounded-lg bg-gray-700 text-white"
              placeholder="Ingresa tu correo"
              autoComplete="new-email"
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Ubicación */}
          <div>
            <label className="block text-gray-400 mb-1">Ciudad</label>
            <input
              type="text"
              name="ubicacion"
              value={formData.ubicacion}
              onChange={handleChange}
              className="w-full p-3 rounded-lg bg-gray-700 text-white"
              placeholder="Ciudad o localidad"
              required
            />
          </div>
          {/* Teléfono */}
          <div>
            <label className="block text-gray-400 mb-1">Teléfono</label>
            <input
              type="text"
              name="telefono"
              value={formData.telefono}
              onChange={handleChange}
              className="w-full p-3 rounded-lg bg-gray-700 text-white"
              placeholder="Número telefónico"
              required
            />
          </div>
        </div>

        {/* Dirección */}
        <div>
          <label className="block text-gray-400 mb-1">Dirección</label>
          <input
            type="text"
            name="direccion"
            value={formData.direccion}
            onChange={handleChange}
            className="w-full p-3 rounded-lg bg-gray-700 text-white"
            placeholder="Calle, número, colonia"
            required
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Región */}
          <div>
            <label className="block text-gray-400 mb-1">Región</label>
            <select
              name="id_region"
              value={formData.id_region}
              onChange={handleChange}
              className="w-full p-3 rounded-lg bg-gray-700 text-white"
              required
            >
              <option value="" disabled>
                Selecciona tu región
              </option>
              {regions.map((region) => (
                <option key={region.id_region} value={region.id_region}>
                  {region.nombre}
                </option>
              ))}
            </select>
          </div>
          {/* Tipo de Usuario */}
          <div>
            <label className="block text-gray-400 mb-1">Tipo de Usuario</label>
            <select
              name="tipo_usuario"
              value={formData.tipo_usuario}
              onChange={handleChange}
              className="w-full p-3 rounded-lg bg-gray-700 text-white"
              required
            >
              <option value="cliente">Cliente</option>
              {/* <option value="administrador">Administrador</option> */}
            </select>
          </div>
        </div>

        {/* Contraseña */}
        <div>
          <label className="block text-gray-400 mb-1">Contraseña</label>
          <input
            type="password"
            name="contraseña"
            value={formData.contraseña}
            onChange={handleChange}
            className="w-full p-3 rounded-lg bg-gray-700 text-white"
            placeholder="Crea una contraseña"
            required
          />
        </div>

        <button
          type="submit"
          className="w-full bg-emerald-400 hover:bg-emerald-300 text-white font-bold py-3 rounded-lg transition-colors"
        >
          Crear Cuenta
        </button>
        <p className="text-gray-400 text-center text-sm">
          ¿Ya tienes cuenta?{" "}
          <a href="/login" className="text-emerald-400">
            Inicia Sesión
          </a>
        </p>
      </form>
    </div>
  );
}
