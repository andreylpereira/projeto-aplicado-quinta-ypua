package com.senai.api.dto;

import java.time.LocalDateTime;

import com.senai.api.enums.Status;

public class ReservaDto {
	private Integer id;
	private Integer funcionarioId;
	private Integer clienteId;
	private Integer acomodacaoId;
	private LocalDateTime dataInicio;
	private LocalDateTime dataFim;
	private Status status;
	private double valorTotal;

	public ReservaDto(Integer id, Integer funcionarioId, Integer clienteId, Integer acomodacaoId,
			LocalDateTime dataInicio, LocalDateTime dataFim, Status status, double valorTotal) {
		this.id = id;
		this.funcionarioId = funcionarioId;
		this.clienteId = clienteId;
		this.acomodacaoId = acomodacaoId;
		this.dataInicio = dataInicio;
		this.dataFim = dataFim;
		this.status = status;
		this.valorTotal = valorTotal;
	}

	public Integer getId() {
		return id;
	}

	public void setId(Integer id) {
		this.id = id;
	}

	public Integer getFuncionarioId() {
		return funcionarioId;
	}

	public void setFuncionarioId(Integer funcionarioId) {
		this.funcionarioId = funcionarioId;
	}

	public Integer getClienteId() {
		return clienteId;
	}

	public void setClienteId(Integer clienteId) {
		this.clienteId = clienteId;
	}

	public Integer getAcomodacaoId() {
		return acomodacaoId;
	}

	public void setAcomodacaoId(Integer acomodacaoId) {
		this.acomodacaoId = acomodacaoId;
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

	public Status getStatus() {
		return status;
	}

	public void setStatus(Status status) {
		this.status = status;
	}

	public double getValorTotal() {
		return valorTotal;
	}

	public void setValorTotal(double valorTotal) {
		this.valorTotal = valorTotal;
	}

}
