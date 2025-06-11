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

import com.senai.api.dto.AmenidadeDto;
import com.senai.api.models.Amenidade;
import com.senai.api.repository.AmenidadeRepository;
import com.senai.api.services.AmenidadeService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;

@RestController
@RequestMapping("/api/hospedagem")
@Tag(name = "Amenidade", description = "Operações para gerenciar as amenidades")
public class AmenidadeController {

	@Autowired
	private AmenidadeService amenidadeService;


	@PostMapping("{usuarioId}/amenidades")
	@Operation(summary = "Cadastra amenidade", description = "Com usuarioId como parâmetro e um objeto amenidade no corpo da requisição, efetua cadastro da amenidade no banco de dados.")
	@ApiResponse(responseCode = "200", description = "Amenidade criada com sucesso.",
		    content = @Content(mediaType = "application/json"))
	@ApiResponse(responseCode = "400", description = "Os dados da amenidade estão inválidos.",
		    content = @Content(mediaType = "application/json"))
	@ApiResponse(responseCode = "409", description = "Amenidade deve ter um nome válido.",
    content = @Content(mediaType = "application/json"))
	public ResponseEntity<?> insertAmenidade(@RequestBody AmenidadeDto amenidadeDto, @PathVariable Integer usuarioId) {
		return amenidadeService.cadastrar(amenidadeDto, usuarioId);
	}

	@PutMapping("{usuarioId}/amenidades/{amenidadeId}")
	@Operation(summary = "Atualiza dados da amenidade", description = "Com usuarioId e amenidadeId como parâmetros e um objeto amenidade no corpo da requisição, atualiza o usuário que possui o valor do id do parâmetro.")
	@ApiResponse(responseCode = "201", description = "Dados da amenidade foram atualizados com sucesso.",
		    content = @Content(mediaType = "application/json"))
	@ApiResponse(responseCode = "404", description = "Amenidade não encontrada.",
		    content = @Content(mediaType = "application/json"))
	@ApiResponse(responseCode = "409", description = "Amenidade deve ter um nome válido.",
    content = @Content(mediaType = "application/json"))
	public ResponseEntity<?> updateAmenidades(@RequestBody AmenidadeDto amenidadeDto, @PathVariable Integer usuarioId,
			@PathVariable Integer amenidadeId) {
		return amenidadeService.editar(amenidadeDto, usuarioId, amenidadeId);
	}

	@GetMapping("/amenidades")
	@Operation(summary = "Retorna uma lista de amenidades", description = "Recupera uma lista de amenidades e seus respectivos dados do banco de dados.")
	@ApiResponse(responseCode = "200", description = "A recuperação da lista de amenidades e seus dados foi realizada com sucesso.")
	@ApiResponse(responseCode = "400", description = "Não foi possível recuperar a lista de amenidades.",
		    content = @Content(mediaType = "application/json"))
	public ResponseEntity<List<Amenidade>> findAmenidades() {
		return amenidadeService.recuperarAmenidades();
	}

	@GetMapping("/amenidades/{amenidadeId}")
	@Operation(summary = "Procura um amenidade pelo ID", description = "Com amenidadeId como parâmetro, recupera um objeto contendo dados da amenidade no banco de dados.")
	@ApiResponse(responseCode = "200", description = "A recuperação de dados da amenidade realizada com sucesso.")
	@ApiResponse(responseCode = "400", description = "Não foi possível recuperar dados da amenidade.",
		    content = @Content(mediaType = "application/json"))
	public ResponseEntity<Amenidade> findAmenidade(@PathVariable Integer amenidadeId) {
		return amenidadeService.recuperarAmenidade(amenidadeId);
	}

}
