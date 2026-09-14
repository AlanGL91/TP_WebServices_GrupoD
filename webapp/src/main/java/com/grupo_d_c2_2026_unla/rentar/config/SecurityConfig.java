package com.grupo_d_c2_2026_unla.rentar.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            // Deshabilitar CSRF para permitir pruebas sencillas con clientes REST (Postman/Curl) o habilitarlo si se usa form puro
            .csrf(csrf -> csrf.disable())
            .authorizeHttpRequests(auth -> auth
                // Acceso libre a Swagger y OpenAPI docs
                .requestMatchers(
                    "/v3/api-docs/**",
                    "/swagger-ui/**",
                    "/swagger-ui.html"
                ).permitAll()

                // VEHÍCULOS:
                // CLIENTE y ADMIN pueden consultar/ver vehículos
                .requestMatchers(HttpMethod.GET, "/api/vehiculos/**").hasAnyRole("CLIENTE", "ADMIN")
                // Solo ADMIN puede crear, modificar o eliminar vehículos (ABM)
                .requestMatchers(HttpMethod.POST, "/api/vehiculos/**").hasRole("ADMIN")
                .requestMatchers(HttpMethod.PUT, "/api/vehiculos/**").hasRole("ADMIN")
                .requestMatchers(HttpMethod.DELETE, "/api/vehiculos/**").hasRole("ADMIN")

                // CLIENTES:
                // Solo ADMIN puede hacer ABM de Clientes
                .requestMatchers("/api/clientes/**").hasRole("ADMIN")

                // RESERVAS:
                // Tanto CLIENTE como ADMIN pueden gestionar reservas
                .requestMatchers("/api/reservas/**").hasAnyRole("CLIENTE", "ADMIN")

                // Cualquier otra solicitud requiere autenticación
                .anyRequest().authenticated()
            )
            // Pantalla de login predeterminada de Spring Security con sesión basada en Cookies
            .formLogin(Customizer.withDefaults())
            // Soporte para autenticación HTTP Basic (útil para pruebas en Postman o herramientas REST)
            .httpBasic(Customizer.withDefaults())
            // Cierre de sesión
            .logout(logout -> logout
                .logoutUrl("/logout")
                .logoutSuccessUrl("/login?logout")
                .invalidateHttpSession(true)
                .deleteCookies("JSESSIONID")
                .permitAll()
            );

        return http.build();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
        return config.getAuthenticationManager();
    }
}
