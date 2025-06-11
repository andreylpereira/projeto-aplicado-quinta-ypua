package com.senai.api.models;

import java.time.LocalDateTime;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.senai.api.enums.Status;

import jakarta.persistence.*;

@Entity
@Table(name = "reservas")
@JsonIgnoreProperties({ "hibernateLazyInitializer", "handler" })
public class Reserva {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Integer id;

	@ManyToOne
	@JoinColumn(name = "funcionario_id")
	@JsonIgnore
	private Usuario funcionario;

	@ManyToOne
	@JoinColumn(name = "cliente_id")
	@JsonBackReference
	private Cliente cliente;

	@ManyToOne
	@JoinColumn(name = "acomodacao_id")
	@JsonIgnore
	private Acomodacao acomodacao;

	@Column(name = "data_inicio")
	private LocalDateTime dataInicio;

	@Column(name = "data_fim")
	private LocalDateTime dataFim;

	@Column(name = "valor_total")
	private double valorTotal;

	@Enumerated(EnumType.STRING)
	@Column(name = "status")
	private Status status;

	public Reserva() {
	}

	public Reserva(Integer id, Usuario funcionario, Cliente cliente, Acomodacao acomodacao, LocalDateTime dataInicio,
			LocalDateTime dataFim, double valorTotal, Status status) {
		this.id = id;
		this.funcionario = funcionario;
		this.cliente = cliente;
		this.acomodacao = acomodacao;
		this.dataInicio = dataInicio;
		this.dataFim = dataFim;
		this.valorTotal = valorTotal;
		this.status = status;
	}

	public Integer getId() {
		return id;
	}

	public void setId(Integer id) {
		this.id = id;
	}

	public Usuario getFuncionario() {
		return funcionario;
	}

	public void setFuncionario(Usuario funcionario) {
		this.funcionario = funcionario;
	}

	public Cliente getCliente() {
		return cliente;
	}

	public void setCliente(Cliente cliente) {
		this.cliente = cliente;
	}

	public Acomodacao getAcomodacao() {
		return acomodacao;
	}

	public void setAcomodacao(Acomodacao acomodacao) {
		this.acomodacao = acomodacao;
	}

	public LocalDateTime getDataInicio() {
		return dataInicio;
	}

	public void setDataInicio(LocalDateTime dataInicio) {
		this.dataInicio = dataInicio;
	}

	public LocalDateTime getDataFim() {
		return dataFim;
	}

	public void setDataFim(LocalDateTime dataFim) {
		this.dataFim = dataFim;
	}

	public double getValorTotal() {
		return valorTotal;
	}

	public void setValorTotal(double valorTotal) {
		this.valorTotal = valorTotal;
	}

	public Status getStatus() {
		return status;
	}

	public void setStatus(Status status) {
		this.status = status;
	}

}
