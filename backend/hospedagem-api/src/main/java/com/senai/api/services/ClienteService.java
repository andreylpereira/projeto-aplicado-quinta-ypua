package com.senai.api.services;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import com.senai.api.dto.ClienteDto;
import com.senai.api.models.Cliente;

@Service
public interface ClienteService {

	ResponseEntity<?> cadastrar(ClienteDto clienteDto, Integer usuarioId) throws Exception;

	ResponseEntity<?> editar(ClienteDto clienteDto, Integer usuarioId, Integer clienteId)throws Exception;

	ResponseEntity<List<Cliente>> recuperarClientes();

	ResponseEntity<Cliente> recuperarCliente(Integer clienteId);

}
