package com.senai.api.services;

import com.senai.api.dto.AcomodacaoDto;
import com.senai.api.models.Acomodacao;
import java.util.Collections;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.ResponseEntity;


import static org.junit.jupiter.api.Assertions.assertDoesNotThrow;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class AcomodacaoServiceTest {

    @Mock
    private AcomodacaoService acomodacaoService;

    @Test
    void testEditar() {
        AcomodacaoDto acomodacaoDto = new AcomodacaoDto();
        when(acomodacaoService.editar(acomodacaoDto, 1, 1)).thenReturn(ResponseEntity.ok().build());
        assertDoesNotThrow(() -> acomodacaoService.editar(acomodacaoDto, 1, 1));
    }

    @Test
    void testCadastrar() {
        AcomodacaoDto acomodacaoDto = new AcomodacaoDto();
        when(acomodacaoService.cadastrar(acomodacaoDto, 1)).thenReturn(ResponseEntity.ok().build());
        assertDoesNotThrow(() -> acomodacaoService.cadastrar(acomodacaoDto, 1));
    }

    @Test
    void testHabilitadoDesabilitado() {
        when(acomodacaoService.habilitadoDesabilitado(1, true)).thenReturn(ResponseEntity.ok().build());
        assertDoesNotThrow(() -> acomodacaoService.habilitadoDesabilitado(1, true));
    }

    @Test
    void testRecuperarAcomodacao() {
        when(acomodacaoService.recuperarAcomodacao(1)).thenReturn(ResponseEntity.ok(new Acomodacao()));
        assertDoesNotThrow(() -> acomodacaoService.recuperarAcomodacao(1));
    }

    @Test
    void testRecuperarAcomodacoes() {
        when(acomodacaoService.recuperarAcomodacoes()).thenReturn(ResponseEntity.ok(Collections.emptyList()));
        assertDoesNotThrow(() -> acomodacaoService.recuperarAcomodacoes());
    }
}