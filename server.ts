import express, { Request, Response } from 'express';
import cors from 'cors';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { dbConfig, testDbConnection, getUsuariosFromDb, isDbConnected } from './database';

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

// --- IN-MEMORY DATABASE & DATA TYPES ---
export interface Usuario {
  id: number;
  email: string;
  passwordHash: string;
  rol: 'ADMIN' | 'CLIENTE';
  activo: boolean;
  nombre?: string;
  clienteId?: number;
}

export interface Cliente {
  id: number;
  usuarioId: number;
  documento: string;
  nombre: string;
  apellido: string;
  email: string;
  telefono: string;
  fechaNacimiento: string;
  activo: boolean;
}

export type TipoVehiculo = 'SEDAN' | 'SUV' | 'PICKUP' | 'COUPE' | 'HATCHBACK';
export type EstadoVehiculo = 'DISPONIBLE' | 'RESERVADO' | 'EN_ALQUILER';

export interface Vehiculo {
  id: number;
  patente: string;
  marca: string;
  modelo: string;
  anio: number;
  tipoVehiculo: TipoVehiculo;
  estado: EstadoVehiculo;
  color: string;
  precio_diario: number;
  activo: boolean;
}

export interface Reserva {
  id: number;
  clienteId: number;
  clienteNombre: string;
  vehiculoId: number;
  vehiculoInfo: string;
  horaInicio: string;
  horaFin: string;
  duracionDias: number;
  precioDiarioHistorico: number;
  importeTotal: number;
  estado: 'CONFIRMADA' | 'CANCELADA' | 'FINALIZADA';
}

let nextUsuarioId = 5;
let nextClienteId = 4;
let nextVehiculoId = 6;
let nextReservaId = 3;

const usuarios: Usuario[] = [
  { id: 1, email: 'admin@rentar.com', passwordHash: 'Admin123*', rol: 'ADMIN', activo: true, nombre: 'Administrador UNLa' },
  { id: 2, email: 'juan.perez@example.com', passwordHash: 'Cliente123*', rol: 'CLIENTE', activo: true, nombre: 'Juan Pérez', clienteId: 1 },
  { id: 3, email: 'maria.gonzalez@example.com', passwordHash: 'Cliente123*', rol: 'CLIENTE', activo: true, nombre: 'María González', clienteId: 2 },
  { id: 4, email: 'carlos.rodriguez@example.com', passwordHash: 'Cliente123*', rol: 'CLIENTE', activo: true, nombre: 'Carlos Rodríguez', clienteId: 3 },
];

const clientes: Cliente[] = [
  {
    id: 1,
    usuarioId: 1,
    documento: '38452119',
    nombre: 'Juan',
    apellido: 'Pérez',
    email: 'juan.perez@example.com',
    telefono: '+54 11 4567-8901',
    fechaNacimiento: '1994-05-12',
    activo: true,
  },
  {
    id: 2,
    usuarioId: 2,
    documento: '40123876',
    nombre: 'María',
    apellido: 'González',
    email: 'maria.gonzalez@example.com',
    telefono: '+54 11 5678-1234',
    fechaNacimiento: '1997-09-23',
    activo: true,
  },
  {
    id: 3,
    usuarioId: 3,
    documento: '35987654',
    nombre: 'Carlos',
    apellido: 'Rodríguez',
    email: 'carlos.rodriguez@example.com',
    telefono: '+54 11 6789-4321',
    fechaNacimiento: '1991-03-18',
    activo: true,
  },
];

