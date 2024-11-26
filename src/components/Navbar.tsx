import { Link, useLocation } from 'react-router-dom';
import { MapPin, BarChart2 } from 'lucide-react';

export default function Navbar() {
  const location = useLocation();

  const links = [
    { to: '/', icon: MapPin, label: 'Estaciones' },
    { to: '/statistics', icon: BarChart2, label: 'Estadísticas Globales' },
  ];

  return (
    <nav className="bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex space-x-8">
          {links.map(({ to, icon: Icon, label }) => (
            <Link
              key={to}
              to={to}
              className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                location.pathname === to
                  ? 'border-blue-500 text-gray-900'
                  : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
              }`}
            >
              <Icon className="h-4 w-4 mr-2" />
              {label}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
}