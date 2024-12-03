import { useQuery, useMutation } from '@tanstack/react-query';
import axios from 'axios';
import { FaTrash } from 'react-icons/fa'; // Asegúrate de instalar react-icons

interface Station {
  id_estacion: number;
  nombre: string;
  region: string; // Cambiado para usar "region" en vez de "ubicacion"
}

interface Props {
  userId: number;
  onStationSelect: (stationId: number) => void; // Función para seleccionar una estación
}

export default function UserStations({ userId, onStationSelect }: Props) {
  // Obtener estaciones suscritas
  const { data, error, isLoading, refetch } = useQuery<Station[]>({
    queryKey: ['stations', userId],
    queryFn: async () => {
      const { data } = await axios.get(`/api/users/${userId}/stations`);
      console.log('Datos de estaciones recibidos:', data);
      return data;
    },
  });

  // Mutación para eliminar una estación
  const deleteMutation = useMutation({
    mutationFn: async (stationId: number) => {
      await axios.delete(`/api/users/${userId}/stations/${stationId}`);
    },
    onSuccess: () => {
      console.log('Estación eliminada correctamente');
      refetch(); // Refrescar la lista de estaciones
    },
    onError: (error) => {
      console.error('Error al eliminar la estación:', error);
    },
  });

  if (isLoading) return <p>Cargando estaciones...</p>;
  if (error) return <p>Error al cargar las estaciones: {error.message}</p>;

  if (!data || data.length === 0) return <p>No hay estaciones suscritas.</p>;

  return (
    <div>
      <h2 className="text-xl font-bold text-gray-100 mb-4">Estaciones Suscritas</h2>
      <ul className="space-y-2">
        {data.map((station) => (
          <li
            key={station.id_estacion}
            className="bg-gray-700 p-4 rounded-lg flex justify-between items-center hover:bg-gray-600 transition"
          >
            {/* Información de la estación */}
            <div onClick={() => onStationSelect(station.id_estacion)} className="cursor-pointer">
              <p className="text-gray-100 font-semibold">{station.nombre}</p>
              <p className="text-gray-400 text-sm">{station.region}</p>
            </div>

            {/* Ícono de basura para eliminar */}
            <button
              onClick={(e) => {
                e.stopPropagation(); // Evitar que se active la selección de la estación al eliminar
                deleteMutation.mutate(station.id_estacion);
              }}
              className="text-red-500 hover:text-red-400 transition"
            >
              <FaTrash size={20} />
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
