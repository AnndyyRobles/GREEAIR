import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

interface Props {
  stationId: number;
}

export default function AlertsTable({ stationId }: Props) {
  const { data: alerts } = useQuery({
    queryKey: ['alerts', stationId],
    queryFn: async () => {
      const { data } = await axios.get(`/api/stations/${stationId}/alerts`);
      return data;
    },
  });

  if (!alerts?.length) return null;

  const getAlertStyles = (nivel: string) => {
    const baseStyles = "px-3 py-1 rounded-full text-xs font-medium";
    switch (nivel.toLowerCase()) {
      case 'buena':
        return `${baseStyles} bg-emerald-900 text-emerald-200`;
      case 'moderada':
        return `${baseStyles} bg-yellow-900 text-yellow-200`;
      case 'mala':
        return `${baseStyles} bg-red-900 text-red-200`;
      default:
        return `${baseStyles} bg-gray-700 text-gray-200`;
    }
  };

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold text-gray-100">Alertas Recientes</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-700">
          <thead className="bg-gray-800">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                Nivel
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                Fecha
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                Contaminante
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                Concentración
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                Recomendaciones
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-700">
            {alerts.map((alert, index) => (
              <tr key={index} className="hover:bg-gray-700 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={getAlertStyles(alert.nivel_alerta)}>
                    {alert.nivel_alerta}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                  {format(new Date(alert.fecha), "d MMM yyyy HH:mm", { locale: es })}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="text-sm font-medium text-gray-100">
                    {alert.contaminante}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-100">{alert.concentracion} ppb</div>
                </td>
                <td className="px-6 py-4">
                  <p className="text-sm text-gray-400 line-clamp-2">{alert.recomendaciones}</p>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}