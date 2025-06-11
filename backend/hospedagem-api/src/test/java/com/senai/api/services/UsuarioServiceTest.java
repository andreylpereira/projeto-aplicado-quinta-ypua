package com.senai.api.services;

import com.senai.api.dto.UsuarioDto;
import com.senai.api.models.Usuario;
import java.security.NoSuchAlgorithmException;
import java.util.Collections;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.ResponseEntity;


import static org.junit.jupiter.api.Assertions.assertDoesNotThrow;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class UsuarioServiceTest {

    @Mock
    private UsuarioService usuarioService;

    @Test
    void testCadastrar() throws NoSuchAlgorithmException, Exception {
        UsuarioDto usuarioDto = new UsuarioDto();
        when(usuarioService.cadastrar(usuarioDto)).thenReturn(ResponseEntity.ok().build());
        assertDoesNotThrow(() -> usuarioService.cadastrar(usuarioDto));
    }

    @Test
    void testFormatCpf() {
        when(usuarioService.formatCpf("12345678900")).thenReturn("123.456.789-00");
        assertDoesNotThrow(() -> usuarioService.formatCpf("12345678900"));
    }

    @Test
    void testIsCpf() {
        when(usuarioService.isCpf("123.456.789-00")).thenReturn(true);
        assertDoesNotThrow(() -> usuarioService.isCpf("123.456.789-00"));
    }

    @Test
    void testValidCpf() {
        when(usuarioService.validCpf("123.456.789-00")).thenReturn(true);
        assertDoesNotThrow(() -> usuarioService.validCpf("123.456.789-00"));
    }

    @Test
    void testVerificarCpfExistente() throws Exception {
        when(usuarioService.verificarCpfExistente("123.456.789-00")).thenReturn(false);
        assertDoesNotThrow(() -> usuarioService.verificarCpfExistente("123.456.789-00"));
    }

    @Test
    void testEditar() throws NoSuchAlgorithmException, Exception {
        UsuarioDto usuarioDto = new UsuarioDto();
        when(usuarioService.editar(usuarioDto, 1)).thenReturn(ResponseEntity.ok().build());
        assertDoesNotThrow(() -> usuarioService.editar(usuarioDto, 1));
    }

    @Test
    void testEditarSenha() {
        when(usuarioService.editarSenha("novaSenha", 1)).thenReturn(ResponseEntity.ok().build());
        assertDoesNotThrow(() -> usuarioService.editarSenha("novaSenha", 1));
    }

    @Test
    void testEditarPermissao() {
        when(usuarioService.editarPermissao(1, true)).thenReturn(ResponseEntity.ok().build());
        assertDoesNotThrow(() -> usuarioService.editarPermissao(1, true));
    }

    @Test
    void testRecuperarUsuarios() {
        when(usuarioService.recuperarUsuarios()).thenReturn(ResponseEntity.ok(Collections.emptyList()));
        assertDoesNotThrow(() -> usuarioService.recuperarUsuarios());
    }

    @Test
    void testRecuperarUsuario() {
        when(usuarioService.recuperarUsuario(1)).thenReturn(ResponseEntity.ok(new Usuario()));
        assertDoesNotThrow(() -> usuarioService.recuperarUsuario(1));
    }
}