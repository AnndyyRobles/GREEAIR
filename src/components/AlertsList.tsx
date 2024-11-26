import { Alert } from '../types';
import { AlertTriangle } from 'lucide-react';

interface AlertsListProps {
  alerts: Alert[];
}

export default function AlertsList({ alerts }: AlertsListProps) {
  const getAlertColor = (nivel: string) => {
    switch (nivel.toLowerCase()) {
      case 'alto':
        return 'bg-red-100 text-red-800';
      case 'medio':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-green-100 text-green-800';
    }
  };

  return (
    <div className="space-y-4">
      {alerts.map((alert) => (
        <div
          key={alert.id_alerta}
          className={`p-4 rounded-lg ${getAlertColor(alert.nivel_alerta)}`}
        >
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5" />
            <h3 className="font-semibold">{alert.mensaje}</h3>
          </div>
          <p className="mt-2 text-sm">{alert.recomendaciones}</p>
          <div className="mt-2 text-xs opacity-75">
            {new Date(alert.fecha).toLocaleString()} - {alert.estacion}
          </div>
        </div>
      ))}
    </div>
  );
}