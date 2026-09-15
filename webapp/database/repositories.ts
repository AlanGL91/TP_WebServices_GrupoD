import bcrypt from 'bcryptjs';
import { getDbPool } from './connection';

export interface DbUsuario {
  id_usuario: number;
  desc_email: string;
  desc_password_hash?: string;
  desc_rol: string;
  flag_activo: number;
  id_cliente?: number | null;
  nom_nombre?: string | null;
  desc_apellido?: string | null;
  cod_documento?: string | null;
  desc_telefono?: string | null;
}

/**
 * Encripta una contraseña con BCrypt (compatible con Spring Boot BCryptPasswordEncoder).
 */
export async function hashPassword(plain: string): Promise<string> {
  return await bcrypt.hash(plain, 10);
}

/**
 * Verifica una contraseña en texto plano contra el hash almacenado.
 * Soporta tanto hashes BCrypt ($2a$, $2b$, $2y$) de Spring Boot como contraseñas planas de testing.
 */
export async function verifyPassword(plain: string, hash: string): Promise<boolean> {
  if (!hash || !plain) return false;
  if (hash.startsWith('$2a$') || hash.startsWith('$2b$') || hash.startsWith('$2y$')) {
    try {
      return await bcrypt.compare(plain, hash);
    } catch {
      return false;
    }
  }
  // Comparación directa si está en texto plano
  return plain === hash;
}

/**
 * Consulta todos los usuarios desde la tabla `lk_usuarios` con join a `lk_clientes` o `lk_cliente`.
 */
export async function getUsuariosFromDb(): Promise<DbUsuario[]> {
  const pool = getDbPool();
  // Intento 1: lk_clientes (nombre del script SQL original)
  try {
    const [rows]: any = await pool.query(`
      SELECT 
        u.id_usuario,
        u.desc_email,
        u.desc_rol,
        u.flag_activo,
        c.id_cliente,
        c.nom_nombre,
        c.desc_apellido,
        c.cod_documento,
        c.desc_telefono
      FROM lk_usuarios u
      LEFT JOIN lk_clientes c ON u.id_usuario = c.id_usuario
      ORDER BY u.id_usuario ASC
    `);
    return rows;
  } catch {
    // Intento 2: lk_cliente (singular)
    try {
      const [rows]: any = await pool.query(`
        SELECT 
          u.id_usuario,
          u.desc_email,
          u.desc_rol,
          u.flag_activo,
          c.id_cliente,
          c.nom_nombre,
          c.desc_apellido,
          c.cod_documento,
          c.desc_telefono
        FROM lk_usuarios u
        LEFT JOIN lk_cliente c ON u.id_usuario = c.id_usuario
        ORDER BY u.id_usuario ASC
      `);
      return rows;
    } catch {
      // Intento 3: solo lk_usuarios
      const [userOnlyRows]: any = await pool.query(`
        SELECT 
          id_usuario,
          desc_email,
          desc_rol,
          flag_activo
        FROM lk_usuarios
        ORDER BY id_usuario ASC
      `);
      return userOnlyRows;
    }
  }
}

/**
 * Busca un usuario por email en `lk_usuarios` junto con datos de cliente si existen.
 */
export async function findUsuarioByEmail(email: string): Promise<DbUsuario | null> {
  const pool = getDbPool();
  try {
    const [rows]: any = await pool.query(
      `SELECT 
        u.id_usuario,
        u.desc_email,
        u.desc_password_hash,
        u.desc_rol,
        u.flag_activo,
        c.id_cliente,
        c.nom_nombre,
        c.desc_apellido,
        c.cod_documento,
        c.desc_telefono
      FROM lk_usuarios u
      LEFT JOIN lk_clientes c ON u.id_usuario = c.id_usuario
      WHERE u.desc_email = ? LIMIT 1`,
      [email]
    );
    if (rows.length > 0) return rows[0];
  } catch {
    try {
      const [rows]: any = await pool.query(
        `SELECT 
          u.id_usuario,
          u.desc_email,
          u.desc_password_hash,
          u.desc_rol,
          u.flag_activo,
          c.id_cliente,
          c.nom_nombre,
          c.desc_apellido,
          c.cod_documento,
          c.desc_telefono
        FROM lk_usuarios u
        LEFT JOIN lk_cliente c ON u.id_usuario = c.id_usuario
        WHERE u.desc_email = ? LIMIT 1`,
        [email]
      );
      if (rows.length > 0) return rows[0];
    } catch {
      const [rows]: any = await pool.query(
        'SELECT * FROM lk_usuarios WHERE desc_email = ? LIMIT 1',
        [email]
      );
      if (rows.length > 0) return rows[0];
    }
  }
  return null;
}

/**
 * Crea un nuevo usuario en `lk_usuarios` y opcionalmente en `lk_clientes`/`lk_cliente`.
 */
export async function createUsuarioInDb(data: {
  email: string;
  passwordHash: string;
  rol?: string;
  nombre?: string;
  apellido?: string;
  documento?: string;
  telefono?: string;
}): Promise<number> {
  const pool = getDbPool();
  const rol = data.rol || 'CLIENTE';

  const [resUser]: any = await pool.query(
    `INSERT INTO lk_usuarios (desc_email, desc_password_hash, desc_rol, flag_activo)
     VALUES (?, ?, ?, 1)`,
    [data.email, data.passwordHash, rol]
  );
  const nuevoId = resUser.insertId;

  // Si se pasaron datos personales, insertamos en la tabla de clientes
  if (data.nombre || data.documento) {
    const doc = data.documento || `DOC-${nuevoId}`;
    const nom = data.nombre || data.email.split('@')[0];
    const ape = data.apellido || '';
    const tel = data.telefono || null;

    try {
      await pool.query(
        `INSERT INTO lk_clientes (id_usuario, cod_documento, nom_nombre, desc_apellido, desc_telefono, flag_activo)
         VALUES (?, ?, ?, ?, ?, 1)`,
        [nuevoId, doc, nom, ape, tel]
      );
    } catch {
      try {
        await pool.query(
          `INSERT INTO lk_cliente (id_usuario, cod_documento, nom_nombre, desc_apellido, desc_telefono, flag_activo)
           VALUES (?, ?, ?, ?, ?, 1)`,
          [nuevoId, doc, nom, ape, tel]
        );
      } catch (err: any) {
        console.warn('[DB] No se pudo crear registro en clientes:', err.message);
      }
    }
  }

  return nuevoId;
}

/**
 * Actualiza la contraseña en `lk_usuarios`.
 */
export async function updatePasswordInDb(email: string, newPasswordHash: string): Promise<boolean> {
  const pool = getDbPool();
  const [res]: any = await pool.query(
    'UPDATE lk_usuarios SET desc_password_hash = ? WHERE desc_email = ?',
    [newPasswordHash, email]
  );
  return res.affectedRows > 0;
}

/**
 * Consulta los vehículos de `lk_vehiculo`.
 */
export async function getVehiculosFromDb(): Promise<any[]> {
  const pool = getDbPool();
  const [rows]: any = await pool.query('SELECT * FROM lk_vehiculo ORDER BY id_vehiculo ASC');
  return rows;
}

/**
 * Consulta las reservas de `hecho_alquiler` o tablas afines.
 */
export async function getReservasFromDb(): Promise<any[]> {
  const pool = getDbPool();
  const [rows]: any = await pool.query(`
    SELECT * FROM hecho_alquiler ORDER BY id_alquiler DESC LIMIT 100
  `);
  return rows;
}
