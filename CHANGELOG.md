# Registro Completo de Cambios y Archivos (CHANGELOG)

Este documento detalla exhaustivamente todos los archivos **agregados**, todos los archivos **modificados** y el desglose de lo que se cambió en cada uno desde el inicio de esta conversación en el proyecto **Rentar**.

---

## 📁 1. Archivos Nuevos Agregados

Todos los archivos nuevos de base de datos y persistencia fueron creados dentro de la carpeta **`database/`** (y replicados en `webapp/database/` para mantener sincronizada la versión dentro del subproyecto webapp), garantizando que **ninguna de las carpetas originales (`Proyecto/` y `src/main/java/`) fuera alterada**.

| # | Archivo | Ruta Relativa | Estado | Descripción y Funcionalidad |
| :-: | :--- | :--- | :-: | :--- |
| 1 | **`config.ts`** | `database/config.ts`<br>`webapp/database/config.ts` | **NUEVO** | Configuración centralizada de MySQL con el objeto exportado `dbConfig` (host, port, user, password, database: `rentar_db`, pool limit, connectTimeout). Admite variables de entorno. |
| 2 | **`connection.ts`** | `database/connection.ts`<br>`webapp/database/connection.ts` | **NUEVO** | Inicialización del pool de conexiones `mysql2/promise`. Incluye las funciones `getDbPool()`, `testDbConnection()` (para probar handshake inicial) y `isDbConnected()` (estado reactivo del servidor). |
| 3 | **`repositories.ts`** | `database/repositories.ts`<br>`webapp/database/repositories.ts` | **NUEVO** | Métodos de consulta SQL y encriptación:<br>• `hashPassword(plain)`: Encriptación con **BCrypt** (10 salt rounds, compatible con Spring Security).<br>• `verifyPassword(plain, hash)`: Validación de hashes BCrypt (`$2a$`, `$2b$`) y fallback a texto plano.<br>• `getUsuariosFromDb()`: Consulta `lk_usuarios` con join a `lk_clientes`/`lk_cliente`.<br>• `findUsuarioByEmail(email)`: Búsqueda de usuario por correo con clave foránea de cliente.<br>• `createUsuarioInDb(data)`: Alta transaccional de usuario en `lk_usuarios` y cliente en `lk_clientes`.<br>• `updatePasswordInDb(email, hash)`: Actualización del hash en `desc_password_hash`.<br>• `getVehiculosFromDb()`, `getReservasFromDb()`. |
| 4 | **`index.ts`** | `database/index.ts`<br>`webapp/database/index.ts` | **NUEVO** | Archivo barril (*barrel export*) que re-exporta de manera limpia todos los tipos, interfaces y funciones de `config.ts`, `connection.ts` y `repositories.ts`. |
| 5 | **`CHANGELOG.md`** | `CHANGELOG.md`<br>`webapp/CHANGELOG.md` | **NUEVO** | Registro de auditoría y documentación de cambios del proyecto. |
| 6 | **`README.md`** | `README.md`<br>`webapp/README.md` | **ACTUALIZADO / RE-CREADO** | Manual de usuario e instalación que documenta: descripción del sistema, tecnologías, detalle del RBAC, configuración de `dbConfig`, y guías paso a paso para la terminal en **macOS** (Homebrew/Zsh) y **Windows** (PowerShell/CMD). |

---

## ✏️ 2. Archivos Modificados y Qué se Modificó

### A. `server.ts` (y `webapp/server.ts`)
* **Importaciones de persistencia y BCrypt**:
  ```typescript
  import {
    dbConfig,
    testDbConnection,
    getUsuariosFromDb,
    isDbConnected,
    findUsuarioByEmail,
    createUsuarioInDb,
    updatePasswordInDb,
    hashPassword,
    verifyPassword,
  } from './database';
  ```
* **Actualización del endpoint `POST /api/auth/login`**:
  * Ahora consulta primero la base de datos MySQL (tabla `lk_usuarios`) si está conectada.
  * Valida la contraseña usando `verifyPassword()` con algoritmo **BCrypt**, permitiendo ingresar con las contraseñas hasheadas de Spring Boot (`$2a$`, `$2b$`).
  * Si la BD no está levantada, conmuta transparentemente a la memoria de respaldo (*graceful degradation*).
