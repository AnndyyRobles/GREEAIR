import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { MapPin } from 'lucide-react';
import { Station } from '../types';
import { useNavigate } from 'react-router-dom';

interface Props {
  stationId: number;
}

export default function NearbyStations({ stationId }: Props) {
  const navigate = useNavigate();
  const { data: nearbyStations, isLoading, error } = useQuery<Station[]>({
    queryKey: ['nearbyStations', stationId],
    queryFn: async () => {
      const { data } = await axios.get(`/api/stations/${stationId}/nearby?distance=400`);
      return data;
    },
  });

  if (isLoading) return <p className="text-gray-100">Cargando estaciones cercanas...</p>;
  if (error) return <p className="text-red-500">Error al cargar las estaciones cercanas.</p>;
  if (!nearbyStations?.length) return <p className="text-gray-100">No hay estaciones cercanas disponibles.</p>;

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold text-gray-100 flex items-center">
        <MapPin className="h-6 w-6 mr-2 text-blue-400" />
        Estaciones Cercanas
      </h2>
      <div className="bg-gray-800 p-4 rounded-lg">
        <ul className="space-y-4">
          {nearbyStations.map((station) => (
            <li key={station.id_estacion} className="p-4 bg-gray-700 rounded-lg">
              <div className="text-gray-100 font-semibold text-lg">{station.nombre}</div>
              <div className="text-sm text-gray-400">{station.ciudad}</div>
              <button
                onClick={() => navigate(`/station/${station.id_estacion}`)}
                className="mt-2 px-4 py-2 bg-[#42c5b8] text-white rounded hover:bg-[#359d93] transition-colors text-sm"
              >
                Ver detalles
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
