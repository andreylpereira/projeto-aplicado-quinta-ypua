package com.senai.api.services;

import java.time.LocalDateTime;
import java.util.Collections;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;


import static org.junit.jupiter.api.Assertions.assertDoesNotThrow;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class AgendaServiceTest {

    @Mock
    private AgendaService agendaService;

    @Test
    void testGerarCalendarioMensal() {
        LocalDateTime now = LocalDateTime.now();
        when(agendaService.gerarCalendarioMensal(now, 1)).thenReturn(Collections.emptyList());
        assertDoesNotThrow(() -> agendaService.gerarCalendarioMensal(now, 1));
    }

    @Test
    void testGerarAgendaMensal() {
        LocalDateTime now = LocalDateTime.now();
        when(agendaService.gerarAgendaMensal(now, 1)).thenReturn(Collections.emptyList());
        assertDoesNotThrow(() -> agendaService.gerarAgendaMensal(now, 1));
    }

    @Test
    void testGerarAgendaTempoReal() {
        LocalDateTime now = LocalDateTime.now();
        when(agendaService.gerarAgendaTempoReal(now)).thenReturn(Collections.emptyList());
        assertDoesNotThrow(() -> agendaService.gerarAgendaTempoReal(now));
    }
}