import { useParams } from 'react-router-dom';
import { useQuery, useMutation } from '@tanstack/react-query';
import axios from 'axios';
import { useEffect, useState } from 'react';
import WeeklyHistory from '../components/WeeklyHistory';
import MainPollutant from '../components/MainPollutant';
import AlertsTable from '../components/AlertsTable';
import WeatherWidget from '../components/WeatherWidget';
import PollutantTrends from '../components/PollutantTrends';
import StationInfo from '../components/StationInfo';
import AirQualityIndex from '../components/AirQualityIndex';
import PollutantComparison from '../components/PollutantComparision';
import Map from '../components/Map';
import NearbyStations from '../components/NearbyStations';

export default function StationDashboard() {
  const { id } = useParams();
  const stationId = Number(id);

  const [isSubscribed, setIsSubscribed] = useState(false);
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  // Verificar si el usuario está logueado
  const isLoggedIn = !!user.id_usuario;

  // Consultar suscripción
  const { refetch: refetchSubscription } = useQuery({
    queryKey: ['subscription', stationId, user.id_usuario],
    queryFn: async () => {
      const { data } = await axios.get(`/api/users/${user.id_usuario}/stations/${stationId}`);
      return data;
    },
    enabled: isLoggedIn,
    onSuccess: (data) => {
      console.log('Suscripción verificada:', data);
      setIsSubscribed(data.isSubscribed);
    },
    onError: (err) => console.error('Error verificando suscripción:', err),
  });

  // Mutaciones de suscripción
  const subscribeMutation = useMutation({
    mutationFn: async () => {
      await axios.post(`/api/users/${user.id_usuario}/stations/${stationId}`);
    },
    onSuccess: () => {
      setIsSubscribed(true);
      refetchSubscription();
    },
  });

  const unsubscribeMutation = useMutation({
    mutationFn: async () => {
      await axios.delete(`/api/users/${user.id_usuario}/stations/${stationId}`);
    },
    onSuccess: () => {
      setIsSubscribed(false);
      refetchSubscription();
    },
  });

  const handleSubscription = () => {
    if (isSubscribed) {
      unsubscribeMutation.mutate();
    } else {
      subscribeMutation.mutate();
    }
  };

  // Cargar datos de la estación
  const { data: station, isLoading, error } = useQuery({
    queryKey: ['station', stationId],
    queryFn: async () => {
      const { data } = await axios.get(`/api/stations/${stationId}`);
      return data;
    },
  });

  if (isLoading) return <p>Cargando...</p>;
  if (error) return <p>Error al cargar la estación.</p>;

  return (
    <div className="space-y-6">
      <StationInfo station={station} />

      {/* Botón de Subscribir/Desuscribir */}
      {isLoggedIn && (
        <div className="flex justify-end">
          <button
            onClick={handleSubscription}
            className={`px-6 py-2 rounded-full text-white font-semibold transition-colors ${
              isSubscribed ? 'bg-orange-500 hover:bg-orange-400' : 'bg-yellow-500 hover:bg-yellow-400'
            }`}
          >
            {isSubscribed ? 'Desuscribir' : 'Subscribir'}
          </button>
        </div>
      )}

      <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
        <Map stations={[station]} onStationSelect={(selectedStation) => console.log(selectedStation)} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
          <AirQualityIndex stationId={stationId} />
        </div>
        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
          <WeatherWidget stationId={stationId} />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
          <MainPollutant stationId={stationId} />
        </div>
        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
          <PollutantComparison stationId={stationId} />
        </div>
      </div>

      <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
        <NearbyStations stationId={stationId} />
      </div>

      <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
        <PollutantTrends stationId={stationId} />
      </div>

      <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
        <WeeklyHistory stationId={stationId} />
      </div>

      <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
        <AlertsTable stationId={stationId} />
      </div>
    </div>
  );
}
