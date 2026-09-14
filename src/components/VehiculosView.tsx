import React, { useState } from 'react';
import { Plus, Search, Filter, Trash2, Edit2, CheckCircle2, AlertCircle, Car, RefreshCw } from 'lucide-react';
import { Vehiculo, TipoVehiculo, EstadoVehiculo } from '../types';

interface VehiculosViewProps {
  vehiculos: Vehiculo[];
  loading: boolean;
  onRefresh: () => void;
  onNotification: (msg: string, type?: 'success' | 'error') => void;
  isAdmin?: boolean;
}

export const VehiculosView: React.FC<VehiculosViewProps> = ({
  vehiculos,
  loading,
  onRefresh,
  onNotification,
  isAdmin = true,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [tipoFilter, setTipoFilter] = useState<string>('TODOS');
  const [estadoFilter, setEstadoFilter] = useState<string>('TODOS');
  const [showModal, setShowModal] = useState(false);
  const [editingVehiculo, setEditingVehiculo] = useState<Vehiculo | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    patente: '',
    marca: '',
    modelo: '',
    anio: new Date().getFullYear(),
    tipoVehiculo: 'SEDAN' as TipoVehiculo,
    color: 'Blanco',
    precio_diario: 45000,
    estado: 'DISPONIBLE' as EstadoVehiculo,
  });

  const handleOpenCreate = () => {
    setEditingVehiculo(null);
    setFormData({
      patente: '',
      marca: '',
      modelo: '',
      anio: new Date().getFullYear(),
      tipoVehiculo: 'SEDAN',
      color: 'Blanco',
      precio_diario: 45000,
      estado: 'DISPONIBLE',
    });
    setShowModal(true);
  };

  const handleOpenEdit = (v: Vehiculo) => {
    setEditingVehiculo(v);
    setFormData({
      patente: v.patente,
      marca: v.marca,
      modelo: v.modelo,
      anio: v.anio,
      tipoVehiculo: v.tipoVehiculo,
      color: v.color,
      precio_diario: v.precio_diario,
      estado: v.estado,
    });
    setShowModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingVehiculo) {
        const res = await fetch(`/api/vehiculos/${editingVehiculo.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData),
        });
        if (!res.ok) {
          const err = await res.json();
          throw new Error(err.error || 'Error al actualizar vehículo');
        }
        onNotification('Vehículo actualizado exitosamente');
      } else {
        const res = await fetch('/api/vehiculos', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData),
        });
        if (!res.ok) {
          const err = await res.json();
          throw new Error(err.error || 'Error al registrar vehículo');
        }
        onNotification('Vehículo registrado exitosamente con estado DISPONIBLE');
      }
      setShowModal(false);
      onRefresh();
    } catch (err: any) {
      onNotification(err.message, 'error');
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('¿Confirma la baja lógica de este vehículo?')) return;
    try {
      const res = await fetch(`/api/vehiculos/${id}`, { method: 'DELETE' });
      if (!res.ok) {
        throw new Error('Error al dar de baja el vehículo');
      }
      onNotification('Vehículo dado de baja (activo = false)');
      onRefresh();
    } catch (err: any) {
      onNotification(err.message, 'error');
    }
  };

  const filteredVehiculos = vehiculos.filter((v) => {
    const matchesSearch =
      v.patente.toLowerCase().includes(searchTerm.toLowerCase()) ||
      v.marca.toLowerCase().includes(searchTerm.toLowerCase()) ||
      v.modelo.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTipo = tipoFilter === 'TODOS' || v.tipoVehiculo === tipoFilter;
    const matchesEstado = estadoFilter === 'TODOS' || v.estado === estadoFilter;
    return matchesSearch && matchesTipo && matchesEstado;
  });

  const getStatusBadge = (estado: EstadoVehiculo, activo: boolean) => {
    if (!activo) {
      return (
        <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-slate-100 text-slate-500 border border-slate-200">
          Inactivo (Baja)
        </span>
      );
    }
    switch (estado) {
      case 'DISPONIBLE':
        return (
          <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
            Disponible
          </span>
        );
      case 'RESERVADO':
        return (
          <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-amber-50 text-amber-700 border border-amber-200">
            Reservado
          </span>
        );
      case 'EN_ALQUILER':
        return (
          <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-purple-50 text-purple-700 border border-purple-200">
            En Alquiler
          </span>
        );
    }
  };

  return (
    <div id="vehiculos-section" className="space-y-6">
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 id="vehiculos-heading" className="text-2xl font-bold text-slate-900 tracking-tight">
            Gestión de Vehículos
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Administración de flota, disponibilidad y tarifas diarias (Endpoints REST /api/vehiculos)
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            id="btn-refresh-vehiculos"
            onClick={onRefresh}
            className="p-2 text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors shadow-2xs"
            title="Refrescar lista"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
          {isAdmin && (
            <button
              id="btn-nuevo-vehiculo"
              onClick={handleOpenCreate}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium shadow-xs transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>Nuevo Vehículo</span>
            </button>
          )}
        </div>
      </div>

      {/* Filters Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            id="input-search-vehiculos"
            type="text"
            placeholder="Buscar por patente, marca o modelo..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-slate-50"
          />
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          <div className="flex items-center gap-2 text-xs font-medium text-slate-500">
            <Filter className="w-3.5 h-3.5" />
            <span>Tipo:</span>
            <select
              id="select-tipo-vehiculo"
              value={tipoFilter}
              onChange={(e) => setTipoFilter(e.target.value)}
              className="text-xs bg-slate-50 border border-slate-200 rounded-md px-2 py-1.5 focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              <option value="TODOS">Todos los tipos</option>
              <option value="SEDAN">Sedán</option>
              <option value="SUV">SUV</option>
              <option value="PICKUP">Pickup</option>
              <option value="COUPE">Coupé</option>
              <option value="HATCHBACK">Hatchback</option>
            </select>
          </div>

          <div className="flex items-center gap-2 text-xs font-medium text-slate-500">
            <span>Estado:</span>
            <select
              id="select-estado-vehiculo"
              value={estadoFilter}
              onChange={(e) => setEstadoFilter(e.target.value)}
              className="text-xs bg-slate-50 border border-slate-200 rounded-md px-2 py-1.5 focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              <option value="TODOS">Todos los estados</option>
              <option value="DISPONIBLE">Disponible</option>
              <option value="RESERVADO">Reservado</option>
              <option value="EN_ALQUILER">En Alquiler</option>
            </select>
          </div>
        </div>
      </div>

      {/* Vehicles Grid / Table */}
      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-2xs">
        <div className="overflow-x-auto">
          <table id="table-vehiculos" className="w-full text-left text-sm text-slate-600">
            <thead className="bg-slate-50 text-slate-700 font-semibold border-b border-slate-200 text-xs uppercase tracking-wider">
              <tr>
                <th className="px-6 py-3.5">Vehículo</th>
                <th className="px-6 py-3.5">Patente</th>
                <th className="px-6 py-3.5">Tipo / Año</th>
                <th className="px-6 py-3.5">Color</th>
                <th className="px-6 py-3.5">Tarifa Diaria</th>
                <th className="px-6 py-3.5">Estado</th>
                <th className="px-6 py-3.5 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredVehiculos.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-12 text-slate-400">
                    <Car className="w-8 h-8 mx-auto mb-2 text-slate-300" />
                    No se encontraron vehículos que coincidan con la búsqueda.
                  </td>
                </tr>
              ) : (
                filteredVehiculos.map((v) => (
                  <tr
                    key={v.id}
                    id={`vehiculo-row-${v.id}`}
                    className={`hover:bg-slate-50/70 transition-colors ${!v.activo ? 'opacity-60 bg-slate-50/30' : ''}`}
                  >
                    <td className="px-6 py-4">
                      <div className="font-semibold text-slate-900">
                        {v.marca} {v.modelo}
                      </div>
                      <div className="text-xs text-slate-400">ID #{v.id}</div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="font-mono px-2 py-0.5 rounded-md bg-slate-100 text-slate-800 border border-slate-200 text-xs font-bold tracking-wide">
                        {v.patente}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-slate-800 font-medium">{v.tipoVehiculo}</div>
                      <div className="text-xs text-slate-400">Año {v.anio}</div>
                    </td>
                    <td className="px-6 py-4 text-slate-600">{v.color}</td>
                    <td className="px-6 py-4">
                      <span className="font-semibold text-slate-900">
                        ${Number(v.precio_diario).toLocaleString('es-AR')}
                      </span>
                      <span className="text-xs text-slate-400"> /día</span>
                    </td>
                    <td className="px-6 py-4">{getStatusBadge(v.estado, v.activo)}</td>
                    <td className="px-6 py-4 text-right">
                      {isAdmin ? (
                        <div className="flex items-center justify-end gap-1">
                          <button
                            id={`btn-edit-vehiculo-${v.id}`}
                            onClick={() => handleOpenEdit(v)}
                            className="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                            title="Modificar vehículo"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          {v.activo && (
                            <button
                              id={`btn-delete-vehiculo-${v.id}`}
                              onClick={() => handleDelete(v.id)}
                              className="p-1.5 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors"
                              title="Baja lógica"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      ) : (
                        <span className="text-xs text-slate-400 italic">Solo lectura</span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Form */}
      {showModal && (
        <div
          id="modal-vehiculo-backdrop"
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in"
        >
          <div
            id="modal-vehiculo-content"
            className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-xl border border-slate-200"
          >
            <h2 id="modal-vehiculo-title" className="text-lg font-bold text-slate-900 mb-4">
              {editingVehiculo ? 'Modificar Vehículo' : 'Registrar Nuevo Vehículo'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Patente *</label>
                  <input
                    id="input-form-patente"
                    type="text"
                    required
                    disabled={!!editingVehiculo}
                    value={formData.patente}
                    onChange={(e) => setFormData({ ...formData, patente: e.target.value.toUpperCase() })}
                    placeholder="Ej. AG123XY"
                    className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-slate-100 uppercase font-mono font-bold"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Año *</label>
                  <input
                    id="input-form-anio"
                    type="number"
                    required
                    min={1990}
                    max={2030}
                    value={formData.anio}
                    onChange={(e) => setFormData({ ...formData, anio: Number(e.target.value) })}
                    className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Marca *</label>
                  <input
                    id="input-form-marca"
                    type="text"
                    required
                    value={formData.marca}
                    onChange={(e) => setFormData({ ...formData, marca: e.target.value })}
                    placeholder="Toyota, Ford, etc."
                    className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Modelo *</label>
                  <input
                    id="input-form-modelo"
                    type="text"
                    required
                    value={formData.modelo}
                    onChange={(e) => setFormData({ ...formData, modelo: e.target.value })}
                    placeholder="Corolla, Ranger, etc."
                    className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Tipo de Vehículo</label>
                  <select
                    id="select-form-tipo"
                    value={formData.tipoVehiculo}
                    onChange={(e) => setFormData({ ...formData, tipoVehiculo: e.target.value as TipoVehiculo })}
                    className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="SEDAN">SEDAN</option>
                    <option value="SUV">SUV</option>
                    <option value="PICKUP">PICKUP</option>
                    <option value="COUPE">COUPE</option>
                    <option value="HATCHBACK">HATCHBACK</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Color</label>
                  <input
                    id="input-form-color"
                    type="text"
                    value={formData.color}
                    onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                    placeholder="Blanco, Gris, etc."
                    className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Precio Diario (ARS) *</label>
                  <input
                    id="input-form-precio"
                    type="number"
                    required
                    min={1000}
                    step={500}
                    value={formData.precio_diario}
                    onChange={(e) => setFormData({ ...formData, precio_diario: Number(e.target.value) })}
                    className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                {editingVehiculo && (
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Estado</label>
                    <select
                      id="select-form-estado"
                      value={formData.estado}
                      onChange={(e) => setFormData({ ...formData, estado: e.target.value as EstadoVehiculo })}
                      className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="DISPONIBLE">DISPONIBLE</option>
                      <option value="RESERVADO">RESERVADO</option>
                      <option value="EN_ALQUILER">EN_ALQUILER</option>
                    </select>
                  </div>
                )}
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  id="btn-cancel-modal-vehiculo"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  id="btn-save-modal-vehiculo"
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors shadow-xs"
                >
                  {editingVehiculo ? 'Guardar Cambios' : 'Registrar Vehículo'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
