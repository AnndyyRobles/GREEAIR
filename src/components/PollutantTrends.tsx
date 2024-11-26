import { useQuery } from '@tanstack/react-query';
import { Line } from 'react-chartjs-2';
import axios from 'axios';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { Measurement } from '../types';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  TimeScale
} from 'chart.js';
import 'chartjs-adapter-date-fns';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  TimeScale
);

interface Props {
  stationId: number;
}

export default function PollutantTrends({ stationId }: Props) {
  const { data: measurements } = useQuery<Measurement[]>({
    queryKey: ['pollutantTrends', stationId],
    queryFn: async () => {
      const { data } = await axios.get(`/api/stations/${stationId}/trends`);
      return data;
    },
  });

  if (!measurements?.length) return null;

  const pollutants = [...new Set(measurements.map(m => m.contaminante))];
  
  const data = {
    datasets: pollutants.map(pollutant => ({
      label: pollutant,
      data: measurements
        .filter(m => m.contaminante === pollutant)
        .map(m => ({
          x: new Date(m.fecha).getTime(),
          y: m.valor_concentracion
        })),
      borderColor: getRandomColor(),
      tension: 0.4,
      fill: false
    }))
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
        text: 'Tendencias de Contaminantes',
        color: '#E5E7EB' // text-gray-200
      }
    },
    scales: {
      x: {
        type: 'time',
        time: {
          unit: 'hour',
          displayFormats: {
            hour: 'HH:mm'
          }
        },
        title: {
          display: true,
          text: 'Hora',
          color: '#E5E7EB' // text-gray-200
        },
        grid: {
          color: '#374151' // gray-700
        },
        ticks: {
          color: '#9CA3AF' // text-gray-400
        }
      },
      y: {
        title: {
          display: true,
          text: 'Concentración (ppb)',
          color: '#E5E7EB' // text-gray-200
        },
        grid: {
          color: '#374151' // gray-700
        },
        ticks: {
          color: '#9CA3AF' // text-gray-400
        }
      }
    }
  };

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold text-gray-100">Tendencias de Contaminantes</h2>
      <div className="bg-gray-800 p-4 rounded-lg">
        <Line data={data} options={options} />
      </div>
    </div>
  );
}

function getRandomColor() {
  const colors = [
    '#60A5FA', // blue-400
    '#34D399', // emerald-400
    '#FBBF24', // amber-400
    '#A78BFA', // purple-400
    '#F87171', // red-400
    '#2DD4BF', // teal-400
    '#FB923C', // orange-400
  ];
  return colors[Math.floor(Math.random() * colors.length)];
}