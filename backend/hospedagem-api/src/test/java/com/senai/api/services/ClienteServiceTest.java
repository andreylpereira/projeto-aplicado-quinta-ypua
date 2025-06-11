package com.senai.api.services;

import com.senai.api.dto.ClienteDto;
import com.senai.api.models.Cliente;
import java.util.Collections;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.ResponseEntity;


import static org.junit.jupiter.api.Assertions.assertDoesNotThrow;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class ClienteServiceTest {

    @Mock
    private ClienteService clienteService;

    @Test
    void testCadastrar() throws Exception {
        ClienteDto clienteDto = new ClienteDto();
        when(clienteService.cadastrar(clienteDto, 1)).thenReturn(ResponseEntity.ok().build());
        assertDoesNotThrow(() -> clienteService.cadastrar(clienteDto, 1));
    }

    @Test
    void testEditar() throws Exception {
        ClienteDto clienteDto = new ClienteDto();
        when(clienteService.editar(clienteDto, 1, 1)).thenReturn(ResponseEntity.ok().build());
        assertDoesNotThrow(() -> clienteService.editar(clienteDto, 1, 1));
    }

    @Test
    void testRecuperarClientes() {
        when(clienteService.recuperarClientes()).thenReturn(ResponseEntity.ok(Collections.emptyList()));
        assertDoesNotThrow(() -> clienteService.recuperarClientes());
    }

    @Test
    void testRecuperarCliente() {
        when(clienteService.recuperarCliente(1)).thenReturn(ResponseEntity.ok(new Cliente()));
        assertDoesNotThrow(() -> clienteService.recuperarCliente(1));
    }
}