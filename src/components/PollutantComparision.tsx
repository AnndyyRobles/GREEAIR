import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface Props {
  stationId: number;
}

interface PollutantData {
  contaminante: string;
  valor_actual: number;
  limite_permitido: number;
}

export default function PollutantComparison({ stationId }: Props) {
  const { data: pollutants, isLoading, error } = useQuery<PollutantData[]>({
    queryKey: ['pollutants', stationId],
    queryFn: async () => {
      const { data } = await axios.get(`/api/stations/${stationId}/pollutants/comparison`);
      return data;
    },
  });

  if (isLoading) return <p className="text-gray-100">Cargando datos...</p>;
  if (error) return <p className="text-red-500">Error al cargar los datos de contaminantes.</p>;
  if (!pollutants?.length) return <p className="text-gray-100">No hay datos disponibles.</p>;

  const data = {
    labels: pollutants.map(p => p.contaminante),
    datasets: [
      {
        label: 'Valor Actual',
        data: pollutants.map(p => p.valor_actual),
        backgroundColor: 'rgba(52, 211, 153, 0.7)', // emerald-400
      },
      {
        label: 'Límite Permitido',
        data: pollutants.map(p => p.limite_permitido),
        backgroundColor: 'rgba(248, 113, 113, 0.7)', // red-400
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          color: '#E5E7EB' // text-gray-200
        }
      },
      title: {
        display: true,
        text: 'Comparación de Contaminantes',
        color: '#E5E7EB' // text-gray-200
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: '#374151' // gray-700
        },
        ticks: {
          color: '#9CA3AF' // text-gray-400
        },
        title: {
          display: true,
          text: 'Concentración (ppb)',
          color: '#E5E7EB' // text-gray-200
        },
      },
      x: {
        grid: {
          color: '#374151' // gray-700
        },
        ticks: {
          color: '#9CA3AF' // text-gray-400
        }
      }
    },
  };

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold text-gray-100">Comparación de Contaminantes</h2>
      <div className="bg-gray-800 p-4 rounded-lg">
        <Bar options={options} data={data} />
      </div>
    </div>
  );
}
