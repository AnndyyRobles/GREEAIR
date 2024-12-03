import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

interface UserInfoProps {
  userId: number;
}

interface User {
  nombre: string;
  correo: string;
  telefono: string;
  direccion: string;
  id_region: string;
  tipo_usuario: string;
}

export default function UserInfo({ userId }: UserInfoProps) {
  const { data: user, isLoading } = useQuery<User>({
    queryKey: ['user', userId],
    queryFn: async () => {
      const { data } = await axios.get(`/api/users/${userId}`);
      return data;
    },
  });

  if (isLoading) return <p>Cargando información del usuario...</p>;

  if (!user) return <p>No se encontró información del usuario.</p>;

  return (
    <div className="space-y-4 text-gray-100">
      <h2 className="text-2xl font-bold">{user.nombre}</h2>
      <p><strong>Correo:</strong> {user.correo}</p>
      <p><strong>Teléfono:</strong> {user.telefono}</p>
      <p><strong>Dirección:</strong> {user.direccion}</p>
      <p><strong>Región:</strong> {user.id_region}</p>
      <p><strong>Tipo:</strong> {user.tipo_usuario}</p>
    </div>
  );
}
