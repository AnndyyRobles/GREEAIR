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
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  useEffect(() => {
    setIsLoggedIn(!!user.id_usuario); // Verificar si hay sesión activa
  }, []);

  // Verificar si el usuario está suscrito
  const { data: subscriptionData, refetch: refetchSubscription } = useQuery({
    queryKey: ['subscription', stationId, user.id_usuario],
    queryFn: async () => {
      const { data } = await axios.get(`/api/users/${user.id_usuario}/stations/${stationId}`);
      return data;
    },
    enabled: isLoggedIn, // Solo ejecutar si el usuario está logeado
    onSuccess: (data) => setIsSubscribed(data.isSubscribed),
  });

  // Suscribir al usuario
  const subscribeMutation = useMutation({
    mutationFn: async () => {
      await axios.post(`/api/users/${user.id_usuario}/stations/${stationId}`);
    },
    onSuccess: () => {
      setIsSubscribed(true);
      refetchSubscription();
    },
  });

  // Desuscribir al usuario
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

  const { data: station, isLoading, error } = useQuery({
    queryKey: ['station', stationId],
    queryFn: async () => {
      const { data } = await axios.get(`/api/stations/${stationId}`);
      return data;
    },
    retry: 3,
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-emerald-400"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen text-red-400">
        <p>Error al cargar los datos de la estación. Por favor, intente nuevamente.</p>
      </div>
    );
  }

  if (!station) return null;

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
