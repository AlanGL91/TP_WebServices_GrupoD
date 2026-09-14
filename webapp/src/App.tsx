import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { VehiculosView } from './components/VehiculosView';
import { ClientesView } from './components/ClientesView';
import { ReservasView } from './components/ReservasView';
import { ApiExplorerView } from './components/ApiExplorerView';
import { LoginView } from './components/LoginView';
import { Vehiculo, Cliente, Reserva, UserSession } from './types';
import { Car, Users, CalendarCheck, CheckCircle2, AlertCircle, ShieldAlert } from 'lucide-react';

export default function App() {
  const [currentUser, setCurrentUser] = useState<UserSession | null>(null);
  const [currentTab, setCurrentTab] = useState<'vehiculos' | 'clientes' | 'reservas' | 'api'>('vehiculos');
  const [vehiculos, setVehiculos] = useState<Vehiculo[]>([]);
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [reservas, setReservas] = useState<Reserva[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [serverStatus, setServerStatus] = useState<boolean>(false);
  const [mysqlStatus, setMysqlStatus] = useState<{ ok: boolean; message: string } | null>(null);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 4000);
  };

  const loadData = async () => {
    setLoading(true);
    try {
      const [vRes, cRes, rRes, hRes, mRes] = await Promise.all([
        fetch('/api/vehiculos'),
        fetch('/api/clientes'),
        fetch('/api/reservas'),
        fetch('/api/health'),
        fetch('/api/health/mysql'),
      ]);

      if (vRes.ok) {
        const vData = await vRes.json();
        setVehiculos(vData);
      }
      if (cRes.ok) {
        const cData = await cRes.json();
        setClientes(cData);
      }
      if (rRes.ok) {
        const rData = await rRes.json();
        setReservas(rData);
      }
      if (hRes.ok) {
        setServerStatus(true);
      }
      if (mRes) {
        const mData = await mRes.json();
        setMysqlStatus(mData);
      }
    } catch (err) {
      console.error('Error fetching data:', err);
      setServerStatus(false);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (currentUser) {
      loadData();
    }
  }, [currentUser]);

  const handleLoginSuccess = (user: UserSession) => {
    setCurrentUser(user);
    // Si el usuario es CLIENTE, iniciar directamente en la pestaña de vehículos
    setCurrentTab('vehiculos');
    showToast(`Bienvenido/a, ${user.nombre || user.email}! Perfil: ${user.rol}`);
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setCurrentTab('vehiculos');
    showToast('Sesión cerrada correctamente');
  };

  // PANTALLA DE LOGIN POR DEFECTO SI NO ESTÁ AUTENTICADO
  if (!currentUser) {
    return <LoginView onLoginSuccess={handleLoginSuccess} />;
  }

  const isAdmin = currentUser.rol === 'ADMIN';
  const totalVehiculos = vehiculos.length;
  const disponibles = vehiculos.filter((v) => v.activo && v.estado === 'DISPONIBLE').length;
  const totalClientes = clientes.filter((c) => c.activo).length;
  const userReservas = isAdmin
    ? reservas
    : reservas.filter((r) => r.clienteId === currentUser.clienteId);
  const reservasActivas = userReservas.filter((r) => r.estado === 'CONFIRMADA').length;

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Navbar
        currentTab={currentTab}
        onSelectTab={setCurrentTab}
        serverStatus={serverStatus}
        mysqlStatus={mysqlStatus}
        currentUser={currentUser}
        onLogout={handleLogout}
      />

      {/* Toast Notification */}
      {toast && (
        <div
          id="app-toast-notification"
          className={`fixed top-20 right-4 z-50 flex items-center gap-2.5 px-4 py-3 rounded-xl shadow-lg border text-sm font-medium transition-all ${
            toast.type === 'success'
              ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
              : 'bg-red-50 text-red-800 border-red-200'
          }`}
        >
          {toast.type === 'success' ? (
            <CheckCircle2 className="w-5 h-5 text-emerald-600" />
          ) : (
            <AlertCircle className="w-5 h-5 text-red-600" />
          )}
          <span>{toast.message}</span>
        </div>
      )}

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Banner informativo de perfil activo */}
        <div
          id="active-profile-banner"
          className={`p-3.5 rounded-xl border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs ${
            isAdmin
              ? 'bg-blue-50 border-blue-200 text-blue-900'
              : 'bg-emerald-50 border-emerald-200 text-emerald-900'
          }`}
        >
          <div className="flex items-center gap-2">
            <span className="font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-white/80 border border-current">
              Perfil: {currentUser.rol}
            </span>
            <span>
              {isAdmin
                ? 'Permisos activos: ABM completo de Clientes, Vehículos y Reservas.'
                : 'Permisos activos: Consulta de Vehículos y Gestión de Reservas propias.'}
            </span>
          </div>
          <span className="font-mono text-[11px] text-slate-500">
            Sesión: {currentUser.email}
          </span>
        </div>

        {/* KPI Overview Metrics */}
        <section id="metrics-overview" className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Flota Total</span>
              <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                <Car className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-2xl font-bold text-slate-900">{totalVehiculos}</span>
              <span className="text-xs text-slate-500">unidades</span>
            </div>
          </div>

          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Disponibles</span>
              <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg">
                <CheckCircle2 className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-2xl font-bold text-emerald-600">{disponibles}</span>
              <span className="text-xs text-slate-500">listos para alquilar</span>
            </div>
          </div>

          {isAdmin ? (
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Clientes Activos</span>
                <div className="p-2 bg-purple-50 text-purple-600 rounded-lg">
                  <Users className="w-4 h-4" />
                </div>
              </div>
              <div className="mt-2 flex items-baseline gap-2">
                <span className="text-2xl font-bold text-slate-900">{totalClientes}</span>
                <span className="text-xs text-slate-500">registrados</span>
              </div>
            </div>
          ) : (
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Mi Perfil</span>
                <div className="p-2 bg-purple-50 text-purple-600 rounded-lg">
                  <Users className="w-4 h-4" />
                </div>
              </div>
              <div className="mt-2 flex items-baseline gap-2">
                <span className="text-lg font-bold text-slate-900 truncate max-w-[150px]">
                  {currentUser.nombre || 'Cliente'}
                </span>
              </div>
            </div>
          )}

          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                {isAdmin ? 'Reservas Activas' : 'Mis Reservas'}
              </span>
              <div className="p-2 bg-amber-50 text-amber-600 rounded-lg">
                <CalendarCheck className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-2xl font-bold text-amber-600">{reservasActivas}</span>
              <span className="text-xs text-slate-500">confirmadas</span>
            </div>
          </div>
        </section>

        {/* Tab Content */}
        {currentTab === 'vehiculos' && (
          <VehiculosView
            vehiculos={vehiculos}
            loading={loading}
            onRefresh={loadData}
            onNotification={showToast}
            isAdmin={isAdmin}
          />
        )}

        {currentTab === 'clientes' && (
          isAdmin ? (
            <ClientesView
              clientes={clientes}
              loading={loading}
              onRefresh={loadData}
              onNotification={showToast}
            />
          ) : (
            <div className="bg-white p-12 text-center rounded-2xl border border-slate-200 shadow-2xs">
              <ShieldAlert className="w-12 h-12 text-red-500 mx-auto mb-3" />
              <h2 className="text-lg font-bold text-slate-900">Acceso No Autorizado (HTTP 403 Forbidden)</h2>
              <p className="text-sm text-slate-500 mt-1 max-w-md mx-auto">
                El perfil CLIENTE no tiene permisos para acceder al módulo de gestión y ABM de clientes. Esta vista está restringida para el rol ROLE_ADMIN.
              </p>
              <button
                onClick={() => setCurrentTab('vehiculos')}
                className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
              >
                Volver a Catálogo de Vehículos
              </button>
            </div>
          )
        )}

        {currentTab === 'reservas' && (
          <ReservasView
            reservas={reservas}
            clientes={clientes}
            vehiculos={vehiculos}
            loading={loading}
            onRefresh={loadData}
            onNotification={showToast}
            currentUser={currentUser}
          />
        )}

        {currentTab === 'api' && <ApiExplorerView />}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-6 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-700">Rentar</span>
            <span>·</span>
            <span>Trabajo Práctico Web Services — Grupo D · C2 · 2026 · UNLa</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="px-2 py-0.5 rounded bg-slate-100 font-mono text-slate-600">Spring Security FormLogin + RBAC</span>
            <span>Node.js 22 + Express + React</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