const vehiculos: Vehiculo[] = [
  {
    id: 1,
    patente: 'AA123BB',
    marca: 'Toyota',
    modelo: 'Corolla',
    anio: 2023,
    tipoVehiculo: 'SEDAN',
    estado: 'DISPONIBLE',
    color: 'Gris Plata',
    precio_diario: 45000,
    activo: true,
  },
  {
    id: 2,
    patente: 'AF456CD',
    marca: 'Ford',
    modelo: 'Ranger',
    anio: 2024,
    tipoVehiculo: 'PICKUP',
    estado: 'DISPONIBLE',
    color: 'Blanco Oxford',
    precio_diario: 75000,
    activo: true,
  },
  {
    id: 3,
    patente: 'AE789EF',
    marca: 'Volkswagen',
    modelo: 'Taos Highline',
    anio: 2023,
    tipoVehiculo: 'SUV',
    estado: 'RESERVADO',
    color: 'Azul Noche',
    precio_diario: 62000,
    activo: true,
  },
  {
    id: 4,
    patente: 'AC321GH',
    marca: 'Chevrolet',
    modelo: 'Cruze LTZ',
    anio: 2022,
    tipoVehiculo: 'SEDAN',
    estado: 'DISPONIBLE',
    color: 'Negro Ébano',
    precio_diario: 42000,
    activo: true,
  },
  {
    id: 5,
    patente: 'AD654IJ',
    marca: 'Peugeot',
    modelo: '208 Feline',
    anio: 2024,
    tipoVehiculo: 'HATCHBACK',
    estado: 'DISPONIBLE',
    color: 'Rojo Elixir',
    precio_diario: 38000,
    activo: true,
  },
];

const reservas: Reserva[] = [
  {
    id: 1,
    clienteId: 2,
    clienteNombre: 'María González',
    vehiculoId: 3,
    vehiculoInfo: 'Volkswagen Taos Highline (AE789EF)',
    horaInicio: '2026-09-18T10:00:00.000Z',
    horaFin: '2026-09-22T10:00:00.000Z',
    duracionDias: 4,
    precioDiarioHistorico: 62000,
    importeTotal: 248000,
    estado: 'CONFIRMADA',
  },
  {
    id: 2,
    clienteId: 1,
    clienteNombre: 'Juan Pérez',
    vehiculoId: 1,
    vehiculoInfo: 'Toyota Corolla (AA123BB)',
    horaInicio: '2026-08-10T09:00:00.000Z',
    horaFin: '2026-08-15T09:00:00.000Z',
    duracionDias: 5,
    precioDiarioHistorico: 45000,
    importeTotal: 225000,
    estado: 'FINALIZADA',
  },
];

function generarClaveTemporal(): string {
  return Math.random().toString(36).substring(2, 10);
}

// --- API ROUTES ---

// Healthcheck
app.get('/api/health', (req: Request, res: Response) => {
  res.json({
    status: 'ok',
    app: 'rentar',
    version: '1.0.0',
    entorno: 'Node.js 22 Express (Migrado desde Spring Boot UNLa Grupo D)',
  });
});

// ========================
// AUTH CONTROLLER (SPRING SECURITY EQUIVALENT)
// ========================
app.post('/api/auth/login', (req: Request, res: Response) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Debe ingresar email y contraseña' });
  }

  const user = usuarios.find((u) => u.email.toLowerCase() === email.trim().toLowerCase());

  if (!user || user.passwordHash !== password) {
    return res.status(401).json({ error: 'Credenciales inválidas. Compruebe el usuario y la contraseña.' });
  }

  if (!user.activo) {
    return res.status(403).json({ error: 'Su cuenta se encuentra inactiva. Contacte al administrador.' });
  }

  return res.json({
    mensaje: 'Autenticación exitosa',
    user: {
      id: user.id,
      email: user.email,
      rol: user.rol,
      nombre: user.nombre || user.email,
      clienteId: user.clienteId,
    },
  });
});

// ========================
// VEHICULOS CONTROLLER
// ========================

