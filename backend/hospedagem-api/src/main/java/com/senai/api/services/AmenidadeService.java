package com.senai.api.services;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import com.senai.api.dto.AmenidadeDto;
import com.senai.api.models.Amenidade;

@Service
public interface AmenidadeService {

	ResponseEntity<?> cadastrar(AmenidadeDto amenidadeDto, Integer usuarioId);

	ResponseEntity<?> editar(AmenidadeDto amenidadeDto, Integer usuarioId, Integer amenidadeId);

	ResponseEntity<List<Amenidade>> recuperarAmenidades();

	ResponseEntity<Amenidade> recuperarAmenidade(Integer amenidadeId);

}
