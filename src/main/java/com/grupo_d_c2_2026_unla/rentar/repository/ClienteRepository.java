package com.grupo_d_c2_2026_unla.rentar.repository;

import com.grupo_d_c2_2026_unla.rentar.entity.Cliente;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.repository.CrudRepository;


public interface ClienteRepository extends JpaRepository<Cliente, Long> {

   public boolean existsByDocumento(String documento);
}