// ALTA: POST /api/vehiculos
app.post('/api/vehiculos', (req: Request, res: Response) => {
  const { patente, marca, modelo, anio, tipoVehiculo, color, precio_diario } = req.body;

  if (!patente || !marca || !modelo || !anio || !tipoVehiculo || precio_diario == null) {
    return res.status(400).json({ error: 'Faltan campos obligatorios para registrar el vehículo' });
  }

  const patenteExiste = vehiculos.some(
    (v) => v.patente.trim().toUpperCase() === patente.trim().toUpperCase()
  );
  if (patenteExiste) {
    return res.status(400).json({ error: 'La patente ya está registrada' });
  }

  const nuevoVehiculo: Vehiculo = {
    id: nextVehiculoId++,
    patente: patente.trim().toUpperCase(),
    marca: marca.trim(),
    modelo: modelo.trim(),
    anio: Number(anio),
    tipoVehiculo: tipoVehiculo as TipoVehiculo,
    estado: 'DISPONIBLE',
    color: color ? color.trim() : 'Blanco',
    precio_diario: Number(precio_diario),
    activo: true,
  };

  vehiculos.push(nuevoVehiculo);
  return res.status(201).json(nuevoVehiculo);
});

// LISTADO: GET /api/vehiculos
app.get('/api/vehiculos', (req: Request, res: Response) => {
  const { tipo, estado, activosSolo } = req.query;

  let resultado = [...vehiculos];

  if (activosSolo === 'true') {
    resultado = resultado.filter((v) => v.activo);
  }
  if (tipo) {
    resultado = resultado.filter((v) => v.tipoVehiculo === tipo);
  }
  if (estado) {
    resultado = resultado.filter((v) => v.estado === estado);
  }

  return res.json(resultado);
});

// DISPONIBLES: GET /api/vehiculos/disponibles
app.get('/api/vehiculos/disponibles', (req: Request, res: Response) => {
  const disponibles = vehiculos.filter((v) => v.activo && v.estado === 'DISPONIBLE');
  return res.json(disponibles);
});

// BUSCAR POR ID: GET /api/vehiculos/:id
app.get('/api/vehiculos/:id', (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const vehiculo = vehiculos.find((v) => v.id === id);

  if (!vehiculo) {
    return res.status(404).json({ error: 'Vehículo no encontrado' });
  }

  return res.json(vehiculo);
});

// MODIFICAR: PUT /api/vehiculos/:id
app.put('/api/vehiculos/:id', (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const vehiculo = vehiculos.find((v) => v.id === id);

  if (!vehiculo) {
    return res.status(404).json({ error: 'Vehículo no encontrado' });
  }

  const { marca, modelo, anio, tipoVehiculo, color, precio_diario, estado } = req.body;

  if (marca !== undefined) vehiculo.marca = marca;
  if (modelo !== undefined) vehiculo.modelo = modelo;
  if (anio !== undefined) vehiculo.anio = Number(anio);
  if (tipoVehiculo !== undefined) vehiculo.tipoVehiculo = tipoVehiculo as TipoVehiculo;
  if (color !== undefined) vehiculo.color = color;
  if (precio_diario !== undefined) vehiculo.precio_diario = Number(precio_diario);
  if (estado !== undefined) vehiculo.estado = estado as EstadoVehiculo;

  return res.json(vehiculo);
});

// BAJA LOGICA: DELETE /api/vehiculos/:id
app.delete('/api/vehiculos/:id', (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const vehiculo = vehiculos.find((v) => v.id === id);

  if (!vehiculo) {
    return res.status(404).json({ error: 'Vehículo no encontrado' });
  }

  vehiculo.activo = false;
  return res.status(204).send();
});

// ========================
// CLIENTES CONTROLLER
// ========================

// ALTA: POST /api/clientes
app.post('/api/clientes', (req: Request, res: Response) => {
  const { email, documento, nombre, apellido, telefono, fechaNacimiento } = req.body;

  if (!email || !documento || !nombre || !apellido) {
    return res.status(400).json({ error: 'Email, documento, nombre y apellido son obligatorios' });
  }

  const emailExiste = usuarios.some((u) => u.email.toLowerCase() === email.trim().toLowerCase());
  if (emailExiste) {
    return res.status(400).json({ error: 'El email ya está registrado' });
  }

  const docExiste = clientes.some((c) => c.documento.trim() === documento.trim());
  if (docExiste) {
    return res.status(400).json({ error: 'El documento ya está registrado' });
  }

  // Crear usuario automático
  const nuevoUsuario: Usuario = {
    id: nextUsuarioId++,
    email: email.trim().toLowerCase(),
    passwordHash: generarClaveTemporal(),
    rol: 'CLIENTE',
    activo: true,
  };
  usuarios.push(nuevoUsuario);

  // Crear cliente
  const nuevoCliente: Cliente = {
    id: nextClienteId++,
    usuarioId: nuevoUsuario.id,
    documento: documento.trim(),
    nombre: nombre.trim(),
    apellido: apellido.trim(),
    email: nuevoUsuario.email,
    telefono: telefono ? telefono.trim() : '',
    fechaNacimiento: fechaNacimiento || '',
    activo: true,
  };
  clientes.push(nuevoCliente);

  return res.status(201).json(nuevoCliente);
});

