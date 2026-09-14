import React, { useState } from 'react';
import { Send, CheckCircle, Code, Layers, FileJson, Copy, Check } from 'lucide-react';

interface EndpointDef {
  id: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  path: string;
  category: 'Vehículos' | 'Clientes' | 'Reservas' | 'Sistema';
  summary: string;
  description: string;
  defaultBody?: string;
  pathParams?: { name: string; defaultVal: string }[];
}

const ENDPOINTS: EndpointDef[] = [
  // Vehiculos
  {
    id: 'get-vehiculos',
    method: 'GET',
    path: '/api/vehiculos',
    category: 'Vehículos',
    summary: 'Listar todos los vehículos',
    description: 'Devuelve la lista completa de vehículos registrados, incluyendo estado y disponibilidad.',
  },
  {
    id: 'get-vehiculos-disponibles',
    method: 'GET',
    path: '/api/vehiculos/disponibles',
    category: 'Vehículos',
    summary: 'Consulta de disponibilidad',
    description: 'Devuelve exclusivamente los vehículos activos con estado DISPONIBLE para alquiler.',
  },
  {
    id: 'post-vehiculos',
    method: 'POST',
    path: '/api/vehiculos',
    category: 'Vehículos',
    summary: 'Alta de vehículo',
    description: 'Registra un nuevo vehículo en la flota. Valida unicidad de patente y asigna estado DISPONIBLE.',
    defaultBody: JSON.stringify(
      {
        patente: 'AF999ZZ',
        marca: 'Volkswagen',
        modelo: 'Nivus Highline',
        anio: 2024,
        tipoVehiculo: 'SUV',
        color: 'Gris Platino',
        precio_diario: 58000,
      },
      null,
      2
    ),
  },
  {
    id: 'get-vehiculo-id',
    method: 'GET',
    path: '/api/vehiculos/{id}',
    category: 'Vehículos',
    summary: 'Buscar vehículo por ID',
    description: 'Obtiene el detalle completo de un vehículo específico por su identificador primario.',
    pathParams: [{ name: 'id', defaultVal: '1' }],
  },
  {
    id: 'put-vehiculo-id',
    method: 'PUT',
    path: '/api/vehiculos/{id}',
    category: 'Vehículos',
    summary: 'Modificar vehículo',
    description: 'Actualiza los datos del vehículo (tarifa, color, estado, modelo).',
    pathParams: [{ name: 'id', defaultVal: '1' }],
    defaultBody: JSON.stringify(
      {
        marca: 'Toyota',
        modelo: 'Corolla SEG Hybrid',
        anio: 2023,
        tipoVehiculo: 'SEDAN',
        color: 'Gris Plata',
        precio_diario: 48000,
        estado: 'DISPONIBLE',
      },
      null,
      2
    ),
  },
  {
    id: 'delete-vehiculo-id',
    method: 'DELETE',
    path: '/api/vehiculos/{id}',
    category: 'Vehículos',
    summary: 'Baja lógica de vehículo',
    description: 'Realiza la baja lógica asignando activo=false sin destruir historial.',
    pathParams: [{ name: 'id', defaultVal: '5' }],
  },

  // Clientes
  {
    id: 'get-clientes',
    method: 'GET',
    path: '/api/clientes',
    category: 'Clientes',
    summary: 'Listar todos los clientes',
    description: 'Devuelve la lista de clientes registrados en el sistema.',
  },
  {
    id: 'post-clientes',
    method: 'POST',
    path: '/api/clientes',
    category: 'Clientes',
    summary: 'Alta de cliente',
    description: 'Crea un nuevo cliente y su usuario asociado con rol CLIENTE y clave temporal.',
    defaultBody: JSON.stringify(
      {
        documento: '41852963',
        nombre: 'Sofía',
        apellido: 'Martínez',
        email: 'sofia.martinez@example.com',
        telefono: '+54 11 3456-7890',
        fechaNacimiento: '1998-11-04',
      },
      null,
      2
    ),
  },
  {
    id: 'get-cliente-id',
    method: 'GET',
    path: '/api/clientes/{id}',
    category: 'Clientes',
    summary: 'Buscar cliente por ID',
    description: 'Devuelve los datos del cliente por su ID.',
    pathParams: [{ name: 'id', defaultVal: '1' }],
  },
  {
    id: 'put-cliente-id',
    method: 'PUT',
    path: '/api/clientes/{id}',
    category: 'Clientes',
    summary: 'Modificar cliente',
    description: 'Modifica datos de contacto y actualiza email del usuario vinculado.',
    pathParams: [{ name: 'id', defaultVal: '1' }],
    defaultBody: JSON.stringify(
      {
        documento: '38452119',
        nombre: 'Juan Carlos',
        apellido: 'Pérez Gómez',
        email: 'juan.perez@example.com',
        telefono: '+54 11 4567-9999',
        fechaNacimiento: '1994-05-12',
      },
      null,
      2
    ),
  },
  {
    id: 'delete-cliente-id',
    method: 'DELETE',
    path: '/api/clientes/{id}',
    category: 'Clientes',
    summary: 'Baja lógica de cliente',
    description: 'Inactiva el cliente y su usuario vinculado.',
    pathParams: [{ name: 'id', defaultVal: '3' }],
  },

  // Reservas
  {
    id: 'get-reservas',
    method: 'GET',
    path: '/api/reservas',
    category: 'Reservas',
    summary: 'Consulta de reservas',
    description: 'Obtiene el listado de reservas con cálculo de importes y estado.',
  },
  {
    id: 'post-reservas',
    method: 'POST',
    path: '/api/reservas',
    category: 'Reservas',
    summary: 'Alta de reserva',
    description: 'Genera una reserva para un cliente y vehículo disponible. Pasa el vehículo a RESERVADO.',
    defaultBody: JSON.stringify(
      {
        clienteId: 1,
        vehiculoId: 2,
        horaInicio: '2026-09-20T10:00:00.000Z',
        horaFin: '2026-09-25T10:00:00.000Z',
      },
      null,
      2
    ),
  },
  {
    id: 'delete-reserva-id',
    method: 'DELETE',
    path: '/api/reservas/{id}',
    category: 'Reservas',
    summary: 'Cancelación de reserva',
    description: 'Cancela la reserva indicada y libera el vehículo nuevamente a DISPONIBLE.',
    pathParams: [{ name: 'id', defaultVal: '1' }],
  },

  // Sistema
  {
    id: 'get-docs-spec',
    method: 'GET',
    path: '/api/docs/spec',
    category: 'Sistema',
    summary: 'Especificación OpenAPI 3.0',
    description: 'Devuelve la especificación OpenAPI en formato JSON estandarizado.',
  },
  {
    id: 'get-health',
    method: 'GET',
    path: '/api/health',
    category: 'Sistema',
    summary: 'Estado del Servicio (Healthcheck)',
    description: 'Verifica el funcionamiento del servidor Node.js Express.',
  },
];

