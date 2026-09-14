import { getDbPool, isDbConnected } from './connection';

export interface DbUsuario {
  id_usuario: number;
  desc_email: string;
  desc_rol: string;
  flag_activo: number;
  id_cliente?: number | null;
  nom_nombre?: string | null;
  desc_apellido?: string | null;
  cod_documento?: string | null;
  desc_telefono?: string | null;
}

/**
 * Consulta todos los usuarios desde la tabla `lk_usuarios` con join opcional a `lk_cliente`.
 */
export async function getUsuariosFromDb(): Promise<DbUsuario[]> {
  const pool = getDbPool();
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
  } catch (error) {
    // Si la tabla lk_cliente no existe o falla el join, hacemos un fallback simple a lk_usuarios
    try {
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
    } catch (innerError) {
      throw error;
    }
  }
}

/**
 * Busca un usuario por email en `lk_usuarios`.
 */
export async function findUsuarioByEmail(email: string): Promise<any | null> {
  const pool = getDbPool();
  const [rows]: any = await pool.query(
    'SELECT * FROM lk_usuarios WHERE desc_email = ? LIMIT 1',
    [email]
  );
  return rows.length > 0 ? rows[0] : null;
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
