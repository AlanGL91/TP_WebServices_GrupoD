package com.grupo_d_c2_2026_unla.rentar.security;

import com.grupo_d_c2_2026_unla.rentar.entity.Usuario;
import com.grupo_d_c2_2026_unla.rentar.repository.UsuarioRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Collections;

@Service
@RequiredArgsConstructor
public class CustomUserDetailsService implements UserDetailsService {

    private final UsuarioRepository usuarioRepository;

    @Override
    @Transactional(readOnly = true)
    public UserDetails loadUserByUsername(String emailOrUsername) throws UsernameNotFoundException {
        // En este proyecto, el usuario ingresa con su email
        Usuario usuario = usuarioRepository.findByEmail(emailOrUsername)
                .orElseThrow(() -> new UsernameNotFoundException("Usuario no encontrado con email: " + emailOrUsername));

        if (!usuario.isActivo()) {
            throw new UsernameNotFoundException("La cuenta de usuario se encuentra inactiva");
        }

        // Obtener el nombre del rol (ejemplo: "ADMIN" o "CLIENTE") y anteponer "ROLE_"
        String rolName = usuario.getRol() != null ? usuario.getRol().getNombre() : "CLIENTE";
        if (!rolName.startsWith("ROLE_")) {
            rolName = "ROLE_" + rolName;
        }

        return new User(
                usuario.getEmail(),
                usuario.getPassword(),
                usuario.isActivo(),
                true, // accountNonExpired
                true, // credentialsNonExpired
                true, // accountNonLocked
                Collections.singletonList(new SimpleGrantedAuthority(rolName))
        );
    }
}
