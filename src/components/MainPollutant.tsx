import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { AlertTriangle } from 'lucide-react';

interface Props {
  stationId: number;
}

export default function MainPollutant({ stationId }: Props) {
  const { data: pollutant } = useQuery({
    queryKey: ['mainPollutant', stationId],
    queryFn: async () => {
      const { data } = await axios.get(`/api/stations/${stationId}/pollutant`);
      return data;
    },
  });

  if (!pollutant) return null;

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold text-gray-100 flex items-center">
        <AlertTriangle className="h-6 w-6 mr-2 text-red-400" />
        Contaminante Principal
      </h2>
      <div className="bg-gray-700 p-6 rounded-lg">
        <div className="text-center">
          <h3 className="text-3xl font-bold text-emerald-400 mb-2">
            {pollutant.contaminante}
          </h3>
          <div className="text-5xl font-bold text-gray-100 mb-2">
            {pollutant.valor_concentracion}
            <span className="text-2xl ml-1 text-gray-400">ppb</span>
          </div>
          <p className="text-sm text-gray-400">{pollutant.descripcion}</p>
        </div>
      </div>
    </div>
  );
}