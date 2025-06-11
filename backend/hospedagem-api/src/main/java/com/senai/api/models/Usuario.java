package com.senai.api.models;

import java.util.Set;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;

@Entity
@Table(name = "usuarios")
@JsonIgnoreProperties({ "hibernateLazyInitializer", "handler" })
public class Usuario {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Integer id;
	private String cpf;
	private String senha;
	private String perfil;
	private String nome;
	private String email;
	private boolean habilitado;

	@OneToMany(mappedBy = "funcionario", cascade = CascadeType.ALL)
	@JsonIgnore // @JsonManagedReference -> JsonIgnore esconde e o reference apresenta as
				// reservas
	private Set<Reserva> reservas;

	@OneToMany(mappedBy = "funcionario", cascade = CascadeType.ALL)
	@JsonIgnore
	private Set<Acomodacao> acomodacoes;

	@OneToMany(mappedBy = "funcionario", cascade = CascadeType.ALL)
	@JsonIgnore
	private Set<Amenidade> amenidades;

	@OneToMany(mappedBy = "funcionario", cascade = CascadeType.ALL)
	@JsonIgnore
	private Set<Cliente> clientes;

	public Usuario() {
	}

	public Usuario(Integer id, String cpf, String senha, String perfil, String nome, String email, boolean habilitado,
			Set<Reserva> reservas, Set<Acomodacao> acomodacoes, Set<Amenidade> amenidades, Set<Cliente> clientes) {
		this.id = id;
		this.cpf = cpf;
		this.senha = senha;
		this.perfil = perfil;
		this.nome = nome;
		this.email = email;
		this.habilitado = habilitado;
		this.reservas = reservas;
		this.acomodacoes = acomodacoes;
		this.amenidades = amenidades;
		this.clientes = clientes;
	}

	public Integer getId() {
		return id;
	}

	public void setId(Integer id) {
		this.id = id;
	}

	public String getCpf() {
		return cpf;
	}

	public void setCpf(String cpf) {
		this.cpf = cpf;
	}

	public String getSenha() {
		return senha;
	}

	public void setSenha(String senha) {
		this.senha = senha;
	}

	public String getPerfil() {
		return perfil;
	}

	public void setPerfil(String perfil) {
		this.perfil = perfil;
	}

	public String getNome() {
		return nome;
	}

	public void setNome(String nome) {
		this.nome = nome;
	}

	public String getEmail() {
		return email;
	}

	public void setEmail(String email) {
		this.email = email;
	}

	public boolean isHabilitado() {
		return habilitado;
	}

	public void setHabilitado(boolean habilitado) {
		this.habilitado = habilitado;
	}

	public Set<Reserva> getReservas() {
		return reservas;
	}

	public void setReservas(Set<Reserva> reservas) {
		this.reservas = reservas;
	}

	public Set<Acomodacao> getAcomodacoes() {
		return acomodacoes;
	}

	public void setAcomodacoes(Set<Acomodacao> acomodacoes) {
		this.acomodacoes = acomodacoes;
	}

	public Set<Amenidade> getAmenidades() {
		return amenidades;
	}

	public void setAmenidades(Set<Amenidade> amenidades) {
		this.amenidades = amenidades;
	}

	public Set<Cliente> getClientes() {
		return clientes;
	}

	public void setClientes(Set<Cliente> clientes) {
		this.clientes = clientes;
	}

}