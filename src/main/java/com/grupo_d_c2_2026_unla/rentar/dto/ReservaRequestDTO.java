package com.grupo_d_c2_2026_unla.rentar.dto;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Getter
@Setter
public class ReservaRequestDTO {

    @NotNull
    private Long idCliente;

    @NotNull
    private Integer idVehiculo;

    @NotNull
    private LocalDateTime horaInicio;

    @NotNull
    private LocalDateTime horaFin;

    public ReservaRequestDTO() {
    }

    public ReservaRequestDTO(Long idCliente, Integer idVehiculo, LocalDateTime horaInicio, LocalDateTime horaFin) {
        this.idCliente = idCliente;
        this.idVehiculo = idVehiculo;
        this.horaInicio = horaInicio;
        this.horaFin = horaFin;
    }
}