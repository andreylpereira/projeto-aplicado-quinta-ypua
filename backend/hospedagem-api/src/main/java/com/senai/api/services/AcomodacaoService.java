package com.senai.api.services;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import com.senai.api.dto.AcomodacaoDto;
import com.senai.api.models.Acomodacao;

@Service
public interface AcomodacaoService {

	ResponseEntity<?> editar(AcomodacaoDto acomodacaoDto, Integer usuarioId, Integer acomodacaoId);

	ResponseEntity<?> cadastrar(AcomodacaoDto acomodacaoDto, Integer usuarioId);

	ResponseEntity<?> habilitadoDesabilitado(Integer acomodacaoId, boolean habilitado);

	ResponseEntity<Acomodacao> recuperarAcomodacao(Integer acomodacaoId);

	ResponseEntity<List<Acomodacao>> recuperarAcomodacoes();

}
