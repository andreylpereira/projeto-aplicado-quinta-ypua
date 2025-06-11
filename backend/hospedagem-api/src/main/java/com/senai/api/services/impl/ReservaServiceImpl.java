package com.senai.api.services.impl;


import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.beans.BeanUtils;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import com.senai.api.dto.ReservaDto;
import com.senai.api.enums.Status;
import com.senai.api.models.Acomodacao;
import com.senai.api.models.Cliente;
import com.senai.api.models.Reserva;
import com.senai.api.models.Usuario;
import com.senai.api.repository.AcomodacaoRepository;
import com.senai.api.repository.ClienteRepository;
import com.senai.api.repository.UsuarioRepository;
import com.senai.api.services.ReservaService;
import com.senai.api.repository.ReservaRepository;

@Service
public class ReservaServiceImpl implements ReservaService {

	private final UsuarioRepository usuarioRepository;
	private final ClienteRepository clienteRepository;
	private final AcomodacaoRepository acomodacaoRepository;
	private final ReservaRepository reservaRepository;

	public ReservaServiceImpl(UsuarioRepository usuarioRepository, ClienteRepository clienteRepository,
			AcomodacaoRepository acomodacaoRepository, ReservaRepository reservaRepository) {
		this.usuarioRepository = usuarioRepository;
		this.clienteRepository = clienteRepository;
		this.acomodacaoRepository = acomodacaoRepository;
		this.reservaRepository = reservaRepository;
	}

	/*
	 * Valida os dados de entrada da reserva, depois se está disponivel para
	 * reserva. Caso passar pelas validações efetua a reserva.
	 */
	@Override
	public ResponseEntity<?> cadastrar(ReservaDto reservaDto) {

		ResponseEntity<?> validarDatas = validarDatas(reservaDto);
		if (validarDatas != null) {
			return validarDatas;
		}
		ResponseEntity<?> validarReserva = validarReserva(reservaDto);
		if (validarReserva != null) {
			return validarReserva;
		}

		Boolean isAvailable = verificarDisponibilidade(reservaDto.getAcomodacaoId(), reservaDto.getDataInicio(),
				reservaDto.getDataFim());
		if (!isAvailable) {
			return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("O período solicitado de reserva está ocupado.");
		}

		Usuario funcionario = fetchUsuario(reservaDto.getFuncionarioId());
		Cliente cliente = fetchCliente(reservaDto.getClienteId());
		Acomodacao acomodacao = fetchAcomodacao(reservaDto.getAcomodacaoId());

		if (funcionario == null) {
			return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Usuário criador não encontrado.");
		}
		if (cliente == null) {
			return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Cliente não encontrado.");
		}
		if (acomodacao == null) {
			return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Acomodação não encontrada.");
		}

		Reserva reserva = new Reserva();
		BeanUtils.copyProperties(reservaDto, reserva);
		reserva.setFuncionario(funcionario);
		reserva.setCliente(cliente);
		reserva.setAcomodacao(acomodacao);
		
		int totalDias = calcularDiferencaEmDias(reserva.getDataInicio(),reserva.getDataFim());
		double valorTotal = totalDias * acomodacao.getPreco();
		
		reserva.setValorTotal(valorTotal);
		reservaRepository.save(reserva);

		return ResponseEntity.status(HttpStatus.CREATED).body("Reserva efetuada com sucesso.");
	}

