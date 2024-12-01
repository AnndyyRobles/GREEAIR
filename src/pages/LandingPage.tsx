import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { Leaf, Wind, Activity } from 'lucide-react';
import axios from 'axios';
import Earth3D from '../components/Earth3D';
import { Region, Station } from '../types';

export default function LandingPage() {
  const navigate = useNavigate();

  const { data: regions } = useQuery<Region[]>({
    queryKey: ['regions'],
    queryFn: async () => {
      const { data } = await axios.get('/api/regions');
      return data;
    },
  });

  const { data: stationsByRegion } = useQuery<Record<number, Station[]>>({
    queryKey: ['stationsByRegion'],
    queryFn: async () => {
      const { data } = await axios.get('/api/stations/by-region');
      return data;
    },
  });

  return (
    <>
      {/* Header and Earth3D Section */}
      <div className="w-full">
        <div className="max-w-7xl mx-auto px-4 py-12 text-center">
          <h1 className="ml-2 text-8xl font-bold bg-gradient-to-r from-emerald-400 to-blue-400 bg-clip-text text-transparent group-hover:from-emerald-300 group-hover:to-blue-300 transition-colors">
            GreenAir
          </h1>
          <p className="text-xl text-white">
            Datos de calidad del aire y alertas personalizadas según su ubicación
          </p>
        </div>
        <div className="w-full h-[800px] mt-12 mb-12">
          <Earth3D />
        </div>
      </div>
  
      {/* Regions and Stations Section */}
      <div className="min-h-[calc(100vh-4rem)] bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900">
        <div className="max-w-7xl mx-auto px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {regions?.map((region) => (
              <div
                key={region.id_region}
                className="bg-gray-800 border border-gray-700 rounded-xl shadow-lg p-6 hover:border-emerald-500 transition-colors"
              >
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold text-gray-100">
                    {region.nombre}
                  </h2>
                  <Activity className="h-6 w-6 text-emerald-400" />
                </div>
                <div className="space-y-3">
                  {stationsByRegion?.[region.id_region]?.map((station) => (
                    <button
                      key={station.id_estacion}
                      onClick={() => navigate(`/station/${station.id_estacion}`)}
                      className="w-full flex items-center justify-between p-3 rounded-lg bg-gray-700 hover:bg-gray-600 transition-colors"
                    >
                      <div className="flex items-center">
                        <Wind className="h-5 w-5 text-emerald-400 mr-2" />
                        <span className="font-medium text-gray-100">
                          {station.nombre}
                        </span>
                      </div>
                      <span className="text-sm text-gray-400">
                        {station.ciudad}
                      </span>
                    </button>
                  ))}
                </div>
                <div className="mt-4 text-sm text-gray-400 text-right">
                  {stationsByRegion?.[region.id_region]?.length || 0} estaciones
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
  
}
