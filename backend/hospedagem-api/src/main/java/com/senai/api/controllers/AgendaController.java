package com.senai.api.controllers;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.senai.api.dto.AgendaDto;
import com.senai.api.dto.AgendaMensalDto;
import com.senai.api.services.AgendaService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;

@RestController
@RequestMapping("/api/hospedagem")
@Tag(name = "Agenda", description = "Operações para gerenciar agenda e calendários")
public class AgendaController {

	@Autowired
	private AgendaService agendaService;

	@GetMapping("/agenda/datas/{acomodacaoId}/{mes}")
	@Operation(summary = "Gera calendário do mês com a disponibilidade da acomodação em cada dia", description = "Com os parâmetros mês e o id da acomodação, gerá um calendário do mês, informando cada dia do mês e um boolean para identificar se o dia a acomodação está ocupada ou não.")
	@ApiResponse(responseCode = "200", description = "O calendário mensal foi gerado com sucesso.")
	@ApiResponse(responseCode = "400", description = "Não foi possível gerar o calendário mensal.", content = @Content(mediaType = "application/json"))
	public List<AgendaDto> recuperarReservas(@PathVariable LocalDateTime mes, @PathVariable Integer acomodacaoId) {
		return agendaService.gerarCalendarioMensal(mes, acomodacaoId);
	}

	@GetMapping("/agenda/{acomodacaoId}/{mes}")
	@Operation(summary = "Recupera uma lista de agendamentos efetuados no mês de acordo com a acomodação", description = "Com os parâmetros mês e o id da acomodação, gerá um calendário do mês, informando cada dia do mês e um boolean para identificar se o dia a acomodação está ocupada ou não.")
	@ApiResponse(responseCode = "200", description = "Lista mensal de agendamento para acomodação foi gerado com sucesso.")
	@ApiResponse(responseCode = "400", description = "Não foi possível gerar o calendário mensal da acomodação.", content = @Content(mediaType = "application/json"))
	public List<AgendaMensalDto> obterAgendaMensal(@PathVariable LocalDateTime mes,
			@PathVariable Integer acomodacaoId) {
		return agendaService.gerarAgendaMensal(mes, acomodacaoId);
	}

	@GetMapping("/agenda/{dia}")
	@Operation(summary = "Gera uma agenda do dia atual com a disponibilidade de cada acomodação", description = "Com a data do dia como parâmetro, gera uma lista com todas as acomodações, identificando a disponibilidade ou não da acomodação.")
	@ApiResponse(responseCode = "200", description = "A agenda foi gerada com sucesso.")
	@ApiResponse(responseCode = "400", description = "Não foi possível gerar a agenda.", content = @Content(mediaType = "application/json"))
	public List<AgendaMensalDto> obterAgendaTempoReal(@PathVariable LocalDateTime dia) {
		return agendaService.gerarAgendaTempoReal(dia);
	}
}
