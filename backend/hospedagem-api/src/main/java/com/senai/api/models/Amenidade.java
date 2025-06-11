package com.senai.api.models;

import java.util.Set;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import jakarta.persistence.*;

@Entity
@Table(name = "amenidades")
@JsonIgnoreProperties({ "hibernateLazyInitializer", "handler" })
public class Amenidade {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Integer id;
	private String nome;

	@ManyToMany(mappedBy = "amenidades")
	@JsonIgnore
	private Set<Acomodacao> acomodacoes;

	@ManyToOne
	@JoinColumn(name = "funcionario_id")
	@JsonIgnore
	private Usuario funcionario;

	public Amenidade() {
	}

	public Amenidade(Integer id, String nome, Set<Acomodacao> acomodacoes, Usuario funcionario) {
		this.id = id;
		this.nome = nome;
		this.acomodacoes = acomodacoes;
		this.funcionario = funcionario;
	}

	public Integer getId() {
		return id;
	}

	public void setId(Integer id) {
		this.id = id;
	}

	public String getNome() {
		return nome;
	}

	public void setNome(String nome) {
		this.nome = nome;
	}

	public Set<Acomodacao> getAcomodacoes() {
		return acomodacoes;
	}

	public void setAcomodacoes(Set<Acomodacao> acomodacoes) {
		this.acomodacoes = acomodacoes;
	}

	public Usuario getFuncionario() {
		return funcionario;
	}

	public void setFuncionario(Usuario funcionario) {
		this.funcionario = funcionario;
	}

}
