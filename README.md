# Rentar

Sistema web para la gestión de alquiler de vehículos, desarrollado como Trabajo Práctico de la materia **(UNLa - Grupo D - C2 - 2026)**.

> ¿Recién arrancás y no tenés el entorno instalado? Mirá [`SETUP.md`](./SETUP.md) para instalar todo desde cero (Git, Node, Java, MySQL).

## Descripción

**Rentar** es una aplicación destinada a gestionar el alquiler de vehículos, permitiendo administrar vehículos y clientes, consultar disponibilidad, registrar y gestionar reservas, y consultar el historial de alquileres.

El backend está desarrollado con **Spring Boot**, exponiendo funcionalidades mediante APIs REST y GraphQL. El sistema incluye además una aplicación web (React + Node/Express) como cliente de consumo de estas APIs.

## Tecnologías

**Backend**
- Java 21
- Spring Boot
- Spring Data JPA
- Spring Security (roles `ROLE_ADMIN` / `ROLE_CLIENTE`)
- MySQL
- Lombok
- Swagger / OpenAPI
- REST
- GraphQL

**Aplicación web**
- React 18, TypeScript, Vite, Tailwind CSS
- Node.js / Express

## Funcionalidades

El Trabajo Práctico contempla las siguientes funcionalidades:

| # | Funcionalidad | Tecnología |
|---|---|---|
| 1 | Gestión de vehículos | REST |
| 2 | Consulta de disponibilidad | GraphQL |
| 3 | Gestión de clientes | REST |
| 4 | Alta de reserva | REST |
| 5 | Consulta de reservas | GraphQL |
| 6 | Cancelación de reserva | REST |
| 7 | Historial de alquileres | GraphQL |

## Documentación de la API

La API REST se documenta mediante **Swagger / OpenAPI**. Desde ahí se pueden consultar y ejecutar los endpoints disponibles, incluyendo parámetros y cuerpos de las solicitudes.

Con la aplicación ejecutándose, acceder a:

```
http://localhost:8080/swagger-ui/index.html
```

## Estructura del proyecto

La aplicación sigue una estructura separada por responsabilidades:

```text
src/
└── main/
    └── java/
        └── com.grupo_d_c2_2026_unla.rentar/
            ├── controller/
            ├── dto/
            ├── entity/
            ├── repository/
            ├── service/
            │   └── implementation/
            ├── enums/
            └── ...
```

### Capas principales

- **Controller:** recibe las solicitudes HTTP y expone los endpoints.
- **Service:** contiene la lógica de negocio.
- **Repository:** acceso a la base de datos mediante Spring Data JPA.
- **Entity:** representa las tablas de la base de datos.
- **DTO:** objetos utilizados para recibir y devolver información mediante las APIs.

## Base de datos

El sistema utiliza **MySQL** como motor de base de datos. Esquema `rentar_db`, con tablas de dimensiones (`lk_usuarios`, `lk_clientes`, `lk_vehiculo`, `lk_tiempo`) y tabla de hechos (`hecho_alquiler`).

### Modelo

![Modelo de base de datos](Proyecto/BD/Rentar.png)

> ⚠️ Verificar con el equipo el nombre exacto del script SQL — aparece como `rentarBD.sql` y como `RentarBD.sql` en distintos documentos del proyecto; deberían unificarlo a uno solo.

## Requisitos previos

Asumiendo que ya tenés el entorno de desarrollo instalado ([`SETUP.md`](./SETUP.md) si no):

- **Java 21** instalado.
- **MySQL Server** instalado y ejecutándose localmente en el puerto `3306`.
- Base de datos **`rentar_db`** creada mediante el script `Proyecto/BD/RentarBD.sql`.
- Credenciales de MySQL configuradas en `src/main/resources/application.properties`.
- (Opcional, para la app web) **Node.js** instalado, si vas a correr también el cliente React.

## Ejecución del proyecto

1. Clonar o actualizar el repositorio (`git pull`).
2. Verificar la configuración de conexión a MySQL en `application.properties`.
3. Confirmar que la base de datos `rentar_db` haya sido creada mediante `Proyecto/BD/RentarBD.sql`.
4. Ejecutar la aplicación Spring Boot:
   ```bash
   ./mvnw spring-boot:run
   ```
5. (Opcional) Ejecutar la app web:
   ```bash
   npm install
   npm run dev
   ```
6. Una vez iniciada la aplicación, usar Swagger (`http://localhost:8080/swagger-ui/index.html`) para consultar y probar los endpoints REST disponibles, o la app web en `http://localhost:3000`.

## Equipo

**Grupo D - C2 - 2026 - UNLa**

Trabajo Práctico — Sistema de alquiler de vehículos **Rentar**.
