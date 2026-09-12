package com.grupo_d_c2_2026_unla.rentar.controller;

import com.grupo_d_c2_2026_unla.rentar.dto.ClienteRequestDTO;
import com.grupo_d_c2_2026_unla.rentar.dto.ClienteResponseDTO;
import com.grupo_d_c2_2026_unla.rentar.service.ClienteService;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/clientes")
public class ClienteController {

    private final ClienteService clienteService;

    public ClienteController(ClienteService clienteService) {

        this.clienteService = clienteService;
    }

    // ALTA
    @PostMapping
    public ResponseEntity<ClienteResponseDTO> crear(@RequestBody ClienteRequestDTO cliente) {
        // Reglas de negocio: email y documento únicos,
        // creación automática del usuario y activo=true
        // (esa lógica va en el Service, el controller solo orquesta)
        ClienteResponseDTO creado = clienteService.crear(cliente);
        return ResponseEntity.status(HttpStatus.CREATED).body(creado);
    }

    // LISTADO
    @GetMapping
    public ResponseEntity<List<ClienteResponseDTO>> listarTodos() {

        List<ClienteResponseDTO> clientes = clienteService.listarTodos();

        return ResponseEntity.ok(clientes);
    }

    // BUSCAR POR ID
    @GetMapping("/{id}")
    public ResponseEntity<ClienteResponseDTO> buscarPorId(
            @PathVariable("id") Long id) {

        ClienteResponseDTO cliente = clienteService.buscarPorId(id);

        return ResponseEntity.ok(cliente);
    }

    // MODIFICAR
    @PutMapping("/{id}")
    public ResponseEntity<ClienteResponseDTO> modificar(
            @PathVariable("id") Long id,
            @RequestBody ClienteRequestDTO cliente) {

        ClienteResponseDTO actualizado = clienteService.modificar(id, cliente);

        return ResponseEntity.ok(actualizado);
    }

    // BAJA LOGICA
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> bajaLogica(
            @PathVariable("id") Long id) {

        clienteService.bajaLogica(id);

        return ResponseEntity.noContent().build();
    }

}