// LISTADO: GET /api/clientes
app.get('/api/clientes', async (req: Request, res: Response) => {
  const { activosSolo } = req.query;

  // Si MySQL está conectado, leemos directamente todos los usuarios y clientes reales de la base de datos
  if (isDbConnected()) {
    try {
      const dbUsers = await getUsuariosFromDb();
      if (dbUsers && dbUsers.length > 0) {
        let clientesMapeados = dbUsers.map((u, idx) => ({
          id: u.id_cliente || u.id_usuario,
          usuarioId: u.id_usuario,
          documento: u.cod_documento || `DOC-${u.id_usuario}`,
          nombre: u.nom_nombre || u.desc_email.split('@')[0],
          apellido: u.desc_apellido || (u.desc_rol === 'ADMIN' ? '(Admin)' : ''),
          email: u.desc_email,
          telefono: u.desc_telefono || '-',
          fechaNacimiento: '',
          activo: Boolean(u.flag_activo),
          rol: u.desc_rol,
        }));

        if (activosSolo === 'true') {
          clientesMapeados = clientesMapeados.filter((c) => c.activo);
        }
        return res.json(clientesMapeados);
      }
    } catch (err: any) {
      console.error('[MySQL Error] Error leyendo de lk_usuarios:', err.message);
    }
  }

  // Modo fallback / memoria si aún no cargó MySQL
  let resultado = [...clientes];
  if (activosSolo === 'true') {
    resultado = resultado.filter((c) => c.activo);
  }
  return res.json(resultado);
});

// BUSCAR POR ID: GET /api/clientes/:id
app.get('/api/clientes/:id', (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const cliente = clientes.find((c) => c.id === id);

  if (!cliente) {
    return res.status(404).json({ error: 'Cliente no encontrado' });
  }

  return res.json(cliente);
});

// MODIFICAR: PUT /api/clientes/:id
app.put('/api/clientes/:id', (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const cliente = clientes.find((c) => c.id === id);

  if (!cliente) {
    return res.status(404).json({ error: 'Cliente no encontrado' });
  }

  const { documento, nombre, apellido, email, telefono, fechaNacimiento } = req.body;

  if (documento && documento.trim() !== cliente.documento) {
    const docExiste = clientes.some((c) => c.id !== id && c.documento.trim() === documento.trim());
    if (docExiste) {
      return res.status(400).json({ error: 'El documento ya está registrado' });
    }
    cliente.documento = documento.trim();
  }

  if (email && email.trim().toLowerCase() !== cliente.email.toLowerCase()) {
    const emailExiste = usuarios.some(
      (u) => u.id !== cliente.usuarioId && u.email.toLowerCase() === email.trim().toLowerCase()
    );
    if (emailExiste) {
      return res.status(400).json({ error: 'El email ya está registrado' });
    }
    cliente.email = email.trim().toLowerCase();
    const usuario = usuarios.find((u) => u.id === cliente.usuarioId);
    if (usuario) {
      usuario.email = cliente.email;
    }
  }

  if (nombre !== undefined) cliente.nombre = nombre.trim();
  if (apellido !== undefined) cliente.apellido = apellido.trim();
  if (telefono !== undefined) cliente.telefono = telefono.trim();
  if (fechaNacimiento !== undefined) cliente.fechaNacimiento = fechaNacimiento;

  return res.json(cliente);
});

