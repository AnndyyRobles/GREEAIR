import { MapPin, Building2, Globe2 } from 'lucide-react';
import { Station } from '../types';

interface Props {
  station: Station;
}

export default function StationInfo({ station }: Props) {
  return (
    <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-100">{station.nombre}</h2>
          <div className="mt-2 space-y-2">
            <div className="text-2xl md:text-2xl font-extrabold flex items-center text-gray-400">
              <MapPin className="h-4 w-4 mr-2" />
              <span>
                {station.latitud}, {station.longitud}
              </span>
            </div>
            <div className="flex items-center text-gray-400">
              <Building2 className="h-4 w-4 mr-2" />
              <span>{station.ciudad}</span>
            </div>
            <div className="flex items-center text-gray-400">
              <Globe2 className="h-4 w-4 mr-2" />
              <span>Región {station.id_region}</span>
            </div>
          </div>
        </div>
        
        <div className="bg-blue-900/50 p-4 rounded-lg">
          <div className="text-sm font-medium text-blue-200">Estado Actual</div>
          <div className="mt-1 text-2xl font-bold text-blue-100">Normal</div>
        </div>
      </div>
    </div>
  );
}