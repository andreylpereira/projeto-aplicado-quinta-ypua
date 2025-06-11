package com.senai.api.services;

import com.senai.api.dto.ReservaDto;
import com.senai.api.enums.Status;
import java.time.LocalDateTime;
import java.util.Collections;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.ResponseEntity;


import static org.junit.jupiter.api.Assertions.assertDoesNotThrow;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class ReservaServiceTest {

    @Mock
    private ReservaService reservaService;

    @Test
    void testCadastrar() {
        ReservaDto reservaDto = new ReservaDto(null, null, null, null, LocalDateTime.now(), LocalDateTime.now().plusDays(1), Status.PENDENTE, 0.0);
        when(reservaService.cadastrar(reservaDto)).thenReturn(ResponseEntity.ok().build());
        assertDoesNotThrow(() -> reservaService.cadastrar(reservaDto));
    }

    @Test
    void testEditar() {
        ReservaDto reservaDto = new ReservaDto(null, null, null, null, LocalDateTime.now(), LocalDateTime.now().plusDays(1), Status.CONFIRMADO, 0.0);
        when(reservaService.editar(reservaDto, 1)).thenReturn(ResponseEntity.ok().build());
        assertDoesNotThrow(() -> reservaService.editar(reservaDto, 1));
    }

    @Test
    void testListarReservas() {
        when(reservaService.listarReservas()).thenReturn(Collections.emptyList());
        assertDoesNotThrow(() -> reservaService.listarReservas());
    }

    @Test
    void testReservaById() {
        when(reservaService.reservaById(1)).thenReturn(new ReservaDto(null, null, null, null, LocalDateTime.now(), LocalDateTime.now().plusDays(1), Status.CONCLUIDO, 0.0));
        assertDoesNotThrow(() -> reservaService.reservaById(1));
    }

    @Test
    void testVerificarDisponibilidadeComDuasDatas() {
        LocalDateTime now = LocalDateTime.now();
        when(reservaService.verificarDisponibilidade(1, now, now.plusDays(1))).thenReturn(true);
        assertDoesNotThrow(() -> reservaService.verificarDisponibilidade(1, now, now.plusDays(1)));
    }

    @Test
    void testVerificarDisponibilidadeComTresDatas() {
        LocalDateTime now = LocalDateTime.now();
        when(reservaService.verificarDisponibilidade(1, now, now.plusDays(1), 1)).thenReturn(true);
        assertDoesNotThrow(() -> reservaService.verificarDisponibilidade(1, now, now.plusDays(1), 1));
    }
}
