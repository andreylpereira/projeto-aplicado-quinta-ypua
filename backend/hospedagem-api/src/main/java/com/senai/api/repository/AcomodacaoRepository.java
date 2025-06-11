package com.senai.api.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.senai.api.models.Acomodacao;

@Repository
public interface AcomodacaoRepository extends JpaRepository<Acomodacao, Integer> {

	Optional<Acomodacao> getAcomodacaoById(Integer acomodacao_id);

}