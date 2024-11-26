import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { Measurement } from '../types';
import { format } from 'date-fns';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

interface AirQualityChartProps {
  measurements: Measurement[];
}

export default function AirQualityChart({ measurements }: AirQualityChartProps) {
  const data = {
    labels: measurements.map(m => format(new Date(m.fecha), 'HH:mm dd/MM')),
    datasets: [
      {
        label: 'Índice de Calidad del Aire',
        data: measurements.map(m => m.valor_calidad),
        borderColor: 'rgb(75, 192, 192)',
        tension: 0.1
      }
    ]
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Evolución de la Calidad del Aire'
      }
    }
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-lg">
      <Line options={options} data={data} />
    </div>
  );
}