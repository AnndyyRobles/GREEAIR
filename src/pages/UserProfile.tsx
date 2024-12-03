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
import { useAuth } from '../context/AuthContext';
import UserInfo from '../components/UserInfo';
import UserStations from '../components/UserStations';
import UserAlertsTable from '../components/UserAlertsTable';

export default function UserProfile() {
  const { user } = useAuth();
  const [selectedStation, setSelectedStation] = useState<number | null>(null);

  if (!user) {
    return <p className="text-center text-red-500">Error: Usuario no logueado.</p>;
  }

  return (
    <div className="min-h-screen bg-gray-900 p-6">
      <h1 className="text-4xl font-bold text-gray-100 text-center mb-6">Perfil de Usuario</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <UserInfo userId={user.id_usuario} />
        <UserStations userId={user.id_usuario} onStationSelect={setSelectedStation} />
        {selectedStation && <UserAlertsTable stationId={selectedStation} />}
      </div>
    </div>
  );
}
