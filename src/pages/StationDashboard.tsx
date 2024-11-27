import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
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