* **Nuevo endpoint `POST /api/auth/register` (Alta de Usuario)**:
  * Recibe `email`, `password`, `nombre`, `apellido`, `documento`, `telefono`, `rol`.
  * Genera el hash BCrypt de la contraseña (`hashPassword`).
  * Inserta el usuario en `lk_usuarios` y el registro correspondiente en `lk_clientes` con la clave foránea `id_usuario`.
* **Nuevo endpoint `POST /api/auth/cambiar-password` (Cambio de Contraseña)**:
  * Recibe `email`, `passwordActual` (opcional), `passwordNueva`.
  * Valida la contraseña actual si fue ingresada.
  * Genera el nuevo hash BCrypt y ejecuta `UPDATE lk_usuarios SET desc_password_hash = ? WHERE desc_email = ?`.

---

### B. `src/components/LoginView.tsx` (y `webapp/src/components/LoginView.tsx`)
* **Eliminación del selector de pestañas**:
  * La pantalla inicia directamente y de manera limpia en el formulario de **Iniciar Sesión**.
* **Acceso a Cambiar Contraseña**:
  * Se agregó el enlace directo sobre el campo de contraseña:
    > *"¿Olvidaste o querés cambiar tu contraseña?"*
  * Al hacer clic, despliega la pantalla de cambio de clave con inputs para correo, clave actual (opcional), nueva clave y confirmación, además del botón para **← Volver a Iniciar Sesión**.
* **Acceso formal a Dar de Alta (Crear Cuenta)**:
  * Se agregó el enlace formal al pie del formulario:
    > *"¿No posee una cuenta registrada? Crear una cuenta"*
  * Al hacer clic, despliega el formulario completo de registro solicitando: Nombre, Apellido, DNI/Documento, Teléfono, Correo (`desc_email`), Contraseña, Confirmación de Contraseña y Selector de Rol (`CLIENTE` o `ADMIN`). Incluye el botón para **← Volver a Iniciar Sesión**.
* **Feedback de usuario**:
  * Manejo de alertas visuales de error (color rojo) y avisos de éxito (color verde esmeralda con `CheckCircle2`).

---

### C. `package.json` (y `webapp/package.json`)
* Se instaló la dependencia **`bcryptjs`** en `dependencies`.
* Se instaló la dependencia **`@types/bcryptjs`** en `devDependencies`.

---

## 🏗️ 3. Estructura de Carpetas: ¿Están los archivos nuevos en carpetas separadas?

**Sí, totalmente separadas.** 

El proyecto mantiene la siguiente separación arquitectónica limpia:

```text
rentar/
├── database/                                  <-- [NUEVA CARPETA SEPARADA]
│   ├── config.ts                              <-- Configuración MySQL dbConfig
│   ├── connection.ts                          <-- Pool mysql2 y chequeo de salud
│   ├── repositories.ts                        <-- Consultas SQL y métodos BCrypt
│   └── index.ts                               <-- Exportaciones unificadas
│
├── Proyecto/                                  <-- [CARPETA ORIGINAL INTACTA]
│   ├── BD/
│   │   ├── RentarBD.sql                       <-- Script SQL original de MySQL
│   │   ├── Rentar.png
│   │   └── RENTAR.mwb
│   ├── Trello/
│   └── TP_Web-servicesHITO1.pdf
│
├── src/main/java/                             <-- [CARPETA ORIGINAL JAVA INTACTA]
│   └── com/grupo_d_c2_2026_unla/rentar/
│       ├── config/SecurityConfig.java         <-- Spring Security BCrypt original
│       ├── security/CustomUserDetailsService.java
│       └── ...
│
├── src/components/
│   └── LoginView.tsx                          <-- [MODIFICADO] Login, Alta y Cambio Pass
│
├── server.ts                                  <-- [MODIFICADO] Endpoints MySQL y Auth
├── package.json                               <-- [MODIFICADO] Librería bcryptjs
├── README.md                                  <-- [ACTUALIZADO] Manual y Guía de Terminal
└── CHANGELOG.md                               <-- [NUEVO] Este registro de cambios
```

Tanto los scripts de base de datos originales (`Proyecto/BD/`) como el código de Spring Boot (`src/main/java/`) no sufrieron modificaciones invasivas, asegurando total compatibilidad entre la Web App y el Backend Java original.
