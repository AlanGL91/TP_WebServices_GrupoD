# Rentar

Sistema web para la gestión integral de alquiler de vehículos, desarrollado como Trabajo Práctico de la materia (**UNLa - Grupo D - C2 - 2026**).

---

## 📌 Descripción del Proyecto

**Rentar** es una plataforma completa para la administración y reserva de flotas de vehículos. El sistema cuenta con:

1. **Aplicación Web Interactiva (Full-Stack):** React 18, TypeScript, Vite, Tailwind CSS y Node.js/Express, con persistencia en MySQL y soporte fallback en memoria.
2. **Backend de Servicios (Spring Boot):** Java 21 con Spring Boot, Spring Data JPA, Spring Security, APIs REST y GraphQL documentadas en Swagger/OpenAPI.
3. **Base de Datos Relacional (MySQL):** Esquema `rentar_db` con tablas de dimensiones (`lk_usuarios`, `lk_clientes`, `lk_vehiculo`, `lk_tiempo`) y tabla de hechos (`ft_reservas`).

---

## 🚀 Tecnologías Utilizadas

**Frontend:** React 18, Vite, TypeScript, Tailwind CSS, Lucide React.

**Backend Web & Persistencia:** Node.js & Express (puerto `3000`), `mysql2/promise`, `bcryptjs` (compatible con `BCryptPasswordEncoder` de Spring Security).

**Backend Empresarial:** Java 21, Spring Boot 3, Spring Security (roles `ROLE_ADMIN` / `ROLE_CLIENTE`), Spring Data JPA & Hibernate, Lombok, Swagger/OpenAPI 3, REST & GraphQL.

**Base de datos:** MySQL 8.0+ (`utf8mb4`).

---

## 🧰 Requisitos previos (instalación desde cero)

Si tu máquina no tiene nada instalado, seguí este orden. Cada herramienta trae el comando para macOS y para Windows uno al lado del otro.

### 1. Git

