package com.senai.api.enums;

import com.fasterxml.jackson.annotation.JsonValue;

public enum Status {
    EM_ANDAMENTO("Em andamento"),
    CONFIRMADO("Confirmado"),
    CANCELADO("Cancelado"),
    PENDENTE("Pendente"),
	CONCLUIDO("Concluído");

    private final String descricao;

    Status(String descricao) {
        this.descricao = descricao;
    }

    @JsonValue
    public String getDescricao() {
        return descricao;
    }

}