package com.senai.api.services.impl;

import java.util.List;

import javax.crypto.SecretKey;

import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import com.senai.api.dto.ClienteDto;
import com.senai.api.models.Cliente;
import com.senai.api.models.Usuario;
import com.senai.api.repository.ClienteRepository;
import com.senai.api.repository.UsuarioRepository;
import com.senai.api.services.ClienteService;
import com.senai.api.services.UsuarioService;
import com.senai.api.utils.CryptoUtil;

import ch.qos.logback.core.net.SyslogOutputStream;

@Service
public class ClienteServiceImpl implements ClienteService {

	private ClienteRepository clienteRepository;
	private UsuarioService usuarioService;
	private UsuarioRepository usuarioRepository;
	SecretKey key = CryptoUtil.getFixedSecretKey();

	@Autowired
	public ClienteServiceImpl(ClienteRepository clienteRepository, UsuarioService usuarioService,
			UsuarioRepository usuarioRepository) {
		this.clienteRepository = clienteRepository;
		this.usuarioService = usuarioService;
		this.usuarioRepository = usuarioRepository;
	}

	/*
	 * Verifica todos os dados do payload da requisição por condicional e cadastra o
	 * cliente.
	 */
	@Override
	public ResponseEntity<?> cadastrar(ClienteDto clienteDto, Integer usuarioId) throws Exception {

		if (clienteDto == null || clienteDto.getCpf().trim().length() == 0 || clienteDto.getEmail().trim().length() == 0
				|| clienteDto.getEndereco().trim().length() == 0 || clienteDto.getNome().trim().length() == 0
				|| clienteDto.getTelefone().trim().length() == 0) {
			return ResponseEntity.status(HttpStatus.CONFLICT)
					.body("Formulário está incompleto, preencha todos os dados.");
		}

		String cpf = usuarioService.formatCpf(clienteDto.getCpf());
		Boolean isValid = usuarioService.validCpf(cpf);
		String cpfCriptografado = CryptoUtil.encryptCPF(cpf, key);
		Boolean isUser = usuarioRepository.findById(usuarioId).isPresent();
		Boolean isExists = clienteRepository.existsByCpf(cpfCriptografado);

		if (!isValid) {
			return ResponseEntity.status(HttpStatus.CONFLICT).body("Cliente com o CPF inválido.");
		} else if (isExists) {
			return ResponseEntity.status(HttpStatus.CONFLICT).body("Cliente com o mesmo CPF já existe.");
		} else if (!isUser) {
			return ResponseEntity.status(HttpStatus.CONFLICT).body("Funcionário não existe.");
		}
		Usuario funcionario = usuarioRepository.getReferenceById(usuarioId);
		Cliente cliente = new Cliente();
		BeanUtils.copyProperties(clienteDto, cliente);
		cliente.setCpf(cpfCriptografado);
		cliente.setFuncionario(funcionario);
		clienteRepository.save(cliente);
		return ResponseEntity.status(HttpStatus.CREATED).body("Cliente cadastrado com sucesso.");

	}

	/*
	 * Verifica todos os dados do payload da requisição por condicional, como também
	 * o que retorna de cliente do banco de dados, posteriormente atualiza o
	 * cliente.
	 */
	@Override
	public ResponseEntity<?> editar(ClienteDto clienteDto, Integer usuarioId, Integer clienteId) throws Exception {

		if (clienteDto == null || clienteDto.getCpf().trim().length() == 0 || clienteDto.getEmail().trim().length() == 0
				|| clienteDto.getEndereco().trim().length() == 0 || clienteDto.getNome().trim().length() == 0
				|| clienteDto.getTelefone().trim().length() == 0) {
			return ResponseEntity.status(HttpStatus.CONFLICT)
					.body("Formulário está incompleto, preencha todos os dados.");
		}

		Boolean isUser = usuarioRepository.findById(usuarioId).isPresent();

		Boolean isExists = clienteRepository.existsById(clienteId);
		if (!isExists) {
			return ResponseEntity.status(HttpStatus.CONFLICT).body("Cliente não cadastrado no sistema.");
		} else if (!isUser) {
			return ResponseEntity.status(HttpStatus.CONFLICT).body("Funcionário não cadastrado no sistema.");
		}

		Cliente dadosCliente = clienteRepository.getReferenceById(clienteId);
		String cpfCriptografado = dadosCliente.getCpf();
		
		Cliente cliente = new Cliente();
		
		Usuario funcionario = usuarioRepository.getReferenceById(usuarioId);
		BeanUtils.copyProperties(clienteDto, cliente);
		cliente.setId(clienteId);
		cliente.setCpf(cpfCriptografado);
		cliente.setFuncionario(funcionario);
		clienteRepository.save(cliente);
		return ResponseEntity.status(HttpStatus.OK).body("Cliente atualizado com sucesso.");

	}

	@Override
	public ResponseEntity<List<Cliente>> recuperarClientes() {
		try {
			List<Cliente> clientes = clienteRepository.findAll();
			clientes.forEach(cliente -> {
				try {
					String cpfDecriptografado = CryptoUtil.decryptCPF(cliente.getCpf(), key);
					cliente.setCpf(mascararCPF(cpfDecriptografado));
					cliente.setReservas(null);
				} catch (Exception e) {
					e.printStackTrace();
				}
			});
			return ResponseEntity.status(HttpStatus.OK).body(clientes);
		} catch (Exception e) {
			return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(null);
		}
	}

	@Override
	public ResponseEntity<Cliente> recuperarCliente(Integer clienteId) {
		try {
			Cliente cliente = clienteRepository.getReferenceById(clienteId);
			String cpfDecriptografado = CryptoUtil.decryptCPF(cliente.getCpf(), key);
			cliente.setCpf(cpfDecriptografado);
			return ResponseEntity.status(HttpStatus.OK).body(cliente);
		} catch (Exception e) {
			return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(null);
		}
	}

	/*
	 * Mascara para evitar que o frontend receba o cpf completo
	 * */
	public static String mascararCPF(String cpf) {
        if (cpf == null || cpf.length() != 11) {
            throw new IllegalArgumentException("O CPF deve conter exatamente 11 dígitos.");
        }
        return cpf.substring(0, 6) + "*****";
    }
}
