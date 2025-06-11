package com.senai.api.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.senai.api.dto.ReservaDto;
import com.senai.api.models.Reserva;

@Repository
public interface ReservaRepository extends JpaRepository<Reserva, Integer> {

	List<Reserva> findByAcomodacaoId(Integer acomodacaoId);

	List<ReservaDto> findAllByAcomodacaoId(Integer acomodacaoId);

}