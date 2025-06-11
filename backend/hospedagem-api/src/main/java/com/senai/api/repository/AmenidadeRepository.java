package com.senai.api.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.senai.api.models.Amenidade;

@Repository
public interface AmenidadeRepository extends JpaRepository<Amenidade, Integer> {

	public Boolean existsByNome(String nome);

	public Amenidade getReferenceById(Amenidade amenidade_id);

	public Optional<Amenidade> getAmenidadeById(Amenidade amenidadeId);

	public Optional<Amenidade> findById(Amenidade amenidadeId);
}