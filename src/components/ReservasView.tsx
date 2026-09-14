import React, { useState } from 'react';
import { Plus, Calendar, Clock, DollarSign, XCircle, CheckCircle, RefreshCw, Car, User } from 'lucide-react';
import { Reserva, Cliente, Vehiculo } from '../types';

interface ReservasViewProps {
  reservas: Reserva[];
  clientes: Cliente[];
  vehiculos: Vehiculo[];
  loading: boolean;
  onRefresh: () => void;
  onNotification: (msg: string, type?: 'success' | 'error') => void;
  currentUser?: import('../types').UserSession;
}

export const ReservasView: React.FC<ReservasViewProps> = ({
  reservas,
  clientes,
  vehiculos,
  loading,
  onRefresh,
  onNotification,
  currentUser,
}) => {
  const [showModal, setShowModal] = useState(false);
  const isAdmin = currentUser?.rol === 'ADMIN';

  // Form State
  const [clienteId, setClienteId] = useState<string>('');
  const [vehiculoId, setVehiculoId] = useState<string>('');
  const [horaInicio, setHoraInicio] = useState<string>(() => {
    const today = new Date();
    today.setDate(today.getDate() + 1);
    return today.toISOString().split('T')[0];
  });
  const [horaFin, setHoraFin] = useState<string>(() => {
    const today = new Date();
    today.setDate(today.getDate() + 5);
    return today.toISOString().split('T')[0];
  });

  const availableVehicles = vehiculos.filter((v) => v.activo && v.estado === 'DISPONIBLE');
  const activeClients = clientes.filter((c) => c.activo);

  const selectedVehiculo = vehiculos.find((v) => v.id === Number(vehiculoId));

  // Calculate days & total
  const startDate = new Date(horaInicio);
  const endDate = new Date(horaFin);
  const diffTime = endDate.getTime() - startDate.getTime();
  const calculatedDays = isNaN(diffTime) || diffTime <= 0 ? 1 : Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  const estimatedTotal = selectedVehiculo ? calculatedDays * selectedVehiculo.precio_diario : 0;

  const handleOpenCreate = () => {
    if (!isAdmin && currentUser?.clienteId) {
      setClienteId(String(currentUser.clienteId));
    } else if (activeClients.length > 0) {
      setClienteId(String(activeClients[0].id));
    }
    if (availableVehicles.length > 0) setVehiculoId(String(availableVehicles[0].id));
    setShowModal(true);
  };

  // Filter reservations: If client, only show their own reservations. If admin, show all.
  const displayedReservas = isAdmin
    ? reservas
    : reservas.filter((r) => r.clienteId === currentUser?.clienteId);

  const handleCreateReserva = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!clienteId || !vehiculoId) {
      onNotification('Seleccione un cliente y un vehículo disponible', 'error');
      return;
    }

    try {
      const res = await fetch('/api/reservas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          clienteId: Number(clienteId),
          vehiculoId: Number(vehiculoId),
          horaInicio: new Date(horaInicio).toISOString(),
          horaFin: new Date(horaFin).toISOString(),
        }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Error al generar la reserva');
      }

      onNotification('Reserva confirmada con éxito. El vehículo ahora está RESERVADO.');
      setShowModal(false);
      onRefresh();
    } catch (err: any) {
      onNotification(err.message, 'error');
    }
  };

  const handleCancelReserva = async (id: number) => {
    if (!window.confirm('¿Desea cancelar esta reserva? El vehículo volverá a estar disponible.')) return;
    try {
      const res = await fetch(`/api/reservas/${id}`, { method: 'DELETE' });
      if (!res.ok) {
        throw new Error('Error al cancelar la reserva');
      }
      onNotification('Reserva cancelada y vehículo liberado a DISPONIBLE.');
      onRefresh();
    } catch (err: any) {
      onNotification(err.message, 'error');
    }
  };

  const getStatusBadge = (estado: string) => {
    switch (estado) {
      case 'CONFIRMADA':
        return (
          <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
            Confirmada
          </span>
        );
      case 'CANCELADA':
        return (
          <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-red-50 text-red-700 border border-red-200">
            Cancelada
          </span>
        );
      case 'FINALIZADA':
        return (
          <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-slate-100 text-slate-700 border border-slate-200">
            Finalizada
          </span>
        );
      default:
        return <span>{estado}</span>;
    }
  };

  return (
    <div id="reservas-section" className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 id="reservas-heading" className="text-2xl font-bold text-slate-900 tracking-tight">
            Gestión de Reservas y Alquileres
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Registro de alquileres, cálculo de importes y estado de reservas (Endpoints REST /api/reservas)
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            id="btn-refresh-reservas"
            onClick={onRefresh}
            className="p-2 text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors shadow-2xs"
            title="Refrescar lista"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
          <button
            id="btn-nueva-reserva"
            onClick={handleOpenCreate}
            disabled={availableVehicles.length === 0}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 text-white px-4 py-2 rounded-lg text-sm font-medium shadow-xs transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Nueva Reserva</span>
          </button>
        </div>
      </div>

      {availableVehicles.length === 0 && (
        <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-sm flex items-center gap-3">
          <Clock className="w-5 h-5 shrink-0 text-amber-600" />
          <span>No hay vehículos con estado DISPONIBLE para reservar en este momento. Puede registrar un nuevo vehículo o liberar una reserva activa.</span>
        </div>
      )}

      {/* Table */}
      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-2xs">
        <div className="overflow-x-auto">
          <table id="table-reservas" className="w-full text-left text-sm text-slate-600">
            <thead className="bg-slate-50 text-slate-700 font-semibold border-b border-slate-200 text-xs uppercase tracking-wider">
              <tr>
                <th className="px-6 py-3.5">ID / Estado</th>
                <th className="px-6 py-3.5">Cliente</th>
                <th className="px-6 py-3.5">Vehículo Reservado</th>
                <th className="px-6 py-3.5">Fechas / Duración</th>
                <th className="px-6 py-3.5">Importe Total</th>
                <th className="px-6 py-3.5 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {displayedReservas.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-12 text-slate-400">
                    <Calendar className="w-8 h-8 mx-auto mb-2 text-slate-300" />
                    {isAdmin ? 'No hay reservas registradas.' : 'No tienes reservas registradas actualmente.'}
                  </td>
                </tr>
              ) : (
                displayedReservas.map((r) => (
                  <tr key={r.id} id={`reserva-row-${r.id}`} className="hover:bg-slate-50/70 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-bold text-slate-900">#{r.id}</div>
                      <div className="mt-1">{getStatusBadge(r.estado)}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-semibold text-slate-900">{r.clienteNombre}</div>
                      <div className="text-xs text-slate-400">Cliente ID #{r.clienteId}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-medium text-slate-800">{r.vehiculoInfo}</div>
                      <div className="text-xs text-slate-400">Vehículo ID #{r.vehiculoId}</div>
                    </td>
                    <td className="px-6 py-4 text-xs space-y-1">
                      <div className="text-slate-700 font-medium">
                        {new Date(r.horaInicio).toLocaleDateString('es-AR')} → {new Date(r.horaFin).toLocaleDateString('es-AR')}
                      </div>
                      <div className="text-slate-400">{r.duracionDias} días de alquiler</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-bold text-slate-900 text-base">
                        ${Number(r.importeTotal).toLocaleString('es-AR')}
                      </div>
                      <div className="text-xs text-slate-400">
                        (${Number(r.precioDiarioHistorico).toLocaleString('es-AR')}/día)
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      {r.estado === 'CONFIRMADA' && (
                        <button
                          id={`btn-cancel-reserva-${r.id}`}
                          onClick={() => handleCancelReserva(r.id)}
                          className="px-3 py-1.5 text-xs font-semibold text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors border border-red-200"
                        >
                          Cancelar
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Nueva Reserva */}
      {showModal && (
        <div
          id="modal-reserva-backdrop"
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in"
        >
          <div
            id="modal-reserva-content"
            className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-xl border border-slate-200"
          >
            <h2 id="modal-reserva-title" className="text-lg font-bold text-slate-900 mb-4">
              Registrar Nueva Reserva
            </h2>
            <form onSubmit={handleCreateReserva} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Cliente *</label>
                <select
                  id="select-reserva-cliente"
                  value={clienteId}
                  disabled={!isAdmin}
                  onChange={(e) => setClienteId(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-slate-100 disabled:text-slate-500"
                  required
                >
                  {activeClients.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.nombre} {c.apellido} (DNI: {c.documento})
                    </option>
                  ))}
                </select>
                {!isAdmin && (
                  <span className="text-[11px] text-slate-400 mt-1 block">
                    Reserva asignada automáticamente a tu perfil de cliente.
                  </span>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Vehículo Disponible *</label>
                <select
                  id="select-reserva-vehiculo"
                  value={vehiculoId}
                  onChange={(e) => setVehiculoId(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  {availableVehicles.map((v) => (
                    <option key={v.id} value={v.id}>
                      {v.marca} {v.modelo} ({v.patente}) — ${Number(v.precio_diario).toLocaleString('es-AR')}/día
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Fecha de Inicio *</label>
                  <input
                    id="input-reserva-inicio"
                    type="date"
                    required
                    value={horaInicio}
                    onChange={(e) => setHoraInicio(e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Fecha de Fin *</label>
                  <input
                    id="input-reserva-fin"
                    type="date"
                    required
                    value={horaFin}
                    onChange={(e) => setHoraFin(e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              {/* Estimate calculation card */}
              <div className="p-4 bg-blue-50/70 border border-blue-100 rounded-xl space-y-2">
                <div className="flex justify-between text-xs text-blue-800 font-medium">
                  <span>Duración estimada:</span>
                  <span>{calculatedDays} días</span>
                </div>
                <div className="flex justify-between text-xs text-blue-800 font-medium">
                  <span>Tarifa por día:</span>
                  <span>${selectedVehiculo?.precio_diario.toLocaleString('es-AR') || 0}</span>
                </div>
                <div className="flex justify-between text-sm font-bold text-blue-950 pt-2 border-t border-blue-200/60">
                  <span>Importe Total Estimado:</span>
                  <span>${estimatedTotal.toLocaleString('es-AR')}</span>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  id="btn-cancel-modal-reserva"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  id="btn-confirm-modal-reserva"
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors shadow-xs"
                >
                  Confirmar Reserva
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
