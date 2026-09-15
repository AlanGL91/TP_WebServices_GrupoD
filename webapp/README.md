# Rentar

Sistema web para la gestión integral de alquiler de vehículos, desarrollado como Trabajo Práctico de la materia (**UNLa - Grupo D - C2 - 2026**).

---

## 📌 Descripción del Proyecto

**Rentar** es una plataforma completa para la administración y reserva de flotas de vehículos. El sistema cuenta con:
1. **Aplicación Web Interactiva (Full-Stack):** Desarrollada con React 18, TypeScript, Vite, Tailwind CSS y Node.js/Express, con persistencia directa a MySQL y soporte fallback en memoria.
2. **Backend de Servicios (Spring Boot):** Arquitectura empresarial en Java 21 con Spring Boot, Spring Data JPA, Spring Security, APIs REST y GraphQL documentadas en Swagger/OpenAPI.
3. **Base de Datos Relacional (MySQL):** Esquema normalizado multidimensional (`rentar_db`) con tablas de dimensiones (`lk_usuarios`, `lk_clientes`, `lk_vehiculo`, `lk_tiempo`) y tabla de hechos (`hecho_alquiler`).

---

## 🚀 Tecnologías Utilizadas

### Frontend (Web App)
- **React 18** (Componentes funcionales, Hooks personalizados).
- **Vite** (Build tool de ultra alta velocidad y middleware integrado).
- **TypeScript** (Tipado estático seguro y contratos compartidos).
- **Tailwind CSS** (Diseño moderno, adaptable y accesible).
- **Lucide React** (Iconografía vectorial profesional).

### Backend Web & Persistencia
- **Node.js & Express** (Servidor API REST integrado en el puerto `3000`).
- **`mysql2/promise`** (Pool de conexiones MySQL asíncrono con reconexión automática y timeouts de seguridad).
- **`bcryptjs`** (Algoritmo de encriptación BCrypt con 10 rondas de salt, **100% compatible con `BCryptPasswordEncoder` de Spring Security**).

### Backend Empresarial (Spring Boot)
- **Java 21**
- **Spring Boot 3**
- **Spring Security** (Autenticación y autorización basada en roles `ROLE_ADMIN` y `ROLE_CLIENTE`).
- **Spring Data JPA & Hibernate**
- **Lombok**
- **Swagger / OpenAPI 3** (Documentación interactiva en `/swagger-ui/index.html`).
- **APIs REST & GraphQL**

### Motor de Base de Datos
- **MySQL 8.0+** (Base de datos `rentar_db` con codificación `utf8mb4`).

---

## 🔐 Módulo de Autenticación y Seguridad

El sistema implementa control de acceso basado en roles (**RBAC**):

* **ROLE_ADMIN:** Control total del sistema, panel de métricas, ABM completo de vehículos (crear, editar, activar/desactivar), gestión de clientes y supervisión de todas las reservas.
* **ROLE_CLIENTE:** Catálogo con filtros avanzados, consulta de disponibilidad en tiempo real, registro de alquileres propios y visualización de su historial.

### Flujos disponibles en la pantalla de Login:
1. **Iniciar Sesión:**
   * Busca al usuario directamente en la tabla `lk_usuarios` de MySQL.
   * Valida la contraseña ingresada contrastándola contra el hash BCrypt (`$2a$`, `$2b$`) almacenado en `desc_password_hash`.
2. **Crear una Cuenta (Alta de Usuario):**
   * Accesible mediante el enlace: *"¿No posee una cuenta registrada? Crear una cuenta"*.
   * Solicita Nombre, Apellido, DNI/Documento, Teléfono, Correo Electrónico y Contraseña.
   * Encripta la clave con BCrypt e inserta automáticamente en `lk_usuarios` y `lk_clientes` con vinculación por clave foránea.
3. **Cambiar Contraseña:**
   * Accesible mediante el enlace: *"¿Olvidaste o querés cambiar tu contraseña?"*.
   * Permite actualizar la clave indicando el correo y la nueva contraseña (con validación opcional de la clave actual).
   * Actualiza el campo `desc_password_hash` con el nuevo hash encriptado.

---

## ⚙️ Configuración de la Base de Datos (`database/config.ts`)

La conexión de la aplicación web a MySQL está centralizada en `database/config.ts` (y sincronizada en `webapp/database/config.ts`). 

### Código de configuración:

```typescript
/**
 * Configuración centralizada de conexión a la base de datos MySQL (rentar_db).
 * Valores por defecto típicos de MySQL local, sobreescribibles mediante variables de entorno.
 */
export const dbConfig = {
  host: process.env.DB_HOST || '127.0.0.1',
  port: parseInt(process.env.DB_PORT || '3306', 10),
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD !== undefined ? process.env.DB_PASSWORD : '',
  database: process.env.DB_NAME || 'rentar_db',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  connectTimeout: 4000,
};
```

### Variables de Entorno Opcionales (`.env`):
Puedes crear un archivo `.env` en la raíz del proyecto para sobreescribir los valores por defecto:

```env
DB_HOST=127.0.0.1
DB_PORT=3306
DB_USER=root
DB_PASSWORD=
DB_NAME=rentar_db
```

> **Nota:** Si tu MySQL no tiene contraseña (instalación habitual en macOS con Homebrew o en XAMPP), deja `DB_PASSWORD=` vacío.

