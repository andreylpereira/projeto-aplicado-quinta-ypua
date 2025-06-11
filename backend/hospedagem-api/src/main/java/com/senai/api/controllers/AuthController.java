package com.senai.api.controllers;

import javax.crypto.SecretKey;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.senai.api.dto.AuthDto;
import com.senai.api.dto.AuthResponseDto;

import com.senai.api.repository.UsuarioRepository;
import com.senai.api.security.JWTGenerator;

import com.senai.api.services.UsuarioService;
import com.senai.api.utils.CryptoUtil;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/")
@Tag(name = "Autenticação", description = "Operação de autenticação de usuário")
public class AuthController {

	private AuthenticationManager authenticationManager;
	private UsuarioRepository usuarioRepository;
	private PasswordEncoder passwordEncoder;
	private JWTGenerator jwtGenerator;
	private UsuarioService usuarioService;

	@Autowired
	public AuthController(AuthenticationManager authenticationManager, UsuarioRepository usuarioRepository,
			PasswordEncoder passwordEncoder, JWTGenerator jwtGenerator, UsuarioService usuarioService) {
		this.authenticationManager = authenticationManager;
		this.usuarioRepository = usuarioRepository;
		this.passwordEncoder = passwordEncoder;
		this.jwtGenerator = jwtGenerator;
		this.usuarioService = usuarioService;
	}

	@PostMapping("/api/auth/login")
	@Operation(summary = "Autentica e autoriza usuário", description = "Com credênciais de cpf e senha efetua autenticação na aplicação retornando um token.")
	@ApiResponse(responseCode = "202", description = "Usuário autenticado com sucesso.")
	@ApiResponse(responseCode = "401", description = "Usuário não autorizado.", content = @Content(mediaType = "application/json"))
	public ResponseEntity<AuthResponseDto> login(@RequestBody @Valid AuthDto authDto) throws Exception {
		SecretKey key = CryptoUtil.getFixedSecretKey();
		String cpf = usuarioService.formatCpf(authDto.getCpf());
		String cpfCriptografado = CryptoUtil.encryptCPF(cpf, key);

		Authentication authentication = authenticationManager
				.authenticate(new UsernamePasswordAuthenticationToken(cpfCriptografado, authDto.getSenha()));
		SecurityContextHolder.getContext().setAuthentication(authentication);
		String token = jwtGenerator.generateToken(authentication);

		return new ResponseEntity<>(new AuthResponseDto(token), HttpStatus.ACCEPTED);
	}

}