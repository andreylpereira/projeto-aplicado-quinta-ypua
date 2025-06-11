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

import com.senai.api.dto.ReservaDto;
import com.senai.api.services.ReservaService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;

@RestController
@RequestMapping("/api/hospedagem")
@Tag(name = "Reserva", description = "Operações para gerenciar as reservas")
public class ReservaController {

	@Autowired
	private ReservaService reservaService;

	@PostMapping("/reservas")
	@Operation(summary = "Cadastra reserva", description = "Com um objeto reserva no corpo da requisição, efetua cadastro da reserva no banco de dados.")
	@ApiResponse(responseCode = "201", description = "Reserva criada com sucesso.", content = @Content(mediaType = "application/json"))
	@ApiResponse(responseCode = "409", description = "O período solicitado de reserva está ocupado.", content = @Content(mediaType = "application/json"))
	@ApiResponse(responseCode = "400", description = "Os dados da reserva estão incompletos/inválidos.", content = @Content(mediaType = "application/json"))
	@ApiResponse(responseCode = "404", description = "Dados obrigatórios não fornecidos.", content = @Content(mediaType = "application/json"))
	@ApiResponse(responseCode = "404", description = "Usuário criador não encontrado.", content = @Content(mediaType = "application/json"))
	@ApiResponse(responseCode = "404", description = "Cliente não encontrado.", content = @Content(mediaType = "application/json"))
	@ApiResponse(responseCode = "404", description = "Acomodação não encontrada.", content = @Content(mediaType = "application/json"))
	public ResponseEntity<?> insertReserva(@RequestBody ReservaDto reservaDto) {
		return reservaService.cadastrar(reservaDto);
	}

	@PutMapping("/reservas/{reservaId}")
	@Operation(summary = "Atualiza dados da reserva", description = "Com reservaId como parâmetro e um objeto reserva no corpo da requisição, atualiza a reserva que possui o valor do id do parametro.")
	@ApiResponse(responseCode = "200", description = "Dados da reserva foram atualizados com sucesso.", content = @Content(mediaType = "application/json"))
	@ApiResponse(responseCode = "409", description = "O período solicitado de reserva está ocupado.", content = @Content(mediaType = "application/json"))
	@ApiResponse(responseCode = "400", description = "Os dados da reserva estão incompletos/inválidos.", content = @Content(mediaType = "application/json"))
	@ApiResponse(responseCode = "404", description = "Dados obrigatórios não fornecidos.", content = @Content(mediaType = "application/json"))
	@ApiResponse(responseCode = "404", description = "Reserva não encontrada.", content = @Content(mediaType = "application/json"))
	@ApiResponse(responseCode = "404", description = "Usuário criador não encontrado.", content = @Content(mediaType = "application/json"))
	@ApiResponse(responseCode = "404", description = "Cliente não encontrado.", content = @Content(mediaType = "application/json"))
	@ApiResponse(responseCode = "404", description = "Acomodação não encontrada.", content = @Content(mediaType = "application/json"))
	public ResponseEntity<?> updateReserva(@RequestBody ReservaDto reservaDto, @PathVariable Integer reservaId) {
		return reservaService.editar(reservaDto, reservaId);
	}

	@GetMapping("/reservas")
	@Operation(summary = "Retorna uma lista de reservas", description = "Recupera uma lista de reservas e seus respectivos dados do banco de dados.")
	@ApiResponse(responseCode = "200", description = "A recuperação da lista de reservas e seus dados foi realizada com sucesso.")
	@ApiResponse(responseCode = "400", description = "Não foi possível recuperar a lista de reservas.", content = @Content(mediaType = "application/json"))
	public List<ReservaDto> findReservas() {
		return reservaService.listarReservas();
	}

	@GetMapping("/reservas/{reservaId}")
	@Operation(summary = "Procura uma reserva pelo ID", description = "Com reservaId como parâmetro, recupera um objeto contendo dados da reserva no banco de dados.")
	@ApiResponse(responseCode = "200", description = "A recuperação de dados da reserva realizada com sucesso.")
	@ApiResponse(responseCode = "400", description = "Não foi possível recuperar dados da reserva.", content = @Content(mediaType = "application/json"))
	public ReservaDto findReserva(@PathVariable Integer reservaId) {
		return reservaService.reservaById(reservaId);
	}

}