| macOS (Terminal / zsh) | Windows (PowerShell) |
|---|---|
| `xcode-select --install` (instala Git junto con las Command Line Tools) | Descargar e instalar [Git for Windows](https://git-scm.com/download/win) — dejar todas las opciones por defecto |

Verificar en ambos:
```bash
git --version
```

Configurar identidad (una sola vez, en cualquier SO):
```bash
git config --global user.name "Tu Nombre"
git config --global user.email "tu-email@ejemplo.com"
```

### 2. Node.js (usando `nvm`, recomendado sobre instalar Node directo)

| macOS | Windows |
|---|---|
| `brew install nvm` → agregar `nvm` al `.zshrc` según indique la instalación → `nvm install --lts` | Instalar [nvm-windows](https://github.com/coreybutler/nvm-windows/releases) → `nvm install lts` → `nvm use lts` |

Verificar:
```bash
node --version
npm --version
```

### 3. Java 21 (JDK)

| macOS | Windows |
|---|---|
| `brew install openjdk@21` y luego seguir las instrucciones de `brew` para agregarlo al `PATH` | Instalar [Eclipse Temurin JDK 21](https://adoptium.net/) (marcar la opción "Set JAVA_HOME variable" durante la instalación) |

Verificar:
```bash
java --version
```
> No hace falta instalar Maven aparte: el proyecto incluye el wrapper (`mvnw` / `mvnw.cmd`), que descarga la versión correcta automáticamente.

### 4. MySQL 8.0+

| macOS | Windows |
|---|---|
| `brew install mysql` | Instalar [MySQL Installer](https://dev.mysql.com/downloads/installer/) → elegir setup "Server only" o "Developer Default" |

---

## 📥 Clonar el repositorio

```bash
git clone <URL_DEL_REPOSITORIO>
cd rentar
```

> Reemplazá `<URL_DEL_REPOSITORIO>` por la URL real del repo del Grupo D (SSH o HTTPS).

---

## 🗄️ Base de Datos: iniciar, crear y sincronizar `rentar_db`

El script de creación de tablas e inserción de datos iniciales está en `Proyecto/BD/RentarBD.sql`.

### Paso 1 — Iniciar el servicio de MySQL

| macOS | Windows (PowerShell, como Administrador) |
|---|---|
| `brew services start mysql` | `Start-Service MySQL80` *(o el nombre de servicio según tu versión — también disponible desde el panel de XAMPP/WAMP si usás esa opción)* |

### Paso 2 — Crear la base de datos

| macOS | Windows |
|---|---|
| `mysql -u root -e "CREATE DATABASE IF NOT EXISTS rentar_db CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci;"` | `mysql -u root -e "CREATE DATABASE IF NOT EXISTS rentar_db CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci;"` |

Si tu `root` tiene contraseña, agregá `-p` al comando en cualquiera de los dos SO.

> *Tip Windows:* si `mysql` no se reconoce como comando, agregá su carpeta `bin` (ej. `C:\Program Files\MySQL\MySQL Server 8.0\bin`) a las Variables de Entorno.

### Paso 3 — Importar el esquema y los datos

Parado en la raíz del repo:

| macOS | Windows (PowerShell) |
|---|---|
| `mysql -u root rentar_db < Proyecto/BD/RentarBD.sql` | `Get-Content Proyecto\BD\RentarBD.sql -Raw \| mysql -u root rentar_db` |

(agregar `-p` después de `-u root` si corresponde).

### Paso 4 — Verificar

```bash
mysql -u root rentar_db -e "SHOW TABLES;"
```
Deberías ver: `lk_usuarios`, `lk_clientes`, `lk_vehiculo`, `lk_tiempo`, `hecho_alquiler`.

---

## ⚙️ Configuración de conexión

La conexión de la app web a MySQL está en `database/config.ts` (sincronizado en `webapp/database/config.ts`), con estos valores por defecto:

```typescript
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

Si necesitás otros valores, creá un `.env` en la raíz del proyecto:

```env
DB_HOST=127.0.0.1
DB_PORT=3306
DB_USER=root
DB_PASSWORD=
DB_NAME=rentar_db
```

> Si tu MySQL local no tiene contraseña (instalación típica con Homebrew o XAMPP), dejá `DB_PASSWORD=` vacío.

---

## 💻 Ejecutar la aplicación web

Válido igual en macOS y Windows, parado en la raíz del repo:

```bash
npm install
npm run dev
```

Abrir [http://localhost:3000](http://localhost:3000). Si MySQL no está activo, la app pasa automáticamente a modo de respaldo en memoria.

---

## ☕ Ejecutar el backend Spring Boot (opcional — servicios REST & GraphQL)

Revisar `src/main/resources/application.properties`:
```properties
spring.datasource.url=jdbc:mysql://localhost:3306/rentar_db?useSSL=false&serverTimezone=UTC
spring.datasource.username=root
spring.datasource.password=
spring.jpa.hibernate.ddl-auto=update
```

Compilar y ejecutar:

| macOS | Windows |
|---|---|
| `./mvnw spring-boot:run` | `mvnw.cmd spring-boot:run` |

Swagger disponible en [http://localhost:8080/swagger-ui/index.html](http://localhost:8080/swagger-ui/index.html).

---

## 🔐 Autenticación y Roles

Control de acceso basado en roles (RBAC):

- **ROLE_ADMIN:** panel de métricas, ABM completo de vehículos, gestión de clientes, supervisión de reservas.
- **ROLE_CLIENTE:** catálogo con filtros, disponibilidad en tiempo real, alquileres propios, historial.

Flujos en la pantalla de Login: iniciar sesión (valida contra el hash BCrypt en `desc_password_hash`), crear cuenta (inserta en `lk_usuarios` y `lk_clientes`), y cambiar contraseña.

---

## 👥 Equipo de Desarrollo

**Grupo D - C2 - 2026 - UNLa** — Trabajo Práctico: Sistema de Alquiler de Vehículos **Rentar**.
