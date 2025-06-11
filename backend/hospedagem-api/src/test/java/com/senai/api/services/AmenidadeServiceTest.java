package com.senai.api.services;

import com.senai.api.dto.AmenidadeDto;
import com.senai.api.models.Amenidade;
import java.util.Collections;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.ResponseEntity;


import static org.junit.jupiter.api.Assertions.assertDoesNotThrow;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class AmenidadeServiceTest {

    @Mock
    private AmenidadeService amenidadeService;

    @Test
    void testCadastrar() {
        AmenidadeDto amenidadeDto = new AmenidadeDto();
        when(amenidadeService.cadastrar(amenidadeDto, 1)).thenReturn(ResponseEntity.ok().build());
        assertDoesNotThrow(() -> amenidadeService.cadastrar(amenidadeDto, 1));
    }

    @Test
    void testEditar() {
        AmenidadeDto amenidadeDto = new AmenidadeDto();
        when(amenidadeService.editar(amenidadeDto, 1, 1)).thenReturn(ResponseEntity.ok().build());
        assertDoesNotThrow(() -> amenidadeService.editar(amenidadeDto, 1, 1));
    }

    @Test
    void testRecuperarAmenidades() {
        when(amenidadeService.recuperarAmenidades()).thenReturn(ResponseEntity.ok(Collections.emptyList()));
        assertDoesNotThrow(() -> amenidadeService.recuperarAmenidades());
    }

    @Test
    void testRecuperarAmenidade() {
        when(amenidadeService.recuperarAmenidade(1)).thenReturn(ResponseEntity.ok(new Amenidade()));
        assertDoesNotThrow(() -> amenidadeService.recuperarAmenidade(1));
    }
}