// import { useState } from 'react';
// import { useAuth } from '../context/AuthContext'; // Importar el contexto de autenticación
// import UserInfo from '../components/UserInfo';
// import UserStations from '../components/UserStations';
// import UserAlertsTable from '../components/UserAlertsTable';

// export default function UserProfile() {
//   const { user } = useAuth(); // Obtener el usuario logueado desde el contexto
//   const [selectedStation, setSelectedStation] = useState<number | null>(null);

//   // Extraer dinámicamente el ID del usuario
//   const userId = user?.id_usuario;

//   return (
//     <div className="min-h-screen bg-gray-900 p-6">
//       <h1 className="text-4xl font-bold text-gray-100 text-center mb-6">Perfil de Usuario</h1>
//       <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//         <UserInfo userId={userId} />
//         <UserStations userId={userId} onStationSelect={setSelectedStation} />
//         {selectedStation && <UserAlertsTable stationId={selectedStation} />}
//       </div>
//     </div>
//   );
// }
// import { useState } from 'react';
// import { useAuth } from '../context/AuthContext';
// import UserInfo from '../components/UserInfo';
// import UserStations from '../components/UserStations';
// import UserAlertsTable from '../components/UserAlertsTable';

// export default function UserProfile() {
//   const { user } = useAuth(); // Obtener el usuario logueado desde el contexto
//   const [selectedStation, setSelectedStation] = useState<number | null>(null);

//   // Validar que el usuario exista antes de usarlo
//   if (!user || !user.id_usuario) {
//     return <p className="text-center text-red-500">Error: Usuario no encontrado o no logueado.</p>;
//   }

//   const userId = user.id_usuario; // Usar el ID del usuario logueado

//   return (
//     <div className="min-h-screen bg-gray-900 p-6">
//       <h1 className="text-4xl font-bold text-gray-100 text-center mb-6">Perfil de Usuario</h1>
//       <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//         <UserInfo userId={userId} />
//         <UserStations userId={userId} onStationSelect={setSelectedStation} />
//         {selectedStation && <UserAlertsTable stationId={selectedStation} />}
//       </div>
//     </div>
//   );
// }

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import UserInfo from '../components/UserInfo';
import UserStations from '../components/UserStations';
import UserAlertsTable from '../components/UserAlertsTable';

export default function UserProfile() {
  const { user } = useAuth();
  const [selectedStation, setSelectedStation] = useState<number | null>(null);

  // Consulta para obtener el nombre del usuario desde el backend
  const { data: userInfo, isLoading } = useQuery({
    queryKey: ['userProfile', user?.id_usuario],
    queryFn: async () => {
      if (!user?.id_usuario) throw new Error('ID del usuario no disponible');
      const response = await axios.get(`/api/users/${user.id_usuario}`);
      return response.data;
    },
    enabled: !!user?.id_usuario, // Solo ejecutar si hay un usuario
  });

  if (!user) {
    return <p className="text-center text-red-500">Error: Usuario no logueado.</p>;
  }

  if (isLoading) {
    return <p className="text-center text-gray-100">Cargando perfil...</p>;
  }

  if (!userInfo || !userInfo.nombre) {
    return <p className="text-center text-red-500">No se pudo cargar la información del usuario.</p>;
  }

  return (
    <div className="min-h-screen bg-gray-900 p-6 flex flex-col space-y-8">
      {/* Título con "Perfil de" en blanco y el nombre en el estilo solicitado */}
      <h1 className="text-center text-4xl font-bold text-white">
        Perfil de{' '}
        <span className="bg-gradient-to-r from-emerald-400 to-blue-400 bg-clip-text text-transparent uppercase">
          {userInfo.nombre}
        </span>
      </h1>

      {/* Layout general */}
      <div className="flex flex-col md:flex-row md:space-x-8">
        {/* Información del usuario */}
        <div className="flex-1 bg-gray-800 p-6 rounded-lg shadow-md">
          <UserInfo userId={user.id_usuario} />
        </div>

        {/* Estaciones con scroll */}
        <div className="flex-1 bg-gray-800 p-6 rounded-lg shadow-md overflow-y-auto max-h-96">
          <UserStations userId={user.id_usuario} onStationSelect={setSelectedStation} />
        </div>
      </div>

      {/* Tabla de alertas */}
      {selectedStation && (
        <div className="bg-gray-800 p-6 rounded-lg shadow-md">
          <UserAlertsTable stationId={selectedStation} />
        </div>
      )}
    </div>
  );
}