---

## 🛠️ Paso a Paso: Instalación y Sincronización de MySQL

El script oficial de creación de tablas e inserción de datos iniciales se encuentra en:
`Proyecto/BD/RentarBD.sql`

A continuación se detalla cómo sincronizar la base de datos desde la terminal según tu sistema operativo:

---

### 🍏 En macOS (Terminal / Homebrew / Zsh)

#### 1. Iniciar el servicio de MySQL
Si instalaste MySQL mediante Homebrew:
```bash
brew services start mysql
```
O bien verificar su estado:
```bash
mysqladmin -u root status
```

#### 2. Crear la base de datos `rentar_db`
Desde la terminal de macOS ejecuta:
* **Si tu usuario root no tiene contraseña:**
  ```bash
  mysql -u root -e "CREATE DATABASE IF NOT EXISTS rentar_db CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci;"
  ```
* **Si tu usuario root tiene contraseña:**
  ```bash
  mysql -u root -p -e "CREATE DATABASE IF NOT EXISTS rentar_db CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci;"
  ```

#### 3. Importar y sincronizar las tablas
Posicionado en la raíz del repositorio:
* **Sin contraseña:**
  ```bash
  mysql -u root rentar_db < Proyecto/BD/RentarBD.sql
  ```
* **Con contraseña:**
  ```bash
  mysql -u root -p rentar_db < Proyecto/BD/RentarBD.sql
  ```

#### 4. Verificar las tablas creadas
```bash
mysql -u root rentar_db -e "SHOW TABLES;"
```
Deberías ver listadas: `lk_usuarios`, `lk_clientes`, `lk_vehiculo`, `lk_tiempo`, `hecho_alquiler`.

---

### 🪟 En Windows (PowerShell / Símbolo del Sistema CMD)

#### 1. Iniciar el servicio de MySQL
Asegúrate de que el servicio esté corriendo:
* Desde **PowerShell** (como Administrador):
  ```powershell
  Start-Service MySQL80
  ```
  *(o el nombre del servicio según tu versión: `MySQL`, `mysql`, o desde el panel de XAMPP / WAMP)*.

#### 2. Crear la base de datos `rentar_db`
Abre una terminal en la raíz del proyecto:
* **Sin contraseña:**
  ```powershell
  mysql -u root -e "CREATE DATABASE IF NOT EXISTS rentar_db CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci;"
  ```
* **Con contraseña:**
  ```powershell
  mysql -u root -p -e "CREATE DATABASE IF NOT EXISTS rentar_db CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci;"
  ```

> *Tip Windows:* Si el comando `mysql` no es reconocido, agrega la ruta del binario a tus Variables de Entorno (ej. `C:\Program Files\MySQL\MySQL Server 8.0\bin`).

#### 3. Importar y sincronizar las tablas

* **En PowerShell:**
  * Sin contraseña:
    ```powershell
    Get-Content Proyecto\BD\RentarBD.sql -Raw | mysql -u root rentar_db
    ```
  * Con contraseña:
    ```powershell
    Get-Content Proyecto\BD\RentarBD.sql -Raw | mysql -u root -p rentar_db
    ```

* **En CMD (Símbolo del Sistema clásico):**
  * Sin contraseña:
    ```cmd
    mysql -u root rentar_db < Proyecto\BD\RentarBD.sql
    ```
  * Con contraseña:
    ```cmd
    mysql -u root -p rentar_db < Proyecto\BD\RentarBD.sql
    ```

#### 4. Verificar las tablas creadas
```powershell
mysql -u root rentar_db -e "SHOW TABLES;"
```

---

## 💻 Ejecución de la Aplicación Web

Una vez que MySQL está corriendo y la base de datos `rentar_db` está creada:

1. **Instalar dependencias del proyecto:**
   ```bash
   npm install
   ```

2. **Iniciar el servidor de desarrollo:**
   ```bash
   npm run dev
   ```

3. **Abrir en el navegador:**
   Accede a [http://localhost:3000](http://localhost:3000).

El servidor detectará automáticamente la conexión a tu MySQL local. Si por alguna razón MySQL no estuviese activo, la aplicación activará de manera transparente el modo de respaldo en memoria para que puedas continuar trabajando sin interrupciones.

---

## ☕ Ejecución del Backend Spring Boot (Opcional / Servicios REST & GraphQL)

Si deseas levantar los microservicios y endpoints en Java:

1. Verifica el archivo `src/main/resources/application.properties`:
   ```properties
   spring.datasource.url=jdbc:mysql://localhost:3306/rentar_db?useSSL=false&serverTimezone=UTC
   spring.datasource.username=root
   spring.datasource.password=
   spring.jpa.hibernate.ddl-auto=update
   ```
2. Compilar y ejecutar con Maven:
   ```bash
   ./mvnw spring-boot:run
   ```
   *(En Windows: `mvnw.cmd spring-boot:run`)*
3. Documentación Swagger disponible en:
   [http://localhost:8080/swagger-ui/index.html](http://localhost:8080/swagger-ui/index.html)

---

## 👥 Equipo de Desarrollo

**Grupo D - C2 - 2026 - UNLa**
Trabajo Práctico — Sistema de Alquiler de Vehículos **Rentar**.
