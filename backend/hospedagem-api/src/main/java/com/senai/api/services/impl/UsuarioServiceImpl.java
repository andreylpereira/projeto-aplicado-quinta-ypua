package com.senai.api.services.impl;

import java.util.InputMismatchException;
import java.util.List;

import javax.crypto.SecretKey;

import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.senai.api.dto.UsuarioDto;
import com.senai.api.models.Usuario;
import com.senai.api.repository.UsuarioRepository;
import com.senai.api.services.UsuarioService;
import com.senai.api.utils.CryptoUtil;

@Service
public class UsuarioServiceImpl implements UsuarioService {

	private UsuarioRepository usuarioRepository;
	private PasswordEncoder passwordEncoder;
	SecretKey key = CryptoUtil.getFixedSecretKey();

	@Autowired
	public UsuarioServiceImpl(UsuarioRepository usuarioRepository, PasswordEncoder passwordEncoder) {
		this.usuarioRepository = usuarioRepository;
		this.passwordEncoder = passwordEncoder;
	}

	/*
	 * Efetua o cadastro de usuário, onde o cpf de entrada é formatado. Depois é verificado se é valido,
	 * se já não foi cadastrado, o mesmo é criptografado por meio de Hash e a senha por meio do bcrypt.
	 * */
	@Override
	public ResponseEntity<?> cadastrar(UsuarioDto usuarioDto) throws Exception {

		String cpf = formatCpf(usuarioDto.getCpf());
		String cpfCriptografado = CryptoUtil.encryptCPF(cpf, key);
		Boolean isAvaible = usuarioRepository.findByCpf(cpfCriptografado).isEmpty();

		if (!validCpf(cpf)) {
			return ResponseEntity.status(HttpStatus.CONFLICT).body("O CPF fornecido é inválido.");
		} else if (isAvaible && usuarioDto != null) {
			Usuario usuario = new Usuario();
			String senhaCriptografada = new BCryptPasswordEncoder().encode(usuarioDto.getSenha());
			BeanUtils.copyProperties(usuarioDto, usuario);

			usuario.setCpf(cpfCriptografado);
			usuario.setSenha(senhaCriptografada);

			usuarioRepository.save(usuario);
			return ResponseEntity.status(HttpStatus.CREATED).body("Usuário cadastrado com sucesso.");

		} else {
			return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Não foi possivel cadastrar usuário.");
		}
	}

	/*
	 * Método não disponível por não está no escopo da aplicação, verifica se o usuário existe no banco de dados,
	 * e atualiza os dados, incluindo a utilizada do HASH e do bcrypt.
	 * */
	@Override
	public ResponseEntity<?> editar(UsuarioDto usuarioDto, Integer usuarioId) throws Exception {

		boolean isExists = usuarioRepository.existsById(usuarioId);

		if (isExists) {
			String senhaCriptografada = new BCryptPasswordEncoder().encode(usuarioDto.getSenha());
			String cpf = formatCpf(usuarioDto.getCpf());
			String cpfCriptografado = CryptoUtil.encryptCPF(cpf, key);
			Usuario usuario = new Usuario();

			BeanUtils.copyProperties(usuarioDto, usuario);
			usuario.setCpf(cpfCriptografado);
			usuario.setSenha(senhaCriptografada);
			usuario.setId(usuarioId);
			usuarioRepository.save(usuario);

			return ResponseEntity.status(HttpStatus.OK).body("Usuário atualizado com sucesso.");

		}

		return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Não foi possível atualizar o usuário.");
	}

	/*
	 * Atualiza a senha, verifica se não está vazio o dado do payload, se o usuário existe e aplica o bcrypt antes de inserir no banco.
	 * */
	@Override
	public ResponseEntity<?> editarSenha(String senha, Integer usuarioId) {

		Boolean isEmpty = senha.trim().length() == 0;
		if (isEmpty) {
			return ResponseEntity.status(HttpStatus.CONFLICT).body("A senha fornecida é inválida.");
		}
		
		Usuario usuario = usuarioRepository.getReferenceById(usuarioId);
			
		if (usuario.getId() == usuarioId) {
			String senhaCriptografada = new BCryptPasswordEncoder().encode(senha);
			usuario.setSenha(senhaCriptografada);
			usuarioRepository.save(usuario);
			return ResponseEntity.status(HttpStatus.OK).body("Senha atualizada com sucesso.");
		}
		return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Não foi possível atualizar a senha.");
	}