export const ApiExplorerView: React.FC = () => {
  const [selectedEndpoint, setSelectedEndpoint] = useState<EndpointDef>(ENDPOINTS[0]);
  const [requestBody, setRequestBody] = useState<string>(ENDPOINTS[0].defaultBody || '');
  const [paramValues, setParamValues] = useState<Record<string, string>>({ id: '1' });
  const [loading, setLoading] = useState<boolean>(false);
  const [responseStatus, setResponseStatus] = useState<number | null>(null);
  const [responseData, setResponseData] = useState<string | null>(null);
  const [copied, setCopied] = useState<boolean>(false);

  const handleSelectEndpoint = (ep: EndpointDef) => {
    setSelectedEndpoint(ep);
    setRequestBody(ep.defaultBody || '');
    if (ep.pathParams) {
      const initialParams: Record<string, string> = {};
      ep.pathParams.forEach((p) => {
        initialParams[p.name] = p.defaultVal;
      });
      setParamValues(initialParams);
    } else {
      setParamValues({});
    }
    setResponseStatus(null);
    setResponseData(null);
  };

  const handleExecute = async () => {
    setLoading(true);
    setResponseStatus(null);
    setResponseData(null);

    let finalPath = selectedEndpoint.path;
    if (selectedEndpoint.pathParams) {
      selectedEndpoint.pathParams.forEach((p) => {
        finalPath = finalPath.replace(`{${p.name}}`, paramValues[p.name] || p.defaultVal);
      });
    }

    try {
      const options: RequestInit = {
        method: selectedEndpoint.method,
        headers: { 'Content-Type': 'application/json' },
      };

      if (['POST', 'PUT'].includes(selectedEndpoint.method) && requestBody) {
        options.body = requestBody;
      }

      const res = await fetch(finalPath, options);
      setResponseStatus(res.status);

      const contentType = res.headers.get('content-type');
      if (res.status === 204) {
        setResponseData('(204 No Content - Operación completada con éxito sin cuerpo de respuesta)');
      } else if (contentType && contentType.includes('application/json')) {
        const json = await res.json();
        setResponseData(JSON.stringify(json, null, 2));
      } else {
        const text = await res.text();
        setResponseData(text);
      }
    } catch (err: any) {
      setResponseStatus(500);
      setResponseData(JSON.stringify({ error: err.message }, null, 2));
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    if (!responseData) return;
    navigator.clipboard.writeText(responseData);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getMethodBadge = (method: string) => {
    switch (method) {
      case 'GET':
        return <span className="px-2 py-0.5 text-2xs font-bold rounded bg-blue-100 text-blue-700 font-mono">GET</span>;
      case 'POST':
        return <span className="px-2 py-0.5 text-2xs font-bold rounded bg-emerald-100 text-emerald-700 font-mono">POST</span>;
      case 'PUT':
        return <span className="px-2 py-0.5 text-2xs font-bold rounded bg-amber-100 text-amber-700 font-mono">PUT</span>;
      case 'DELETE':
        return <span className="px-2 py-0.5 text-2xs font-bold rounded bg-red-100 text-red-700 font-mono">DEL</span>;
      default:
        return <span>{method}</span>;
    }
  };

  return (
    <div id="api-explorer-section" className="space-y-6">
      {/* Header */}
      <div>
        <h1 id="api-explorer-heading" className="text-2xl font-bold text-slate-900 tracking-tight">
          Documentación REST & Swagger Explorer
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Consola interactiva para consultar y ejecutar los endpoints HTTP documentados en Swagger/OpenAPI.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Endpoints List */}
        <div className="lg:col-span-4 bg-white border border-slate-200 rounded-xl p-3 shadow-2xs space-y-2 max-h-[680px] overflow-y-auto">
          <div className="px-3 py-2 text-xs font-bold text-slate-400 uppercase tracking-wider">
            Endpoints Disponibles
          </div>
          {ENDPOINTS.map((ep) => {
            const isSelected = selectedEndpoint.id === ep.id;
            return (
              <button
                key={ep.id}
                id={`btn-endpoint-${ep.id}`}
                onClick={() => handleSelectEndpoint(ep)}
                className={`w-full text-left p-3 rounded-lg text-xs transition-colors flex items-start gap-2.5 ${
                  isSelected
                    ? 'bg-blue-50 border border-blue-200 text-blue-900'
                    : 'hover:bg-slate-50 border border-transparent text-slate-700'
                }`}
              >
                <div className="shrink-0 mt-0.5">{getMethodBadge(ep.method)}</div>
                <div className="min-w-0 flex-1">
                  <div className="font-mono font-semibold text-slate-900 truncate">{ep.path}</div>
                  <div className="text-slate-500 truncate mt-0.5">{ep.summary}</div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Request / Response Panel */}
        <div className="lg:col-span-8 space-y-5">
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-2xs space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                {getMethodBadge(selectedEndpoint.method)}
                <span className="font-mono font-bold text-slate-900 text-base">{selectedEndpoint.path}</span>
              </div>
              <span className="text-xs px-2.5 py-1 rounded-md bg-slate-100 text-slate-600 font-medium">
                {selectedEndpoint.category}
              </span>
            </div>

            <p className="text-sm text-slate-600">{selectedEndpoint.description}</p>

            {/* Path Parameters */}
            {selectedEndpoint.pathParams && (
              <div className="space-y-2 pt-2">
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider">
                  Parámetros de Ruta
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {selectedEndpoint.pathParams.map((p) => (
                    <div key={p.name} className="flex items-center gap-2">
                      <span className="font-mono text-xs text-slate-500 px-2 py-1 bg-slate-100 rounded">
                        {`{${p.name}}`}:
                      </span>
                      <input
                        type="text"
                        value={paramValues[p.name] ?? p.defaultVal}
                        onChange={(e) =>
                          setParamValues({ ...paramValues, [p.name]: e.target.value })
                        }
                        className="flex-1 px-3 py-1.5 text-xs font-mono border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Request Body Editor for POST/PUT */}
            {['POST', 'PUT'].includes(selectedEndpoint.method) && (
              <div className="space-y-2 pt-2">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider">
                    Cuerpo de la Solicitud (JSON)
                  </label>
                  <span className="text-2xs text-slate-400">Content-Type: application/json</span>
                </div>
                <textarea
                  id="textarea-request-body"
                  rows={7}
                  value={requestBody}
                  onChange={(e) => setRequestBody(e.target.value)}
                  className="w-full font-mono text-xs p-3 rounded-lg border border-slate-200 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            )}

            <div className="flex justify-end pt-2">
              <button
                id="btn-execute-request"
                onClick={handleExecute}
                disabled={loading}
                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 text-white px-5 py-2.5 rounded-lg text-sm font-semibold shadow-xs transition-colors"
              >
                <Send className={`w-4 h-4 ${loading ? 'animate-pulse' : ''}`} />
                <span>{loading ? 'Ejecutando...' : 'Ejecutar Solicitud'}</span>
              </button>
            </div>
          </div>

          {/* Response Box */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 text-slate-100 shadow-md space-y-3">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Code className="w-4 h-4 text-blue-400" />
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-300">
                  Respuesta del Servidor
                </span>
              </div>
              {responseStatus !== null && (
                <div className="flex items-center gap-2">
                  <span
                    className={`px-2.5 py-0.5 rounded text-xs font-bold font-mono ${
                      responseStatus >= 200 && responseStatus < 300
                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                        : 'bg-red-500/20 text-red-400 border border-red-500/30'
                    }`}
                  >
                    HTTP {responseStatus}
                  </span>
                  {responseData && (
                    <button
                      onClick={handleCopy}
                      className="p-1 text-slate-400 hover:text-white rounded transition-colors"
                      title="Copiar respuesta"
                    >
                      {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                    </button>
                  )}
                </div>
              )}
            </div>

            {responseData ? (
              <pre
                id="api-response-content"
                className="font-mono text-xs text-slate-200 overflow-x-auto max-h-80 p-3 bg-slate-950/60 rounded-lg"
              >
                {responseData}
              </pre>
            ) : (
              <div className="text-center py-8 text-slate-500 text-xs">
                Haga clic en &quot;Ejecutar Solicitud&quot; para enviar la petición HTTP y ver la respuesta en tiempo real.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
