package com.senai.api.dto;

import java.time.LocalDateTime;

//DTO utilizado na montagem da agenda diaria(tempo real) e de cada acomodação.
public class AgendaMensalDto {

	private Integer reservaId;
	private String clienteNome;
	private String clienteEmail;
	private String clienteTelefone;
	private String funcionarioNome;
	private String acomodacaoNome;
	private String reservaStatus;
	private Integer acomodacaoId;
	private LocalDateTime dataInicio;
	private LocalDateTime dataFim;
	private double valorTotal;

	public AgendaMensalDto() {
	}

	public AgendaMensalDto(Integer reservaId, String clienteNome, String clienteEmail, String clienteTelefone,
			String funcionarioNome, String acomodacaoNome, String reservaStatus, Integer acomodacaoId,
			LocalDateTime dataInicio, LocalDateTime dataFim, double valorTotal) {
		this.reservaId = reservaId;
		this.clienteNome = clienteNome;
		this.clienteEmail = clienteEmail;
		this.clienteTelefone = clienteTelefone;
		this.funcionarioNome = funcionarioNome;
		this.acomodacaoNome = acomodacaoNome;
		this.reservaStatus = reservaStatus;
		this.acomodacaoId = acomodacaoId;
		this.dataInicio = dataInicio;
		this.dataFim = dataFim;
		this.valorTotal = valorTotal;
	}

	public Integer getReservaId() {
		return reservaId;
	}

	public void setReservaId(Integer reservaId) {
		this.reservaId = reservaId;
	}

	public String getClienteNome() {
		return clienteNome;
	}

	public void setClienteNome(String clienteNome) {
		this.clienteNome = clienteNome;
	}

	public String getClienteEmail() {
		return clienteEmail;
	}

	public void setClienteEmail(String clienteEmail) {
		this.clienteEmail = clienteEmail;
	}

	public String getClienteTelefone() {
		return clienteTelefone;
	}

	public void setClienteTelefone(String clienteTelefone) {
		this.clienteTelefone = clienteTelefone;
	}

	public String getFuncionarioNome() {
		return funcionarioNome;
	}

	public void setFuncionarioNome(String funcionarioNome) {
		this.funcionarioNome = funcionarioNome;
	}

	public String getAcomodacaoNome() {
		return acomodacaoNome;
	}

	public void setAcomodacaoNome(String acomodacaoNome) {
		this.acomodacaoNome = acomodacaoNome;
	}

	public String getReservaStatus() {
		return reservaStatus;
	}

	public void setReservaStatus(String reservaStatus) {
		this.reservaStatus = reservaStatus;
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

	public double getValorTotal() {
		return valorTotal;
	}

	public void setValorTotal(double valorTotal) {
		this.valorTotal = valorTotal;
	}

}