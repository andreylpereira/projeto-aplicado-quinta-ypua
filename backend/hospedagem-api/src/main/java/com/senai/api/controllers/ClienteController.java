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

import com.senai.api.dto.ClienteDto;
import com.senai.api.models.Cliente;
import com.senai.api.repository.ClienteRepository;
import com.senai.api.services.ClienteService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;

@RestController
@RequestMapping("/api/hospedagem")
@Tag(name = "Cliente", description = "Operações para gerenciar clientes")
public class ClienteController {

	private ClienteService clienteService;
	private ClienteRepository clienteRepository;

	@Autowired
	public ClienteController(ClienteService clienteService, ClienteRepository clienteRepository) {
		this.clienteService = clienteService;
		this.clienteRepository = clienteRepository;
	}

	@PostMapping("/{usuarioId}/clientes")
	@Operation(summary = "Cadastra cliente", description = "Com usuarioId como parâmetro e um objeto cliente no corpo da requisição, efetua cadastro do cliente no banco de dados.")
	@ApiResponse(responseCode = "201", description = "Cliente cadastrado com sucesso.",
		    content = @Content(mediaType = "application/json"))
	@ApiResponse(responseCode = "409", description = "Cliente com o CPF inválido.",
		    content = @Content(mediaType = "application/json"))
	@ApiResponse(responseCode = "409", description = "Cliente com o mesmo CPF já existe.",
    content = @Content(mediaType = "application/json"))
	@ApiResponse(responseCode = "409", description = "Funcionário não existe.",
    content = @Content(mediaType = "application/json"))
	public ResponseEntity<?> insertCliente(@RequestBody ClienteDto clienteDto, @PathVariable Integer usuarioId) throws Exception {
		return clienteService.cadastrar(clienteDto, usuarioId);
	}
	
	@PutMapping("{usuarioId}/clientes/{clienteId}")
	@Operation(summary = "Atualiza dados do cliente", description = "Com usuarioId e clienteId como parâmetros e um objeto cliente no corpo da requisição, atualiza a reserva que possui o valor do id do parâmetro.")
	@ApiResponse(responseCode = "200", description = "Cliente atualizado com sucesso.",
		    content = @Content(mediaType = "application/json"))
	@ApiResponse(responseCode = "409", description = "Formulário está incompleto, preencha todos os dados.",
    content = @Content(mediaType = "application/json"))
	@ApiResponse(responseCode = "409", description = "Cliente não cadastrado no sistema.",
    content = @Content(mediaType = "application/json"))
	@ApiResponse(responseCode = "409", description = "Funcionário não cadastrado no sistema.",
    content = @Content(mediaType = "application/json"))
	public ResponseEntity<?> updateCliente(@RequestBody ClienteDto clienteDto, @PathVariable Integer usuarioId,
			@PathVariable Integer clienteId) throws Exception {
		return clienteService.editar(clienteDto, usuarioId, clienteId);
	}

	@GetMapping("/clientes")
	@Operation(summary = "Retorna uma lista de clientes", description = "Recupera uma lista de clientes e seus respectivos dados do banco de dados.")
	@ApiResponse(responseCode = "200", description = "A recuperação da lista de clientes e seus dados foi realizada com sucesso.")
	@ApiResponse(responseCode = "400", description = "Não foi possível recuperar a lista de clientes.",
		    content = @Content(mediaType = "application/json"))
	public ResponseEntity<List<Cliente>> findClientes() {
		return clienteService.recuperarClientes();
	}

	@GetMapping("/clientes/{clienteId}")
	@Operation(summary = "Procura um cliente pelo ID", description = "Com clienteId como parâmetro, recupera um objeto contendo dados do cliente no banco de dados.")
	@ApiResponse(responseCode = "200", description = "A recuperação de dados do cliente realizada com sucesso.")
	@ApiResponse(responseCode = "400", description = "Não foi possível recuperar dados do cliente.",
		    content = @Content(mediaType = "application/json"))
	public ResponseEntity<Cliente> findCliente(@PathVariable Integer clienteId) {
		return clienteService.recuperarCliente(clienteId);
	}

}
