package com.senai.api.security;

import javax.crypto.SecretKey;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import com.senai.api.enums.Perfil;
import com.senai.api.models.Usuario;
import com.senai.api.repository.UsuarioRepository;
import com.senai.api.services.UsuarioService;
import com.senai.api.utils.CryptoUtil;

// Esse componente verificar se o primeiro administrador foi cadastrado, caso não, efetua o cadastro. A criação do primeiro admin serve para ter um ponto de inicio para a aplicação.
@Component
public class AdminInitializer implements CommandLineRunner {

	@Value("${admin.cpf}")
	private String cpf;
	@Value("${admin.senha}")
	private String senha;

	private final UsuarioRepository usuarioRepository;
	private final PasswordEncoder passwordEncoder;

	@Autowired
	private UsuarioService usuarioService;

	public AdminInitializer(UsuarioRepository usuarioRepository, PasswordEncoder passwordEncoder) {
		this.usuarioRepository = usuarioRepository;
		this.passwordEncoder = passwordEncoder;
	}

	@Override
	public void run(String... args) throws Exception {
		SecretKey key = CryptoUtil.getFixedSecretKey();
		String cpfCriptografado = CryptoUtil.encryptCPF(cpf, key);

		if (!usuarioService.verificarCpfExistente(cpf)) {
			Usuario admin = new Usuario();
			admin.setCpf(cpfCriptografado);
			admin.setNome("Admin");
			admin.setSenha(passwordEncoder.encode(senha));
			admin.setPerfil(Perfil.ADMINISTRADOR.getDescricao());
			admin.setHabilitado(true);
			usuarioRepository.save(admin);
		}
	}
}