	@Override
	public Boolean verificarCpfExistente(String cpf) throws Exception {
		String cpfCriptografado = CryptoUtil.encryptCPF(cpf, key);
		return usuarioRepository.findByCpf(cpfCriptografado).isPresent();
	}

	@Override
	public ResponseEntity<?> editarPermissao(Integer usuarioId, boolean habilitado) {
		Usuario usuario = usuarioRepository.getReferenceById(usuarioId);

		if (usuario.getId() == usuarioId) {
			usuario.setHabilitado(habilitado);
			usuarioRepository.save(usuario);
			return ResponseEntity.status(HttpStatus.OK).body("Credencial atualizada com sucesso.");
		}
		return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Usuário com ID " + usuarioId + " não encontrado.");
	}

	//Lógica para verificar se é um cpf
	public Boolean isCpf(String CPF) {

		if (CPF.equals("00000000000") || CPF.equals("11111111111") || CPF.equals("22222222222")
				|| CPF.equals("33333333333") || CPF.equals("44444444444") || CPF.equals("55555555555")
				|| CPF.equals("66666666666") || CPF.equals("77777777777") || CPF.equals("88888888888")
				|| CPF.equals("99999999999") || (CPF.length() != 11))
			return (false);

		char dig10, dig11;
		int sm, i, r, num, peso;

		try {
			sm = 0;
			peso = 10;
			for (i = 0; i < 9; i++) {

				num = (int) (CPF.charAt(i) - 48);
				sm = sm + (num * peso);
				peso = peso - 1;
			}

			r = 11 - (sm % 11);
			if ((r == 10) || (r == 11))
				dig10 = '0';
			else
				dig10 = (char) (r + 48);

			sm = 0;
			peso = 11;
			for (i = 0; i < 10; i++) {
				num = (int) (CPF.charAt(i) - 48);
				sm = sm + (num * peso);
				peso = peso - 1;
			}

			r = 11 - (sm % 11);
			if ((r == 10) || (r == 11))
				dig11 = '0';
			else
				dig11 = (char) (r + 48);

			if ((dig10 == CPF.charAt(9)) && (dig11 == CPF.charAt(10)))
				return (true);
			else
				return (false);
		} catch (InputMismatchException erro) {
			return (false);
		}
	}

	//Formatador de cpf, tirando pontuação e etc
	public String formatCpf(String cpf) {
		if (cpf.contains(".")) {
			cpf = cpf.replace(".", "");
		}
		if (cpf.contains("-")) {
			cpf = cpf.replace("-", "");
		}
		if (cpf.contains("/")) {
			cpf = cpf.replace("/", "");
		}
		return cpf;
	}

	//Aplica o formatador e o verificador de CPF em uma string de entrada e retorna se é um cpf valido.
	public Boolean validCpf(String cpf) {

		String format = formatCpf(cpf);
		Boolean valid = isCpf(format);

		return valid;
	}

	@Override
	public ResponseEntity<List<Usuario>> recuperarUsuarios() {
		try {
			List<Usuario> usuarios = usuarioRepository.findAll();
			usuarios.forEach(a -> {
				a.setCpf(null);
				a.setSenha(null);
			});
			return ResponseEntity.status(HttpStatus.OK).body(usuarios);
		} catch (Exception e) {
			 return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                     .body(null);		
		}
	}

	
	@Override
	public ResponseEntity<Usuario> recuperarUsuario(Integer usuarioId) {
		try {
			Usuario usuario = usuarioRepository.getReferenceById(usuarioId);
			usuario.setCpf(null);
			usuario.setSenha(null);
			return ResponseEntity.status(HttpStatus.OK).body(usuario);
		} catch (Exception e) {
			 return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                     .body(null);	
		}
	}
}
