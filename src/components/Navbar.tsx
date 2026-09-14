import React from 'react';
import { Car, Users, CalendarCheck, Code2, Server } from 'lucide-react';

interface NavbarProps {
  currentTab: 'vehiculos' | 'clientes' | 'reservas' | 'api';
  onSelectTab: (tab: 'vehiculos' | 'clientes' | 'reservas' | 'api') => void;
  serverStatus: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({ currentTab, onSelectTab, serverStatus }) => {
  return (
    <header id="app-header" className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex items-center gap-3">
            <div id="brand-logo" className="h-10 w-10 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-sm">
              <Car className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span id="brand-name" className="text-xl font-bold text-slate-900 tracking-tight">Rentar</span>
                <span id="group-badge" className="px-2 py-0.5 text-xs font-semibold bg-blue-50 text-blue-700 rounded-md border border-blue-100">
                  Grupo D · UNLa
                </span>
              </div>
              <p className="text-xs text-slate-500 hidden sm:block">Sistema Web para Gestión de Alquiler de Vehículos</p>
            </div>
          </div>

          <nav id="main-nav" className="flex items-center gap-1 sm:gap-2">
            <button
              id="nav-tab-vehiculos"
              onClick={() => onSelectTab('vehiculos')}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                currentTab === 'vehiculos'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <Car className="w-4 h-4" />
              <span className="hidden md:inline">Vehículos</span>
            </button>

            <button
              id="nav-tab-clientes"
              onClick={() => onSelectTab('clientes')}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                currentTab === 'clientes'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <Users className="w-4 h-4" />
              <span className="hidden md:inline">Clientes</span>
            </button>

            <button
              id="nav-tab-reservas"
              onClick={() => onSelectTab('reservas')}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                currentTab === 'reservas'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <CalendarCheck className="w-4 h-4" />
              <span className="hidden md:inline">Reservas</span>
            </button>

            <button
              id="nav-tab-api"
              onClick={() => onSelectTab('api')}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                currentTab === 'api'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <Code2 className="w-4 h-4" />
              <span className="hidden md:inline">API / Swagger</span>
            </button>
          </nav>

          <div className="flex items-center gap-2 text-xs">
            <div
              id="server-status-pill"
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full border ${
                serverStatus
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                  : 'bg-amber-50 text-amber-700 border-amber-200'
              }`}
            >
              <span className={`w-2 h-2 rounded-full ${serverStatus ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'}`} />
              <span className="hidden sm:inline font-medium">{serverStatus ? 'API Online' : 'Conectando'}</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
