import { Link, Outlet } from 'react-router-dom';
import { Activity } from 'lucide-react';

export default function Layout() {
  return (
    <div className="min-h-screen bg-gray-900">
      <header className="bg-gray-800 border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <Link to="/" className="flex items-center group">
            <Activity className="h-8 w-8 text-emerald-400 group-hover:text-emerald-300 transition-colors" />
            <h1 className="ml-2 text-2xl font-bold bg-gradient-to-r from-emerald-400 to-blue-400 bg-clip-text text-transparent group-hover:from-emerald-300 group-hover:to-blue-300 transition-colors">
              GreenAir
            </h1>
          </Link>
        </div>
      </header>
      <main className="max-w-7xl mx-auto px-4 py-6">
        <Outlet />
      </main>
    </div>
  );
}