package com.grupo_d_c2_2026_unla.rentar.dto;

import com.grupo_d_c2_2026_unla.rentar.enums.EstadoReserva;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Getter
@Setter
public class ReservaResponseDTO {

    private Long id;
    private Long idCliente;
    private Integer idVehiculo;
    private Long idTiempo;
    private LocalDateTime horaInicio;
    private LocalDateTime horaFin;
    private Integer duracionDias;
    private BigDecimal precioDiarioHistorico;
    private BigDecimal importeTotal;
    private EstadoReserva estadoReserva;

    public ReservaResponseDTO() {
    }

    public ReservaResponseDTO(
            Long id,
            Long idCliente,
            Integer idVehiculo,
            Long idTiempo,
            LocalDateTime horaInicio,
            LocalDateTime horaFin,
            Integer duracionDias,
            BigDecimal precioDiarioHistorico,
            BigDecimal importeTotal,
            EstadoReserva estadoReserva) {
        this.id = id;
        this.idCliente = idCliente;
        this.idVehiculo = idVehiculo;
        this.idTiempo = idTiempo;
        this.horaInicio = horaInicio;
        this.horaFin = horaFin;
        this.duracionDias = duracionDias;
        this.precioDiarioHistorico = precioDiarioHistorico;
        this.importeTotal = importeTotal;
        this.estadoReserva = estadoReserva;
    }

    @Override
    public String toString() {
        return "ReservaResponseDTO{" +
                "id=" + id +
                ", idCliente=" + idCliente +
                ", idVehiculo=" + idVehiculo +
                ", idTiempo=" + idTiempo +
                ", horaInicio=" + horaInicio +
                ", horaFin=" + horaFin +
                ", duracionDias=" + duracionDias +
                ", precioDiarioHistorico=" + precioDiarioHistorico +
                ", importeTotal=" + importeTotal +
                ", estadoReserva='" + estadoReserva + '\'' +
                '}';
    }
}