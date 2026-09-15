package com.grupo_d_c2_2026_unla.rentar.repository;

import com.grupo_d_c2_2026_unla.rentar.entity.Reserva;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDateTime;

public interface ReservaRepository extends JpaRepository<Reserva, Long> {
    // Verifica si existe una reserva para un vehículo en un rango de tiempo específico
    boolean existsByVehiculo_IdAndHoraInicioLessThanAndHoraFinGreaterThan(
            Integer vehiculoId,
            LocalDateTime horaFin,
            LocalDateTime horaInicio
    );
}