// BAJA LOGICA: DELETE /api/clientes/:id
app.delete('/api/clientes/:id', (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const cliente = clientes.find((c) => c.id === id);

  if (!cliente) {
    return res.status(404).json({ error: 'Cliente no encontrado' });
  }

  cliente.activo = false;
  const usuario = usuarios.find((u) => u.id === cliente.usuarioId);
  if (usuario) {
    usuario.activo = false;
  }

  return res.status(204).send();
});

// ========================
// RESERVAS CONTROLLER
// ========================

// ALTA RESERVA: POST /api/reservas
app.post('/api/reservas', (req: Request, res: Response) => {
  const { clienteId, vehiculoId, horaInicio, horaFin } = req.body;

  if (!clienteId || !vehiculoId || !horaInicio || !horaFin) {
    return res.status(400).json({ error: 'clienteId, vehiculoId, horaInicio y horaFin son requeridos' });
  }

  const cliente = clientes.find((c) => c.id === Number(clienteId));
  if (!cliente || !cliente.activo) {
    return res.status(400).json({ error: 'Cliente no válido o inactivo' });
  }

  const vehiculo = vehiculos.find((v) => v.id === Number(vehiculoId));
  if (!vehiculo || !vehiculo.activo) {
    return res.status(400).json({ error: 'Vehículo no válido o inactivo' });
  }

  if (vehiculo.estado !== 'DISPONIBLE') {
    return res.status(400).json({ error: 'El vehículo no está disponible para reserva' });
  }

  const inicio = new Date(horaInicio);
  const fin = new Date(horaFin);
  const diffTime = fin.getTime() - inicio.getTime();
  const diasCalculados = Math.max(1, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));

  const importeTotal = diasCalculados * vehiculo.precio_diario;

  // Actualizar estado vehículo
  vehiculo.estado = 'RESERVADO';

  const nuevaReserva: Reserva = {
    id: nextReservaId++,
    clienteId: cliente.id,
    clienteNombre: `${cliente.nombre} ${cliente.apellido}`,
    vehiculoId: vehiculo.id,
    vehiculoInfo: `${vehiculo.marca} ${vehiculo.modelo} (${vehiculo.patente})`,
    horaInicio: inicio.toISOString(),
    horaFin: fin.toISOString(),
    duracionDias: diasCalculados,
    precioDiarioHistorico: vehiculo.precio_diario,
    importeTotal,
    estado: 'CONFIRMADA',
  };

  reservas.push(nuevaReserva);
  return res.status(201).json(nuevaReserva);
});

// LISTADO RESERVAS: GET /api/reservas
app.get('/api/reservas', (req: Request, res: Response) => {
  return res.json(reservas);
});

// CANCELAR RESERVA: DELETE /api/reservas/:id
app.delete('/api/reservas/:id', (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const reserva = reservas.find((r) => r.id === id);

  if (!reserva) {
    return res.status(404).json({ error: 'Reserva no encontrada' });
  }

  reserva.estado = 'CANCELADA';

  // Liberar el vehículo
  const vehiculo = vehiculos.find((v) => v.id === reserva.vehiculoId);
  if (vehiculo && vehiculo.estado === 'RESERVADO') {
    vehiculo.estado = 'DISPONIBLE';
  }

  return res.json({ mensaje: 'Reserva cancelada con éxito', reserva });
});