	/*
	 * Busca uma reserva do banco de dados e verifica se ela existe ou não. Também
	 * valida os dados do corpo da requisição. Faz também validações comparando o
	 * corpo da requisição com a reserva que foi buscada do banco, caso estiver OK,
	 * faz atualização/edição no banco.
	 */
	@Override
	public ResponseEntity<?> editar(ReservaDto reservaDto, Integer reservaId) {

		Optional<Reserva> reservaExistenteOpt = reservaRepository.findById(reservaId);
		if (reservaDto.getDataInicio() == null || reservaDto.getDataFim() == null) {
			return ResponseEntity.status(HttpStatus.CONFLICT)
					.body("O período de reserva não foi definido corretamente.");
		}

		if (reservaExistenteOpt.isEmpty()) {
			return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Reserva não encontrada.");
		}

		ResponseEntity<?> validarDatas = validarDatas(reservaDto);
		if (validarDatas != null) {
			return validarDatas;
		}
		ResponseEntity<?> validarReserva = validarReserva(reservaDto);
		if (validarReserva != null) {
			return validarReserva;
		}

		Boolean isAvailable = verificarDisponibilidade(reservaDto.getAcomodacaoId(), reservaDto.getDataInicio(),
				reservaDto.getDataFim(), reservaId);
		if (!isAvailable) {
			return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("O período solicitado de reserva está ocupado.");
		}

		Usuario funcionario = fetchUsuario(reservaDto.getFuncionarioId());
		Cliente cliente = fetchCliente(reservaDto.getClienteId());
		Acomodacao acomodacao = fetchAcomodacao(reservaDto.getAcomodacaoId());

		if (funcionario == null) {
			return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Usuário criador não encontrado.");
		}
		if (cliente == null) {
			return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Cliente não encontrado.");
		}
		if (acomodacao == null) {
			return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Acomodação não encontrada.");
		}

		Reserva reserva = reservaRepository.getReferenceById(reservaId);
		BeanUtils.copyProperties(reservaDto, reserva);
		reserva.setId(reservaId);
		reserva.setFuncionario(funcionario);
		reserva.setCliente(cliente);
		reserva.setAcomodacao(acomodacao);
		
		int totalDias = calcularDiferencaEmDias(reserva.getDataInicio(),reserva.getDataFim());
		double valorTotal = totalDias * acomodacao.getPreco();
		
		reserva.setValorTotal(valorTotal);
		reservaRepository.save(reserva);

		return ResponseEntity.status(HttpStatus.OK).body("Reserva atualizada com sucesso.");
	}

	// Localiza uma reserva pelo ID
	@Override
	public ReservaDto reservaById(Integer reservaId) {
		Reserva reserva = reservaRepository.findById(reservaId).orElseThrow();

		Integer responsavelId = reserva.getFuncionario() != null ? reserva.getFuncionario().getId() : null;
		Integer clienteId = reserva.getCliente() != null ? reserva.getCliente().getId() : null;
		Integer acomodacaoId = reserva.getAcomodacao() != null ? reserva.getAcomodacao().getId() : null;

		return new ReservaDto(reserva.getId(), responsavelId, clienteId, acomodacaoId, reserva.getDataInicio(),
				reserva.getDataFim(), reserva.getStatus(), reserva.getValorTotal());
	}

	// Lista todas as reservas
	@Override
	public List<ReservaDto> listarReservas() {
		List<Reserva> reservas = reservaRepository.findAll();

		return reservas.stream().map(reserva -> {
			Integer responsavelId = reserva.getFuncionario().getId();
			Integer clienteId = reserva.getCliente().getId();
			Integer acomodacaoId = reserva.getAcomodacao().getId();

			return new ReservaDto(reserva.getId(), responsavelId, clienteId, acomodacaoId, reserva.getDataInicio(),
					reserva.getDataFim(), reserva.getStatus(), reserva.getValorTotal());
		}).collect(Collectors.toList());
	}

	// Validador da reserva utilizado no cadastrar/editar
	private ResponseEntity<?> validarReserva(ReservaDto reservaDto) {
		if (reservaDto.getClienteId() == null || reservaDto.getAcomodacaoId() == null) {
			return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Dados obrigatórios não fornecidos.");
		}
		return null;
	}

	// Valida se as datas não estão ínvalidas
	private ResponseEntity<?> validarDatas(ReservaDto reservaDto) {

		Boolean isNull = (reservaDto.getDataInicio() == null || reservaDto.getDataFim() == null);
		Boolean isInvalidInputs = (reservaDto.getDataFim().isBefore(reservaDto.getDataInicio()));
		if (isNull || isInvalidInputs) {
			return ResponseEntity.status(HttpStatus.CONFLICT)
					.body("O período de reserva não foi definido corretamente.");
		}
		return null;
	}

