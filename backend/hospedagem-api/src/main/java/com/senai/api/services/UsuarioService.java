package com.senai.api.services;

import java.security.NoSuchAlgorithmException;
import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import com.senai.api.dto.UsuarioDto;
import com.senai.api.models.Usuario;

@Service
public interface UsuarioService {

	ResponseEntity<?> cadastrar(UsuarioDto usuarioDto) throws NoSuchAlgorithmException, Exception;

	String formatCpf(String cpf);

	Boolean isCpf(String cpf);

	Boolean validCpf(String cpf);

	Boolean verificarCpfExistente(String cpf) throws Exception;

	ResponseEntity<?> editar(UsuarioDto usuarioDto, Integer usuarioId) throws NoSuchAlgorithmException, Exception;

	ResponseEntity<?> editarSenha(String senha, Integer usuarioId);

	ResponseEntity<?> editarPermissao(Integer usuarioId, boolean habilitado);

	ResponseEntity<List<Usuario>> recuperarUsuarios();

	ResponseEntity<Usuario> recuperarUsuario(Integer usuarioId);


}
