import { useQuery } from '@tanstack/react-query';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import axios from 'axios';
import { Wind, AlertTriangle, ThermometerSun } from 'lucide-react';

interface Props {
  stationId: number;
}

interface HistoryData {
  fecha: string;
  contaminante: string;
  valor_concentracion: number | null;
  indice_calidad: string;
  valor_calidad: number;
}

const getQualityInfo = (valor: number) => {
  if (valor <= 50) return { color: 'bg-emerald-500/50', text: 'Buena', icon: Wind };
  if (valor <= 100) return { color: 'bg-yellow-500/50', text: 'Moderada', icon: ThermometerSun };
  if (valor <= 150) return { color: 'bg-orange-500/50', text: 'Dañina GS', icon: AlertTriangle };
  if (valor <= 200) return { color: 'bg-red-500/50', text: 'Dañina', icon: AlertTriangle };
  if (valor <= 300) return { color: 'bg-purple-500/50', text: 'Muy Dañina', icon: AlertTriangle };
  return { color: 'bg-red-900/50', text: 'Peligrosa', icon: AlertTriangle };
};

export default function WeeklyHistory({ stationId }: Props) {
  const { data: history, isLoading, error } = useQuery<HistoryData[]>({
    queryKey: ['weeklyHistory', stationId],
    queryFn: async () => {
      const { data } = await axios.get(`/api/stations/${stationId}/history`);
      return data;
    },
    enabled: !!stationId,
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-48">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-emerald-400"></div>
      </div>
    );
  }

  if (error || !history?.length) {
    return (
      <div className="text-center text-gray-400 py-8">
        No hay datos históricos disponibles
      </div>
    );
  }

  // Agrupar por día y tomar el promedio de valores
  const dailyData = history.reduce((acc: { [key: string]: HistoryData[] }, curr) => {
    const day = format(new Date(curr.fecha), 'yyyy-MM-dd');
    if (!acc[day]) {
      acc[day] = [];
    }
    acc[day].push(curr);
    return acc;
  }, {});

  const dailyAverages = Object.entries(dailyData).map(([day, measurements]) => {
    const avgQuality = measurements.reduce((sum, m) => sum + m.valor_calidad, 0) / measurements.length;
    const avgConcentration = measurements.reduce((sum, m) => sum + (m.valor_concentracion || 0), 0) / measurements.length;
    
    return {
      fecha: measurements[0].fecha,
      contaminante: measurements[0].contaminante,
      valor_concentracion: avgConcentration,
      indice_calidad: measurements[0].indice_calidad,
      valor_calidad: avgQuality,
    };
  }).slice(0, 7); // Últimos 7 días

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold text-gray-100">Historial Semanal</h2>
      <div className="grid grid-cols-1 md:grid-cols-7 gap-4">
        {dailyAverages.map((day, index) => {
          const qualityInfo = getQualityInfo(day.valor_calidad);
          const QualityIcon = qualityInfo.icon;
          const concentration = typeof day.valor_concentracion === 'number' 
            ? day.valor_concentracion.toFixed(1) 
            : '0.0';

          return (
            <div 
              key={index} 
              className="bg-gray-700 rounded-lg p-4 transition-all duration-300 hover:bg-gray-600"
            >
              <div className="text-center mb-3">
                <div className="text-sm font-medium text-gray-200">
                  {format(new Date(day.fecha), 'EEE d', { locale: es })}
                </div>
              </div>
              
              <div className="flex flex-col items-center space-y-3">
                {/* <div className={`w-full h-2 ${qualityInfo.color} rounded-full`} /> */}
                
                <div className="text-center">
                <div className="text-4xl md:text-4xl font-extrabold text-gray-100">
                  {day.contaminante}
                </div>
                  
                  <div className="mt-2 text-xs text-gray-400">
                    
                    
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}