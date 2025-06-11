package com.senai.api.services.impl;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;

import org.springframework.stereotype.Service;

import com.senai.api.dto.AgendaDto;
import com.senai.api.dto.AgendaMensalDto;
import com.senai.api.dto.ReservaDto;
import com.senai.api.enums.Status;
import com.senai.api.models.Acomodacao;
import com.senai.api.models.Cliente;
import com.senai.api.models.Usuario;
import com.senai.api.repository.AcomodacaoRepository;
import com.senai.api.repository.ClienteRepository;
import com.senai.api.repository.UsuarioRepository;
import com.senai.api.services.AgendaService;
import com.senai.api.services.ReservaService;

@Service
public class AgendaServiceImpl implements AgendaService {

	private ClienteRepository clienteRepository;
	private ReservaService reservaService;
	private AcomodacaoRepository acomodacaoRepository;
	private UsuarioRepository usuarioRepository;

	public AgendaServiceImpl(ClienteRepository clienteRepository, ReservaService reservaService,
			AcomodacaoRepository acomodacaoRepository, UsuarioRepository usuarioRepository) {
		this.clienteRepository = clienteRepository;
		this.reservaService = reservaService;
		this.acomodacaoRepository = acomodacaoRepository;
		this.usuarioRepository = usuarioRepository;
	}

	
	/*
	* Com base nos dados de entrada (acomodação e o mês), monta um calendario informando em cada dia
	*  se está ocupado ou não a acomodação e a ID da reserva(caso estiver ocupado).
	*  Agenda utilizada para apresentar dias ocupados daquele mês, naquela acomodação no input Calendar.
	*/
	public List<AgendaDto> gerarCalendarioMensal(LocalDateTime mes, Integer acomodacaoId) {
	    List<AgendaDto> agenda = new ArrayList<>();
	    Map<LocalDate, Boolean> disponibilidade = new HashMap<>();
	    Map<LocalDate, Integer> reservaPorDia = new HashMap<>();

	    List<ReservaDto> reservas = reservaService.listarReservas();

	    LocalDate primeiroDiaDoMesAtual = mes.toLocalDate().withDayOfMonth(1);
	    LocalDate ultimoDiaDoMesAtual = mes.toLocalDate().withDayOfMonth(mes.toLocalDate().lengthOfMonth());
	    LocalDate primeiroDiaDoMesAnterior = primeiroDiaDoMesAtual.minusMonths(1);
	    @SuppressWarnings("unused")
	    LocalDate ultimoDiaDoMesAnterior = primeiroDiaDoMesAtual.minusDays(1);

	    LocalDate dataInicial = primeiroDiaDoMesAnterior;
	    LocalDate dataFinal = ultimoDiaDoMesAtual;
	    for (LocalDate data = dataInicial; !data.isAfter(dataFinal); data = data.plusDays(1)) {
	        disponibilidade.put(data, false);
	    }

	    for (ReservaDto reserva : reservas) {
	        if (!reserva.getAcomodacaoId().equals(acomodacaoId)) {
	            continue;
	        }

	        LocalDateTime entrada = reserva.getDataInicio();
	        LocalDateTime saida = reserva.getDataFim();

	        LocalDate entradaDia = entrada.toLocalDate();
	        LocalDate saidaDia = saida.toLocalDate();

	        if (saidaDia.isAfter(ultimoDiaDoMesAtual)) {
	            saidaDia = ultimoDiaDoMesAtual;
	        }

	        if (entradaDia.isBefore(primeiroDiaDoMesAtual)) {
	            entradaDia = primeiroDiaDoMesAtual;
	        }

	        boolean isReservaAtiva = (reserva.getStatus() != Status.CONCLUIDO && reserva.getStatus() != Status.CANCELADO);

	        for (LocalDate data = entradaDia; !data.isAfter(saidaDia); data = data.plusDays(1)) {
	            if (!data.isBefore(primeiroDiaDoMesAnterior) && !data.isAfter(ultimoDiaDoMesAtual)) {

	                disponibilidade.put(data, isReservaAtiva);
	                if (isReservaAtiva) {
	                    reservaPorDia.put(data, reserva.getId());
	                } else {
	                    reservaPorDia.put(data, null);
	                }
	            }
	        }
	    }

	    for (LocalDate data = primeiroDiaDoMesAtual; !data.isAfter(ultimoDiaDoMesAtual); data = data.plusDays(1)) {
	        boolean ocupado = disponibilidade.getOrDefault(data, false);
	        Integer reservaId = ocupado ? reservaPorDia.get(data) : null;
	        LocalDateTime dataCompleta = data.atStartOfDay();
	        agenda.add(new AgendaDto(dataCompleta, ocupado, reservaId));
	    }
	    return agenda;
	}


	
	
