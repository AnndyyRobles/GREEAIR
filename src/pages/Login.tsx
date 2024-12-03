// import React, { useState } from 'react';
// import axios from 'axios';
// import { useNavigate } from 'react-router-dom';

// export default function Login() {
//   const [correo, setCorreo] = useState('');
//   const [contraseña, setContraseña] = useState('');
//   const [error, setError] = useState('');
//   const navigate = useNavigate();

//   const handleLogin = async (e: React.FormEvent) => {
//     e.preventDefault();
//     try {
//       const response = await axios.post('/api/users/login', { correo, contraseña });
//       const { id_usuario, tipo_usuario } = response.data;

//       // Guardar datos del usuario en localStorage (o cookies)
//       localStorage.setItem('user', JSON.stringify({ id_usuario, tipo_usuario }));

//       // Redirigir según tipo de usuario
//       if (tipo_usuario === 'administrador') {
//         navigate('/admin/dashboard');
//       } else {
//         navigate('/');
//       }
//     } catch (error: any) {
//       setError(error.response?.data?.error || 'Error al iniciar sesión');
//     }
//   };
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

export default function Login() {
  const [correo, setCorreo] = useState('');
  const [contraseña, setContraseña] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await axios.post('/api/users/login', { correo, contraseña });
      const { id_usuario, tipo_usuario } = response.data;

      console.log('API Response:', response.data);

      localStorage.setItem('user', JSON.stringify({ id_usuario, tipo_usuario }));
      login({ id_usuario, tipo_usuario });  // Actualizar estado global
      navigate('/');
    } catch (error: any) {
      setError(error.response?.data?.error || 'Error al iniciar sesión');

      console.error('Login error:', error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900">
      <form
        className="bg-gray-800 p-12 rounded-lg shadow-lg space-y-8 w-full max-w-xl"
        onSubmit={handleLogin}
      >
        <div className="text-center">
          <h2 className="text-4xl font-bold text-white mb-2">Bienvenido de Nuevo</h2>
          <p className="text-gray-400 text-lg">
            Accede a tu cuenta y monitorea la calidad del aire en tiempo real.
          </p>
        </div>

        {error && (
          <div className="text-red-400 text-center text-sm bg-red-900/20 py-2 px-4 rounded-lg">
            {error}
          </div>
        )}

        <div className="space-y-6">
          {/* Correo */}
          <div>
            <label className="block text-gray-400 text-lg mb-2">Correo Electrónico</label>
            <input
              type="email"
              placeholder="Ingresa tu correo"
              className="w-full p-4 bg-gray-700 text-white rounded-lg text-lg"
              value={correo}
              onChange={(e) => setCorreo(e.target.value)}
              required
            />
          </div>
          {/* Contraseña */}
          <div>
            <label className="block text-gray-400 text-lg mb-2">Contraseña</label>
            <input
              type="password"
              placeholder="Ingresa tu contraseña"
              className="w-full p-4 bg-gray-700 text-white rounded-lg text-lg"
              value={contraseña}
              onChange={(e) => setContraseña(e.target.value)}
              required
            />
          </div>
        </div>

        <button
          type="submit"
          className="w-full bg-emerald-400 hover:bg-emerald-300 text-gray-900 font-bold py-4 rounded-lg text-lg transition-colors"
        >
          Iniciar Sesión
        </button>

        <p className="text-gray-400 text-center text-lg mt-6">
          ¿No tienes una cuenta?{' '}
          <span
            className="text-emerald-400 hover:underline cursor-pointer"
            onClick={() => navigate('/register')}
          >
            Regístrate aquí
          </span>
        </p>
      </form>
    </div>
  );
}