// ========================
// OPENAPI / SWAGGER SPEC
// ========================
app.get('/api/docs/spec', (req: Request, res: Response) => {
  res.json({
    openapi: '3.0.0',
    info: {
      title: 'Rentar API - UNLa Grupo D',
      version: '1.0.0',
      description: 'API REST para la gestión de alquiler de vehículos, clientes y reservas.',
    },
    paths: {
      '/api/vehiculos': {
        get: {
          summary: 'Listar todos los vehículos',
          responses: { '200': { description: 'Lista de vehículos' } },
        },
        post: {
          summary: 'Crear un nuevo vehículo',
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    patente: { type: 'string', example: 'AG123XY' },
                    marca: { type: 'string', example: 'Toyota' },
                    modelo: { type: 'string', example: 'Yaris' },
                    anio: { type: 'integer', example: 2024 },
                    tipoVehiculo: { type: 'string', enum: ['SEDAN', 'SUV', 'PICKUP', 'COUPE', 'HATCHBACK'] },
                    color: { type: 'string', example: 'Blanco' },
                    precio_diario: { type: 'number', example: 39000 },
                  },
                },
              },
            },
          },
          responses: { '201': { description: 'Vehículo creado' } },
        },
      },
      '/api/vehiculos/{id}': {
        get: { summary: 'Buscar vehículo por ID' },
        put: { summary: 'Modificar vehículo por ID' },
        delete: { summary: 'Baja lógica de vehículo (activo=false)' },
      },
      '/api/clientes': {
        get: { summary: 'Listar todos los clientes' },
        post: {
          summary: 'Crear nuevo cliente y usuario asociado',
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    documento: { type: 'string', example: '42111222' },
                    nombre: { type: 'string', example: 'Lucas' },
                    apellido: { type: 'string', example: 'Benítez' },
                    email: { type: 'string', example: 'lucas.benitez@example.com' },
                    telefono: { type: 'string', example: '+54 11 9999-8888' },
                    fechaNacimiento: { type: 'string', example: '1999-04-15' },
                  },
                },
              },
            },
          },
          responses: { '201': { description: 'Cliente creado con éxito' } },
        },
      },
      '/api/clientes/{id}': {
        get: { summary: 'Buscar cliente por ID' },
        put: { summary: 'Modificar cliente por ID' },
        delete: { summary: 'Baja lógica de cliente y usuario (activo=false)' },
      },
      '/api/reservas': {
        get: { summary: 'Listar reservas activas e históricas' },
        post: {
          summary: 'Registrar nueva reserva de vehículo',
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    clienteId: { type: 'integer', example: 1 },
                    vehiculoId: { type: 'integer', example: 1 },
                    horaInicio: { type: 'string', example: '2026-09-20T10:00:00.000Z' },
                    horaFin: { type: 'string', example: '2026-09-25T10:00:00.000Z' },
                  },
                },
              },
            },
          },
          responses: { '201': { description: 'Reserva confirmada' } },
        },
      },
      '/api/reservas/{id}': {
        delete: { summary: 'Cancelar reserva y liberar vehículo' },
      },
    },
  });
});

// Endpoint para consultar el estado de conexión a MySQL desde la UI o terminal
app.get('/api/health/mysql', async (_req: Request, res: Response) => {
  const result = await testDbConnection();
  res.status(result.ok ? 200 : 503).json(result);
});

// --- VITE DEV / PRODUCTION STATIC SERVER ---
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req: Request, res: Response) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', async () => {
    console.log(`\n================================================================`);
    console.log(`🚀 [Rentar Web] Servidor activo en http://localhost:${PORT}`);
    console.log(`----------------------------------------------------------------`);
    
    // Verificación de conexión a la base de datos MySQL (rentar_db)
    const dbStatus = await testDbConnection();
    if (dbStatus.ok) {
      console.log(`✅ [MYSQL CONECTADO]: ${dbStatus.message}`);
      console.log(`📂 [BASE DE DATOS ACTIVA]: '${dbStatus.database || dbConfig.database}'`);
      try {
        const users = await getUsuariosFromDb();
        console.log(`👥 [USUARIOS DETECTADOS EN lk_usuarios]: ${users.length} registros`);
      } catch (err: any) {
        console.log(`ℹ️ [TABLA lk_usuarios]: Aún no creada o sin datos (${err.message})`);
      }
    } else {
      console.log(`⚠️  [MYSQL NO DETECTADO]: ${dbStatus.message}`);
      console.log(`   👉 Servidor MySQL esperado en: ${dbConfig.host}:${dbConfig.port}, base: '${dbConfig.database}', usuario: '${dbConfig.user}'`);
      console.log(`   ℹ️  La aplicación web funcionará en modo emulación para pruebas.`);
    }
    console.log(`================================================================\n`);
  });
}

startServer();
