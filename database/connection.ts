import mysql from 'mysql2/promise';
import { dbConfig } from './config';

/**
 * Pool de conexiones a MySQL para reutilización eficiente.
 */
let pool: mysql.Pool | null = null;
let isConnected = false;
let lastError: string | null = null;

export function getDbPool(): mysql.Pool {
  if (!pool) {
    pool = mysql.createPool(dbConfig);
  }
  return pool;
}

/**
 * Prueba y valida la conexión real a MySQL y a la base de datos 'rentar_db'.
 */
export async function testDbConnection(): Promise<{ ok: boolean; message: string; database?: string }> {
  try {
    const currentPool = getDbPool();
    const connection = await currentPool.getConnection();
    
    // Consulta de prueba para verificar base de datos y versión
    const [rows]: any = await connection.query('SELECT DATABASE() as db, VERSION() as version');
    connection.release();

    const currentDb = rows[0]?.db || dbConfig.database;
    const version = rows[0]?.version || '';

    isConnected = true;
    lastError = null;

    return {
      ok: true,
      message: `Conexión activa a MySQL (${version}) en ${dbConfig.host}:${dbConfig.port}`,
      database: currentDb,
    };
  } catch (err: any) {
    isConnected = false;
    lastError = err.message || String(err);
    return {
      ok: false,
      message: `Error al conectar a MySQL (${err.code || err.message})`,
    };
  }
}

export function isDbConnected(): boolean {
  return isConnected;
}

export function getDbLastError(): string | null {
  return lastError;
}
