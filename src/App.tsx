import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { VehiculosView } from './components/VehiculosView';
import { ClientesView } from './components/ClientesView';
import { ReservasView } from './components/ReservasView';
import { ApiExplorerView } from './components/ApiExplorerView';
import { Vehiculo, Cliente, Reserva } from './types';
import { Car, Users, CalendarCheck, CheckCircle2, AlertCircle, Sparkles } from 'lucide-react';

export default function App() {
  const [currentTab, setCurrentTab] = useState<'vehiculos' | 'clientes' | 'reservas' | 'api'>('vehiculos');
  const [vehiculos, setVehiculos] = useState<Vehiculo[]>([]);
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [reservas, setReservas] = useState<Reserva[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [serverStatus, setServerStatus] = useState<boolean>(false);
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
      const [vRes, cRes, rRes, hRes] = await Promise.all([
        fetch('/api/vehiculos'),
        fetch('/api/clientes'),
        fetch('/api/reservas'),
        fetch('/api/health'),
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
    } catch (err) {
      console.error('Error fetching data:', err);
      setServerStatus(false);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const totalVehiculos = vehiculos.length;
  const disponibles = vehiculos.filter((v) => v.activo && v.estado === 'DISPONIBLE').length;
  const totalClientes = clientes.filter((c) => c.activo).length;
  const reservasActivas = reservas.filter((r) => r.estado === 'CONFIRMADA').length;

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Navbar currentTab={currentTab} onSelectTab={setCurrentTab} serverStatus={serverStatus} />

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

          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Reservas Activas</span>
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
          />
        )}

        {currentTab === 'clientes' && (
          <ClientesView
            clientes={clientes}
            loading={loading}
            onRefresh={loadData}
            onNotification={showToast}
          />
        )}

        {currentTab === 'reservas' && (
          <ReservasView
            reservas={reservas}
            clientes={clientes}
            vehiculos={vehiculos}
            loading={loading}
            onRefresh={loadData}
            onNotification={showToast}
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
            <span className="px-2 py-0.5 rounded bg-slate-100 font-mono text-slate-600">REST API & Swagger</span>
            <span>Node.js 22 + Express + React</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
