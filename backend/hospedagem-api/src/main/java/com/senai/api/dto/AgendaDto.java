package com.senai.api.dto;

import java.time.LocalDateTime;


//DTO utilizado para montar calendario do mês e identificar se o dia está ocupado e por qual reserva
public class AgendaDto {
	private LocalDateTime data;
	private boolean ocupado;
	private Integer reservaId;
	
	public AgendaDto() {
	}
	
	public AgendaDto(LocalDateTime data, boolean ocupado, Integer reservaId) {
		this.data = data;
		this.ocupado = ocupado;
		this.reservaId = reservaId;
	}
	public LocalDateTime getData() {
		return data;
	}
	public void setData(LocalDateTime data) {
		this.data = data;
	}
	public boolean isOcupado() {
		return ocupado;
	}
	public void setOcupado(boolean ocupado) {
		this.ocupado = ocupado;
	}
	public Integer getReservaId() {
		return reservaId;
	}
	public void setReservaId(Integer reservaId) {
		this.reservaId = reservaId;
	}
	
}
