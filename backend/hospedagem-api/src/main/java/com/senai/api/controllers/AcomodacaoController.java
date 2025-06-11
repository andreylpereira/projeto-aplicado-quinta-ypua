package com.senai.api.controllers;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.senai.api.dto.AcomodacaoDto;
import com.senai.api.models.Acomodacao;
import com.senai.api.repository.AcomodacaoRepository;
import com.senai.api.services.AcomodacaoService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;

@RestController
@RequestMapping("/api/hospedagem")
@Tag(name = "Acomodação", description = "Operações para gerenciar acomodações")
public class AcomodacaoController {

	@Autowired
	private AcomodacaoService acomodacaoService;


	@PostMapping("{usuarioId}/acomodacoes")
	@Operation(summary = "Cadastra acomodação", description = "Com usuarioId como parâmetro e um objeto acomodação no corpo da requisição, efetua cadastro da acomodação no banco de dados.")
	@ApiResponse(responseCode = "200", description = "Acomodação criada com sucesso.",
		    content = @Content(mediaType = "application/json"))
	@ApiResponse(responseCode = "400", description = "Os dados da acomodação estão incompletos.",
		    content = @Content(mediaType = "application/json"))
	public ResponseEntity<?> insertAcomodacao(@RequestBody AcomodacaoDto acomodacaoDto,
			@PathVariable Integer usuarioId) {
		return acomodacaoService.cadastrar(acomodacaoDto, usuarioId);
	}

	@PutMapping("{usuarioId}/acomodacoes/{acomodacaoId}")
	@Operation(summary = "Atualiza dados de acomodação", description = "Com usuarioId e acomodacaoId como parâmetros e um objeto acomodação no corpo da requisição, atualiza o usuário que possui o valor do id do parâmetro.")
	@ApiResponse(responseCode = "200", description = "Dados da acomodação foram atualizados com sucesso.",
		    content = @Content(mediaType = "application/json"))
	@ApiResponse(responseCode = "404", description = "Os dados das amenidades estão inválidos.",
		    content = @Content(mediaType = "application/json"))
	@ApiResponse(responseCode = "404", description = "Os dados da acomodação está incompletos.",
    content = @Content(mediaType = "application/json"))
	public ResponseEntity<?> updateAcomodacao(@RequestBody AcomodacaoDto acomodacaoDto, @PathVariable Integer usuarioId,
			@PathVariable Integer acomodacaoId) {
		return acomodacaoService.editar(acomodacaoDto, usuarioId, acomodacaoId);
	}

	@GetMapping("/acomodacoes")
	@Operation(summary = "Retorna uma lista de acomodações", description = "Recupera uma lista de acomodações e seus respectivos dados do banco de dados.")
	@ApiResponse(responseCode = "200", description = "A recuperação da lista de acomodações e seus dados foi realizada com sucesso.")
	@ApiResponse(responseCode = "400", description = "Não foi possível recuperar a lista de acomodações.",
		    content = @Content(mediaType = "application/json"))
	public ResponseEntity<List<Acomodacao>> findAcomodacoes() {
		return acomodacaoService.recuperarAcomodacoes();
	}

	@GetMapping("/acomodacoes/{acomodacaoId}")
	@Operation(summary = "Procura uma acomodação pelo ID", description = "Com acomodacaoId como parâmetro, recupera um objeto contendo dados da acomodação no banco de dados.")
	@ApiResponse(responseCode = "200", description = "A recuperação de dados da acomodação realizada com sucesso.")
	@ApiResponse(responseCode = "400", description = "Não foi possível recuperar dados da acomodação.",
		    content = @Content(mediaType = "application/json"))
	public ResponseEntity<Acomodacao> findAcomodacao(@PathVariable Integer acomodacaoId) {
		return acomodacaoService.recuperarAcomodacao(acomodacaoId);

	}

	@PutMapping("/acomodacoes/{acomodacaoId}/{habilitado}")
	@Operation(summary = "Habilita ou desabilita uma acomodação", description = "Com acomodacaoId  e habilitado(boolean) como parâmetros, atualiza  no banco de dados o campo 'habilitado' da acomodação com o id definido no parâmetro.")
	@ApiResponse(responseCode = "200", description = "O campo habilitado da acomodação atualizado com sucesso.",
		    content = @Content(mediaType = "application/json"))
	@ApiResponse(responseCode = "404", description = "Acomodação com ID 'acomodacaoId' não encontrado.",
		    content = @Content(mediaType = "application/json"))
	public ResponseEntity<?> updateHabilitado(@PathVariable Integer acomodacaoId, @PathVariable boolean habilitado) {
		return acomodacaoService.habilitadoDesabilitado(acomodacaoId, habilitado);
	}

}