	/*
	 * Verificar se os ID's não são nulo, caso contrario retorna o respectivo objeto
	 * do banco.
	 */
	private Usuario fetchUsuario(Integer usuarioId) {
		return usuarioId != null ? usuarioRepository.findById(usuarioId).orElse(null) : null;
	}

	private Cliente fetchCliente(Integer clienteId) {
		return clienteId != null ? clienteRepository.findById(clienteId).orElse(null) : null;
	}

	private Acomodacao fetchAcomodacao(Integer acomodacaoId) {
		return acomodacaoId != null ? acomodacaoRepository.findById(acomodacaoId).orElse(null) : null;
	}

	/*
	 * Verificador de disponibilidade para o reservar, com as datas que se deseja reservar,
	 * é verificado se ha conflito com as datas já reservadas e que não têm status de concluido ou cancelado. 
	 * Caso haver esses status é considerado que as datas estão disponiveis para reserva.
	 * A comparação é feito com todas as reservas dá acomodação.
	 */
	@Override
	public Boolean verificarDisponibilidade(Integer acomodacaoId, LocalDateTime dataInicio, LocalDateTime dataFim) {

	    List<ReservaDto> reservasAcomodacao = reservaRepository.findAllByAcomodacaoId(acomodacaoId);

	    for (ReservaDto reserva : reservasAcomodacao) {
	        LocalDateTime reservaInicio = reserva.getDataInicio();
	        LocalDateTime reservaFim = reserva.getDataFim();

	        if (reserva.getStatus() != Status.CONCLUIDO && reserva.getStatus() != Status.CANCELADO) {
	            LocalDateTime dataAtual = dataInicio;
	            while (!dataAtual.isAfter(dataFim)) {
	
	                if ((dataAtual.isEqual(reservaInicio) || dataAtual.isAfter(reservaInicio))
	                        && (dataAtual.isEqual(reservaFim) || dataAtual.isBefore(reservaFim))) {
	                    return false; 
	                }
	                dataAtual = dataAtual.plusDays(1);
	            }
	        }
	    }

	    return true; 
	}


	/*
	 * Verificador de disponibilidade para o editar, com as datas que se deseja reservar,
	 * é verificado se ha conflito com as datas já reservadas e que não têm status de concluido ou cancelado. 
	 * Caso haver esses status é considerado que as datas estão disponiveis para reserva.
	 * A comparação é feito com todas as reservas dá acomodação, ela ignora a reservaAtual(A que está sendo editada),
	 * com isso o período da reserva (que esta sendo editada) também fica disponivel.
	 */
	@Override
	public Boolean verificarDisponibilidade(Integer acomodacaoId, LocalDateTime dataInicio, LocalDateTime dataFim,
	        Integer reservaId) {

	    List<ReservaDto> reservasAcomodacao = reservaRepository.findAllByAcomodacaoId(acomodacaoId);
	 
	    reservasAcomodacao.removeIf(reserva -> reserva.getId().equals(reservaId));

	    for (ReservaDto reserva : reservasAcomodacao) {
	        LocalDateTime reservaInicio = reserva.getDataInicio();
	        LocalDateTime reservaFim = reserva.getDataFim();

	        if (reserva.getStatus() != Status.CONCLUIDO && reserva.getStatus() != Status.CANCELADO) {
	            LocalDateTime dataAtual = dataInicio;
	            while (!dataAtual.isAfter(dataFim)) {
	 
	                if ((dataAtual.isEqual(reservaInicio) || dataAtual.isAfter(reservaInicio))
	                        && (dataAtual.isEqual(reservaFim) || dataAtual.isBefore(reservaFim))) {
	                    return false; 
	                }
	                dataAtual = dataAtual.plusDays(1);
	            }
	        }
	    }

	    return true; 
	}
	
	
	/*
	 * Calcula a diferença em dias entre duas datas, o retorno vai ser um inteiro e será somado +1 
	 * para considerar a dataInicio no calculo
	 * */
	@Override
	public int calcularDiferencaEmDias(LocalDateTime dataInicio, LocalDateTime dataFim) {
        return (int) ChronoUnit.DAYS.between(dataInicio, dataFim) + 1;
    }


}
