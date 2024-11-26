import { useQuery } from '@tanstack/react-query';
import { Cloud, Droplets, Wind, ThermometerSun } from 'lucide-react';
import axios from 'axios';
import { WeatherCondition } from '../types';

interface Props {
  stationId: number;
}

export default function WeatherWidget({ stationId }: Props) {
  const { data: weather } = useQuery<WeatherCondition>({
    queryKey: ['weather', stationId],
    queryFn: async () => {
      const { data } = await axios.get(`/api/stations/${stationId}/weather`);
      return data;
    },
  });

  if (!weather) return null;

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold text-gray-100 flex items-center">
        <Cloud className="h-6 w-6 mr-2 text-blue-400" />
        Condiciones Meteorológicas
      </h2>
      
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-gray-700 rounded-lg p-4">
          <div className="flex items-center justify-center mb-2">
            <ThermometerSun className="h-8 w-8 text-orange-400" />
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-100">
              {weather.temperatura}°C
            </div>
            <div className="text-sm text-gray-400">Temperatura</div>
          </div>
        </div>

        <div className="bg-gray-700 rounded-lg p-4">
          <div className="flex items-center justify-center mb-2">
            <Droplets className="h-8 w-8 text-blue-400" />
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-100">
              {weather.humedad}%
            </div>
            <div className="text-sm text-gray-400">Humedad</div>
          </div>
        </div>

        <div className="bg-gray-700 rounded-lg p-4">
          <div className="flex items-center justify-center mb-2">
            <Wind className="h-8 w-8 text-emerald-400" />
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-100">
              {weather.velocidad_viento} km/h
            </div>
            <div className="text-sm text-gray-400">Viento</div>
          </div>
        </div>
      </div>
    </div>
  );
}