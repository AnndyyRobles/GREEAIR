import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

interface Station {
  id_estacion: number;
  nombre: string;
  ubicacion: string;
}

interface Props {
  userId: number;
}

export default function UserStations({ userId }: Props) {
  const { data, error, isLoading } = useQuery<Station[]>({
    queryKey: ['stations', userId],
    queryFn: async () => {
      const { data } = await axios.get(`/api/users/${userId}/stations`);
      return data;
    },
  });

  if (isLoading) return <p>Cargando estaciones...</p>;
  if (error) return <p>Error al cargar las estaciones: {error.message}</p>;

  if (!data || data.length === 0) return <p>No hay estaciones suscritas.</p>;

  return (
    <div className="bg-gray-800 p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-bold text-gray-100 mb-4">Estaciones Suscritas</h2>
      <ul className="space-y-2">
        {data.map((station) => (
          <li
            key={station.id_estacion}
            className="bg-gray-700 p-4 rounded-lg hover:bg-gray-600 transition"
          >
            <p className="text-gray-100 font-semibold">{station.nombre}</p>
            <p className="text-gray-400 text-sm">{station.ubicacion}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}