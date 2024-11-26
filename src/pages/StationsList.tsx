import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { MapPin, Wind, ThermometerSun } from 'lucide-react';
import Map from '../components/Map';
import { Station } from '../types';

export default function StationsList() {
  const navigate = useNavigate();
  const { data: stations } = useQuery<Station[]>({
    queryKey: ['stations'],
    queryFn: async () => {
      // Simulated API call
      return [
        {
          id_estacion: 1,
          nombre: "Estación Central",
          ciudad: "Santiago",
          latitud: -33.4513,
          longitud: -70.6653,
          id_region: 1
        },
        {
          id_estacion: 2,
          nombre: "Estación Norte",
          ciudad: "Santiago",
          latitud: -33.4013,
          longitud: -70.6453,
          id_region: 1
        }
      ];
    }
  });

  const handleStationSelect = (station: Station) => {
    navigate(`/station/${station.id_estacion}`);
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-xl font-semibold mb-6">Mapa de Estaciones</h2>
        <Map stations={stations || []} onStationSelect={handleStationSelect} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {stations?.map((station) => (
          <div
            key={station.id_estacion}
            className="bg-white rounded-lg shadow-lg p-6 cursor-pointer hover:shadow-xl transition-shadow"
            onClick={() => handleStationSelect(station)}
          >
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  {station.nombre}
                </h3>
                <p className="text-sm text-gray-500">{station.ciudad}</p>
              </div>
              <MapPin className="h-5 w-5 text-blue-500" />
            </div>

            <div className="mt-4 grid grid-cols-2 gap-4">
              <div className="flex items-center">
                <Wind className="h-4 w-4 text-gray-400 mr-2" />
                <span className="text-sm text-gray-600">12.3 km/h</span>
              </div>
              <div className="flex items-center">
                <ThermometerSun className="h-4 w-4 text-gray-400 mr-2" />
                <span className="text-sm text-gray-600">22.5°C</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}