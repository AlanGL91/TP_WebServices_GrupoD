import React, { useState } from 'react';
import { Plus, Search, Trash2, Edit2, UserPlus, RefreshCw, Mail, Phone, Calendar, UserCheck } from 'lucide-react';
import { Cliente } from '../types';

interface ClientesViewProps {
  clientes: Cliente[];
  loading: boolean;
  onRefresh: () => void;
  onNotification: (msg: string, type?: 'success' | 'error') => void;
}

export const ClientesView: React.FC<ClientesViewProps> = ({
  clientes,
  loading,
  onRefresh,
  onNotification,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingCliente, setEditingCliente] = useState<Cliente | null>(null);

  const [formData, setFormData] = useState({
    documento: '',
    nombre: '',
    apellido: '',
    email: '',
    telefono: '',
    fechaNacimiento: '1995-01-01',
  });

  const handleOpenCreate = () => {
    setEditingCliente(null);
    setFormData({
      documento: '',
      nombre: '',
      apellido: '',
      email: '',
      telefono: '',
      fechaNacimiento: '1995-01-01',
    });
    setShowModal(true);
  };

  const handleOpenEdit = (c: Cliente) => {
    setEditingCliente(c);
    setFormData({
      documento: c.documento,
      nombre: c.nombre,
      apellido: c.apellido,
      email: c.email,
      telefono: c.telefono,
      fechaNacimiento: c.fechaNacimiento || '1995-01-01',
    });
    setShowModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingCliente) {
        const res = await fetch(`/api/clientes/${editingCliente.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData),
        });
        if (!res.ok) {
          const err = await res.json();
          throw new Error(err.error || 'Error al actualizar cliente');
        }
        onNotification('Cliente actualizado exitosamente');
      } else {
        const res = await fetch('/api/clientes', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData),
        });
        if (!res.ok) {
          const err = await res.json();
          throw new Error(err.error || 'Error al crear cliente');
        }
        onNotification('Cliente registrado y cuenta de usuario generada automáticamente');
      }
      setShowModal(false);
      onRefresh();
    } catch (err: any) {
      onNotification(err.message, 'error');
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('¿Confirma la baja lógica de este cliente y su usuario asociado?')) return;
    try {
      const res = await fetch(`/api/clientes/${id}`, { method: 'DELETE' });
      if (!res.ok) {
        throw new Error('Error al dar de baja el cliente');
      }
      onNotification('Cliente dado de baja lógicamente (activo = false)');
      onRefresh();
    } catch (err: any) {
      onNotification(err.message, 'error');
    }
  };

  const filteredClientes = clientes.filter((c) => {
    const term = searchTerm.toLowerCase();
    return (
      c.documento.toLowerCase().includes(term) ||
      c.nombre.toLowerCase().includes(term) ||
      c.apellido.toLowerCase().includes(term) ||
      c.email.toLowerCase().includes(term)
    );
  });

  return (
    <div id="clientes-section" className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 id="clientes-heading" className="text-2xl font-bold text-slate-900 tracking-tight">
            Gestión de Clientes
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Administración de clientes y credenciales de usuario vinculadas (Endpoints REST /api/clientes)
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            id="btn-refresh-clientes"
            onClick={onRefresh}
            className="p-2 text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors shadow-2xs"
            title="Refrescar lista"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
          <button
            id="btn-nuevo-cliente"
            onClick={handleOpenCreate}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium shadow-xs transition-colors"
          >
            <UserPlus className="w-4 h-4" />
            <span>Registrar Cliente</span>
          </button>
        </div>
      </div>

      {/* Search */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
        <div className="relative w-full max-w-md">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            id="input-search-clientes"
            type="text"
            placeholder="Buscar por DNI, nombre, apellido o email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-slate-50"
          />
        </div>
      </div>

      {/* Clients Table */}
      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-2xs">
        <div className="overflow-x-auto">
          <table id="table-clientes" className="w-full text-left text-sm text-slate-600">
            <thead className="bg-slate-50 text-slate-700 font-semibold border-b border-slate-200 text-xs uppercase tracking-wider">
              <tr>
                <th className="px-6 py-3.5">Cliente</th>
                <th className="px-6 py-3.5">Documento (DNI)</th>
                <th className="px-6 py-3.5">Contacto</th>
                <th className="px-6 py-3.5">Fecha Nac.</th>
                <th className="px-6 py-3.5">Estado</th>
                <th className="px-6 py-3.5 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredClientes.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-12 text-slate-400">
                    <UserCheck className="w-8 h-8 mx-auto mb-2 text-slate-300" />
                    No se encontraron clientes registrados.
                  </td>
                </tr>
              ) : (
                filteredClientes.map((c) => (
                  <tr
                    key={c.id}
                    id={`cliente-row-${c.id}`}
                    className={`hover:bg-slate-50/70 transition-colors ${!c.activo ? 'opacity-60 bg-slate-50/30' : ''}`}
                  >
                    <td className="px-6 py-4">
                      <div className="font-semibold text-slate-900">
                        {c.nombre} {c.apellido}
                      </div>
                      <div className="text-xs text-slate-400">ID #{c.id} · Usuario #{c.usuarioId}</div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="font-mono text-slate-800 font-medium px-2 py-0.5 rounded bg-slate-100 border border-slate-200 text-xs">
                        {c.documento}
                      </span>
                    </td>
                    <td className="px-6 py-4 space-y-1">
                      <div className="flex items-center gap-1.5 text-xs text-slate-700">
                        <Mail className="w-3.5 h-3.5 text-slate-400" />
                        <span>{c.email}</span>
                      </div>
                      {c.telefono && (
                        <div className="flex items-center gap-1.5 text-xs text-slate-500">
                          <Phone className="w-3.5 h-3.5 text-slate-400" />
                          <span>{c.telefono}</span>
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1.5 text-xs text-slate-600">
                        <Calendar className="w-3.5 h-3.5 text-slate-400" />
                        <span>{c.fechaNacimiento || 'No informada'}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {c.activo ? (
                        <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                          Activo
                        </span>
                      ) : (
                        <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-slate-100 text-slate-500 border border-slate-200">
                          Inactivo (Baja)
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          id={`btn-edit-cliente-${c.id}`}
                          onClick={() => handleOpenEdit(c)}
                          className="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                          title="Modificar cliente"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        {c.activo && (
                          <button
                            id={`btn-delete-cliente-${c.id}`}
                            onClick={() => handleDelete(c.id)}
                            className="p-1.5 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors"
                            title="Baja lógica"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
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
          id="modal-cliente-backdrop"
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in"
        >
          <div
            id="modal-cliente-content"
            className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-xl border border-slate-200"
          >
            <h2 id="modal-cliente-title" className="text-lg font-bold text-slate-900 mb-4">
              {editingCliente ? 'Modificar Cliente' : 'Registrar Nuevo Cliente'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Nombre *</label>
                  <input
                    id="input-form-cliente-nombre"
                    type="text"
                    required
                    value={formData.nombre}
                    onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                    placeholder="Ej. Juan"
                    className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Apellido *</label>
                  <input
                    id="input-form-cliente-apellido"
                    type="text"
                    required
                    value={formData.apellido}
                    onChange={(e) => setFormData({ ...formData, apellido: e.target.value })}
                    placeholder="Ej. Pérez"
                    className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Documento (DNI) *</label>
                  <input
                    id="input-form-cliente-doc"
                    type="text"
                    required
                    value={formData.documento}
                    onChange={(e) => setFormData({ ...formData, documento: e.target.value })}
                    placeholder="Ej. 38123456"
                    className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Fecha de Nacimiento</label>
                  <input
                    id="input-form-cliente-fecha"
                    type="date"
                    value={formData.fechaNacimiento}
                    onChange={(e) => setFormData({ ...formData, fechaNacimiento: e.target.value })}
                    className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Email *</label>
                <input
                  id="input-form-cliente-email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="juan.perez@example.com"
                  className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <p className="text-2xs text-slate-400 mt-1">
                  Se vinculará automáticamente a la tabla de Usuarios con rol CLIENTE.
                </p>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Teléfono</label>
                <input
                  id="input-form-cliente-tel"
                  type="tel"
                  value={formData.telefono}
                  onChange={(e) => setFormData({ ...formData, telefono: e.target.value })}
                  placeholder="+54 11 1234-5678"
                  className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  id="btn-cancel-modal-cliente"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  id="btn-save-modal-cliente"
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors shadow-xs"
                >
                  {editingCliente ? 'Guardar Cambios' : 'Registrar Cliente'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
