import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { format } from 'date-fns';

interface UserAlertsTableProps {
  stationId: number;
}

interface Alert {
  fecha: string;
  contaminante: string;
  concentracion: string;
  nivel_alerta: string;
}

export default function UserAlertsTable({ stationId }: UserAlertsTableProps) {
  const { data: alerts = [], isLoading } = useQuery<Alert[]>({
    queryKey: ['alerts', stationId],
    queryFn: async () => {
      const { data } = await axios.get(`/api/stations/${stationId}/alerts/latest`);
      return data;
    },
  });

  if (isLoading) return <p>Cargando alertas...</p>;
  if (!alerts.length) return <p>No hay alertas para esta estación.</p>;

  return (
    <div className="bg-gray-800 p-6 rounded-lg shadow-md text-gray-100">
      <h2 className="text-xl font-bold mb-4">Alertas Recientes</h2>
      <table className="w-full text-left text-sm">
        <thead className="bg-gray-700">
          <tr>
            <th className="py-2 px-4">Fecha</th>
            <th className="py-2 px-4">Contaminante</th>
            <th className="py-2 px-4">Concentración</th>
            <th className="py-2 px-4">Nivel</th>
          </tr>
        </thead>
        <tbody>
          {alerts.map((alert, index) => (
            <tr key={index} className="border-t border-gray-600">
              <td className="py-2 px-4">{format(new Date(alert.fecha), 'dd/MM/yyyy HH:mm')}</td>
              <td className="py-2 px-4">{alert.contaminante}</td>
              <td className="py-2 px-4">{alert.concentracion}</td>
              <td className="py-2 px-4">{alert.nivel_alerta}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