	/*
	 * Gera a agenda mensal de cada acomodação. 
	 */
	public List<AgendaMensalDto> gerarAgendaMensal(LocalDateTime mes, Integer acomodacaoId) {
	    List<AgendaMensalDto> agenda = new ArrayList<>();
	    Set<Integer> reservasAdicionadas = new HashSet<>();

	    LocalDate primeiroDiaDoMesAtual = mes.toLocalDate().withDayOfMonth(1);
	    LocalDate ultimoDiaDoMesAtual = mes.toLocalDate().withDayOfMonth(mes.toLocalDate().lengthOfMonth());

	    List<ReservaDto> reservas = reservaService.listarReservas();

	    for (ReservaDto reserva : reservas) {
	
	        if (!reserva.getAcomodacaoId().equals(acomodacaoId)) {
	            continue;
	        }

	        LocalDateTime dataInicio = reserva.getDataInicio();
	        LocalDateTime dataFim = reserva.getDataFim();

	        if (dataInicio.getYear() == mes.getYear() && dataInicio.getMonth() == mes.getMonth()) {
	            LocalDate dataInicioDia = dataInicio.toLocalDate();
	            LocalDate dataFimDia = dataFim.toLocalDate();

	            if (dataInicioDia.isBefore(primeiroDiaDoMesAtual)) {
	                dataInicioDia = primeiroDiaDoMesAtual;
	            }

	            if (dataFimDia.isAfter(ultimoDiaDoMesAtual)) {
	                dataFimDia = ultimoDiaDoMesAtual;
	            }

	            for (LocalDate data = dataInicioDia; !data.isAfter(dataFimDia); data = data.plusDays(1)) {
	              
	                if (reservasAdicionadas.contains(reserva.getId())) {
	                    continue;
	                }

	                Cliente cliente = clienteRepository.findById(reserva.getClienteId()).orElse(null);
	                Usuario funcionario = usuarioRepository.findById(reserva.getFuncionarioId()).orElse(null);
	                Acomodacao acomodacao = acomodacaoRepository.findById(reserva.getAcomodacaoId()).orElse(null);

	                AgendaMensalDto agendaDto = new AgendaMensalDto(
	                	    reserva.getId(), 
	                	    cliente != null ? cliente.getNome() : "Cliente não encontrado", 
	                	    cliente != null ? cliente.getEmail() : "Não informado", 
	                	    cliente != null ? cliente.getTelefone() : "Não informado", 
	                	    funcionario != null ? funcionario.getNome() : "Funcionário não encontrado", 
	                	    acomodacao != null ? acomodacao.getNome() : "Acomodação não encontrada", 
	                	    reserva.getStatus() != null ? reserva.getStatus().toString() : "Status não informado",
	                	    acomodacao != null ? acomodacao.getId() : null,  
	                	    dataInicio, 
	                	    dataFim,
	                	    reserva.getValorTotal()
	                	);


	                reservasAdicionadas.add(reserva.getId());

	                agenda.add(agendaDto);
	            }
	        }
	    }

	    return agenda;
	}

	/*
	 * Gera a agenda diaria para apresentar no painel de tempo real
	 * */
	public List<AgendaMensalDto> gerarAgendaTempoReal(LocalDateTime dia) { 
	    List<AgendaMensalDto> agenda = new ArrayList<>(); 
	    Set<Integer> reservasAdicionadas = new HashSet<>();  
	    LocalDate primeiroDiaDoMesAtual = dia.toLocalDate().withDayOfMonth(1); 
	    LocalDate ultimoDiaDoMesAtual = dia.toLocalDate().withDayOfMonth(dia.toLocalDate().lengthOfMonth());  
	    List<ReservaDto> reservas = reservaService.listarReservas();  

	    for (ReservaDto reserva : reservas) { 
	        LocalDateTime dataInicio = reserva.getDataInicio(); 
	        LocalDateTime dataFim = reserva.getDataFim();  
	        
	        if (dataInicio.getYear() == dia.getYear() && dataInicio.getMonth() == dia.getMonth()) {  
	            LocalDate dataInicioDia = dataInicio.toLocalDate(); 
	            LocalDate dataFimDia = dataFim.toLocalDate();  

	            if (dataInicioDia.isBefore(primeiroDiaDoMesAtual)) { 
	                dataInicioDia = primeiroDiaDoMesAtual; 
	            }  
	            if (dataFimDia.isAfter(ultimoDiaDoMesAtual)) { 
	                dataFimDia = ultimoDiaDoMesAtual; 
	            }  

	            if ((dia.toLocalDate().isEqual(dataInicio.toLocalDate()) || dia.toLocalDate().isEqual(dataFim.toLocalDate())) || 
	            	    (dia.toLocalDate().isAfter(dataInicio.toLocalDate()) && dia.toLocalDate().isBefore(dataFim.toLocalDate()))) {
	                
	                if (reservasAdicionadas.contains(reserva.getId())) { 
	                    continue; 
	                }

	                Cliente cliente = clienteRepository.findById(reserva.getClienteId()).orElse(null); 
	                Usuario funcionario = usuarioRepository.findById(reserva.getFuncionarioId()).orElse(null); 
	                Acomodacao acomodacao = acomodacaoRepository.findById(reserva.getAcomodacaoId()).orElse(null); 

	             
	                if (acomodacao != null) {
	             
	                    AgendaMensalDto agendaDto = new AgendaMensalDto(
	                        reserva.getId(), 
	                        cliente != null ? cliente.getNome() : "Cliente não encontrado", 
	                        cliente != null ? cliente.getEmail() : "Não informado", 
	                        cliente != null ? cliente.getTelefone() : "Não informado", 
	                        funcionario != null ? funcionario.getNome() : "Funcionário não encontrado", 
	                        acomodacao != null ? acomodacao.getNome() : "Acomodação não encontrada", 
	                        reserva.getStatus() != null ? reserva.getStatus().toString() : "Status não informado",
	                        acomodacao != null ? acomodacao.getId() : null,  
	                        dataInicio, 
	                        dataFim,
	                        reserva.getValorTotal()
	                    ); 

	                    reservasAdicionadas.add(reserva.getId()); 
	                    agenda.add(agendaDto); 
	                }
	            }
	        } 
	    } 
	    return agenda; 
	}



}