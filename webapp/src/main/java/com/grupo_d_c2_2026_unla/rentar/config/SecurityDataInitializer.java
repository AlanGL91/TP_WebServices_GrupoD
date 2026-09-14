package com.grupo_d_c2_2026_unla.rentar.config;

import com.grupo_d_c2_2026_unla.rentar.entity.Rol;
import com.grupo_d_c2_2026_unla.rentar.entity.Usuario;
import com.grupo_d_c2_2026_unla.rentar.repository.RolRepository;
import com.grupo_d_c2_2026_unla.rentar.repository.UsuarioRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration
@RequiredArgsConstructor
public class SecurityDataInitializer {

    private final UsuarioRepository usuarioRepository;
    private final RolRepository rolRepository;
    private final PasswordEncoder passwordEncoder;

    @Bean
    public CommandLineRunner initSecurityUsers() {
        return args -> {
            // 1. Asegurar la existencia de roles ADMIN y CLIENTE
            Rol rolAdmin = rolRepository.findByNombre("ADMIN")
                    .orElseGet(() -> rolRepository.save(new Rol(null, "ADMIN", "Administrador con acceso total")));

            Rol rolCliente = rolRepository.findByNombre("CLIENTE")
                    .orElseGet(() -> rolRepository.save(new Rol(null, "CLIENTE", "Cliente con acceso a consultas y reservas")));

            // 2. Crear usuario Administrador inicial si no existe
            if (usuarioRepository.findByEmail("admin@rentar.com").isEmpty()) {
                Usuario admin = new Usuario();
                admin.setEmail("admin@rentar.com");
                admin.setPassword(passwordEncoder.encode("Admin123*"));
                admin.setRol(rolAdmin);
                admin.setActivo(true);
                usuarioRepository.save(admin);
                System.out.println(">>> Usuario ADMIN creado: admin@rentar.com / Admin123*");
            }

            // 3. Crear usuario Cliente de prueba inicial si no existe
            if (usuarioRepository.findByEmail("cliente@rentar.com").isEmpty()) {
                Usuario cliente = new Usuario();
                cliente.setEmail("cliente@rentar.com");
                cliente.setPassword(passwordEncoder.encode("Cliente123*"));
                cliente.setRol(rolCliente);
                cliente.setActivo(true);
                usuarioRepository.save(cliente);
                System.out.println(">>> Usuario CLIENTE creado: cliente@rentar.com / Cliente123*");
            }
        };
    }
}
