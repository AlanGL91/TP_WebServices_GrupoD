import React from 'react';
import { Car, Users, CalendarCheck, Code2, LogOut, ShieldCheck, User, Database } from 'lucide-react';
import { UserSession } from '../types';

interface NavbarProps {
  currentTab: 'vehiculos' | 'clientes' | 'reservas' | 'api';
  onSelectTab: (tab: 'vehiculos' | 'clientes' | 'reservas' | 'api') => void;
  serverStatus: boolean;
  mysqlStatus?: { ok: boolean; message: string } | null;
  currentUser: UserSession;
  onLogout: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  onSelectTab,
  serverStatus,
  mysqlStatus,
  currentUser,
  onLogout,
}) => {
  const isAdmin = currentUser.rol === 'ADMIN';

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

            {/* Solo ADMIN puede ver la pestaña de Clientes */}
            {isAdmin && (
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
                <span className="hidden md:inline">Clientes (ABM)</span>
              </button>
            )}

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

          <div className="flex items-center gap-3">
            {/* MySQL Status Indicator */}
            {mysqlStatus && (
              <div
                id="mysql-status-badge"
                title={mysqlStatus.message}
                className={`hidden lg:flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-semibold border ${
                  mysqlStatus.ok
                    ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                    : 'bg-amber-50 text-amber-800 border-amber-200'
                }`}
              >
                <Database className="w-3.5 h-3.5" />
                <span>{mysqlStatus.ok ? 'MySQL: Conectado' : 'MySQL: No detectado'}</span>
              </div>
            )}

            {/* User Profile Pill */}
            <div id="user-profile-badge" className="flex items-center gap-2 px-2.5 py-1 rounded-xl bg-slate-100 border border-slate-200 text-xs">
              {isAdmin ? (
                <div className="w-6 h-6 rounded-lg bg-blue-600 text-white flex items-center justify-center font-bold">
                  <ShieldCheck className="w-3.5 h-3.5" />
                </div>
              ) : (
                <div className="w-6 h-6 rounded-lg bg-emerald-600 text-white flex items-center justify-center font-bold">
                  <User className="w-3.5 h-3.5" />
                </div>
              )}
              <div className="hidden sm:block text-left">
                <div className="font-semibold text-slate-800 leading-tight flex items-center gap-1">
                  <span>{currentUser.nombre || currentUser.email}</span>
                </div>
                <span className={`text-[10px] font-bold uppercase tracking-wider ${isAdmin ? 'text-blue-600' : 'text-emerald-600'}`}>
                  {currentUser.rol}
                </span>
              </div>
            </div>

            {/* Logout Button */}
            <button
              id="btn-logout"
              onClick={onLogout}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-red-600 hover:text-red-700 bg-red-50 hover:bg-red-100 rounded-lg border border-red-200 transition-colors cursor-pointer"
              title="Cerrar sesión"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Cerrar Sesión</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
