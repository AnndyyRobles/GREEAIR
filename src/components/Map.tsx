import { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Station } from '../types';

// Fix for default marker icon
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

interface MapProps {
  stations: Station[];
  onStationSelect: (station: Station) => void;
}

export default function Map({ stations, onStationSelect }: MapProps) {
  if (!stations?.length) return null;

  const center: [number, number] = [stations[0].latitud, stations[0].longitud];

  return (
    <div className="h-[400px] w-full rounded-lg overflow-hidden shadow-lg border border-gray-700">
      <MapContainer
        center={center}
        zoom={13}
        className="h-full w-full"
        style={{ background: '#1F2937' }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {stations.map((station) => (
          <Marker
            key={station.id_estacion}
            position={[station.latitud, station.longitud]}
          >
            <Popup>
              <div className="p-2">
                <h3 className="font-bold text-lg">{station.nombre}</h3>
                <p className="text-sm text-gray-600">{station.ciudad}</p>
                <button
                  onClick={() => onStationSelect(station)}
                  className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors text-sm"
                >
                  Ver detalles
                </button>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}