/**
 * Configuración centralizada de conexión a la base de datos MySQL (rentar_db).
 * Valores por defecto típicos de MySQL local, sobreescribibles mediante variables de entorno.
 */
export const dbConfig = {
  host: process.env.DB_HOST || '127.0.0.1',
  port: parseInt(process.env.DB_PORT || '3306', 10),
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD !== undefined ? process.env.DB_PASSWORD : 'root',
  database: process.env.DB_NAME || 'rentar_db',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  connectTimeout: 4000,
};
