package com.senai.api.enums;

public enum Perfil {
	ADMINISTRADOR("ADMINISTRADOR"), FUNCIONARIO("FUNCIONARIO");

	private final String descricao;

	Perfil(String descricao) {
		this.descricao = descricao;
	}

	public String getDescricao() {
		return descricao;
	}
}
