import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { Activity, AlertTriangle, CheckCircle, AlertCircle } from 'lucide-react';

interface Props {
  stationId: number;
}

interface AQIData {
  valor_calidad: number;
  indice_calidad: string;
  descripcion: string;
}

const getAQIColor = (value: number) => {
  if (value <= 50) return 'bg-emerald-900/50 text-emerald-200';
  if (value <= 100) return 'bg-yellow-900/50 text-yellow-200';
  if (value <= 150) return 'bg-orange-900/50 text-orange-200';
  if (value <= 200) return 'bg-red-900/50 text-red-200';
  return 'bg-purple-900/50 text-purple-200';
};

const getAQIIcon = (value: number) => {
  if (value <= 50) return CheckCircle;
  if (value <= 100) return Activity;
  if (value <= 150) return AlertCircle;
  return AlertTriangle;
};

export default function AirQualityIndex({ stationId }: Props) {
  const { data: aqi } = useQuery<AQIData>({
    queryKey: ['aqi', stationId],
    queryFn: async () => {
      const { data } = await axios.get(`/api/stations/${stationId}/aqi`);
      return data;
    },
  });

  if (!aqi) return null;

  const AQIIcon = getAQIIcon(aqi.valor_calidad);
  const colorClass = getAQIColor(aqi.valor_calidad);

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold text-gray-100">Índice de Calidad del Aire</h2>
      <div className={`${colorClass} rounded-lg p-6`}>
        <div className="flex items-center justify-between">
          <div>
            <div className="text-4xl font-bold mb-2">{aqi.valor_calidad}</div>
            <div className="text-lg font-medium">{aqi.indice_calidad}</div>
          </div>
          <AQIIcon className="h-12 w-12" />
        </div>
        <p className="mt-4 text-sm opacity-90">{aqi.descripcion}</p>
      </div>
    </div>
  );
}