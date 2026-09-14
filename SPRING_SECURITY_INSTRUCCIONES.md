# Guía de Instalación y Uso de Spring Security en Mac (Spring Boot)

Esta guía explica paso a paso cómo correr el proyecto con la seguridad configurada en tu Mac local.

---

## 1. Agregar la dependencia en `pom.xml`

En tu archivo `pom.xml`, dentro de la etiqueta `<dependencies>`, agrega el starter de Spring Security:

```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-security</artifactId>
</dependency>
```

---

## 2. Archivos agregados al código fuente Java

Se crearon las clases necesarias en la estructura de paquetes de tu proyecto:

1. **`com.grupo_d_c2_2026_unla.rentar.config.SecurityConfig.java`**:
   - Habilita `@EnableWebSecurity`.
   - Activa el login por defecto de Spring: `.formLogin(Customizer.withDefaults())`.
   - Reglas de autorización por rol:
     - **Swagger**: `/v3/api-docs/**`, `/swagger-ui/**`, `/swagger-ui.html` libres (`permitAll()`).
     - **Vehículos**:
       - `GET /api/vehiculos/**` permitido para `ROLE_CLIENTE` y `ROLE_ADMIN`.
       - `POST /api/vehiculos/**`, `PUT`, `DELETE` restringido exclusivamente a `ROLE_ADMIN`.
     - **Clientes**:
       - `/api/clientes/**` (ABM completo) restringido exclusivamente a `ROLE_ADMIN`.
     - **Reservas**:
       - `/api/reservas/**` disponible para `ROLE_CLIENTE` y `ROLE_ADMIN`.
     - Cualquier otra ruta requiere estar autenticado.
   - Proveedor de cifrado: `BCryptPasswordEncoder`.

2. **`com.grupo_d_c2_2026_unla.rentar.security.CustomUserDetailsService.java`**:
   - Implementa `UserDetailsService`.
   - Busca el usuario en la base de datos MySQL por su email (`usuarioRepository.findByEmail`).
   - Mapea el rol (`ADMIN` -> `ROLE_ADMIN`, `CLIENTE` -> `ROLE_CLIENTE`).
   - Verifica que el usuario esté activo (`usuario.isActivo()`).

3. **`com.grupo_d_c2_2026_unla.rentar.config.SecurityDataInitializer.java`**:
   - Carga inicial automática al arrancar la app con credenciales de prueba listas para usar:
     - **ADMIN**: `admin@rentar.com` / `Admin123*`
     - **CLIENTE**: `cliente@rentar.com` / `Cliente123*`

---

## 3. Actualizar el servicio de creación de Clientes (Hashing de contraseña)

Al dar de alta un nuevo cliente desde tu servicio Java (`ClienteService.java`), recordá inyectar el `PasswordEncoder` para cifrar la contraseña antes de guardarla en la tabla `usuario`:

```java
@Autowired
private PasswordEncoder passwordEncoder;

// Al crear el Usuario asociado al Cliente:
usuario.setPassword(passwordEncoder.encode(passwordEnTextoPlano));
```

---

## 4. Cómo probarlo en tu Mac

1. Compila el proyecto en tu terminal:
   ```bash
   ./mvnw clean package -DskipTests
   ```
2. Ejecuta la aplicación:
   ```bash
   ./mvnw spring-boot:run
   ```
3. Abre tu navegador (Safari o Chrome) en:
   ```
   http://localhost:8080/api/vehiculos
   ```
4. **Spring Security te redirigirá automáticamente a la pantalla de Login predeterminada de Spring:**
   ```
   http://localhost:8080/login
   ```
5. Prueba iniciar sesión con:
   - **Como Administrador:**
     - Usuario: `admin@rentar.com`
     - Contraseña: `Admin123*`
     *(Te permitirá realizar operaciones POST/PUT/DELETE de vehículos y clientes)*
   - **Como Cliente:**
     - Usuario: `cliente@rentar.com`
     - Contraseña: `Cliente123*`
     *(Solo te permitirá consultar vehículos y gestionar reservas; si intentas hacer un POST a `/api/vehiculos` o acceder a `/api/clientes`, recibirás un error **403 Forbidden**)*
6. Para cerrar sesión, ingresa a:
   ```
   http://localhost:8080/logout
   ```
