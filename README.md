# Rentar

Sistema web para la gestión de alquiler de vehículos, desarrollado como Trabajo Práctico de la materia.

## Descripción

**Rentar** es una aplicación destinada a gestionar el alquiler de vehículos, permitiendo administrar vehículos y clientes, consultar disponibilidad, registrar y gestionar reservas y consultar el historial de alquileres.

El proyecto está desarrollado utilizando una arquitectura basada en **Spring Boot**, exponiendo funcionalidades mediante APIs REST y GraphQL.

## Tecnologías

- Java
- Spring Boot
- Spring Data JPA
- MySQL
- Lombok
- Swagger / OpenAPI
- REST
- GraphQL

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

La API REST se documenta mediante **Swagger / OpenAPI**.

Desde Swagger se pueden consultar y ejecutar los endpoints disponibles, incluyendo los parámetros y cuerpos de las solicitudes.

Con la aplicación ejecutándose, acceder a:

http://localhost:8080/swagger-ui/index.html

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

El sistema utiliza **MySQL** como motor de base de datos.

### Modelo
![Modelo de base de datos](Proyecto/BD/Rentar.png)

## Requisitos previos

- **Java 21** instalado.
- **MySQL Server** instalado y ejecutándose localmente en el puerto 3306.
- Base de datos **`rentar`** creada mediante el script `Proyecto/BD/rentarBD.sql`.
- Configurar las credenciales de MySQL en el proyecto.

## Ejecución del proyecto

Una vez cumplidos los requisitos previos:

1. Clonar o descargar el repositorio.
2. Verificar la configuración de conexión a MySQL.
3. Confirmar que la base de datos `rentar` haya sido creada mediante `Proyecto/BD/rentarBD.sql`.
4. Ejecutar la aplicación Spring Boot.
5. Una vez iniciada la aplicación, utilizar Swagger para consultar y probar los endpoints REST disponibles.

## Equipo

**Grupo D - C2 - 2026 - UNLa**

Trabajo Práctico — Sistema de alquiler de vehículos **Rentar**.