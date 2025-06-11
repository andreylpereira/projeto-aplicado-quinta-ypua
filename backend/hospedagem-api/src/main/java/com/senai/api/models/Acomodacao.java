package com.senai.api.models;

import java.util.Set;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;

@Entity
@Table(name = "acomodacoes")
@JsonIgnoreProperties({ "hibernateLazyInitializer", "handler" })
public class Acomodacao {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Integer id;
	private String nome;
	private String descricao;
	private int capacidade;
	private double preco;
	private boolean habilitado;
	private String contentType;
	
	@Lob
	@Column(columnDefinition = "TEXT")
	private String base64Image;

	@OneToMany(mappedBy = "acomodacao", cascade = CascadeType.ALL)
	private Set<Reserva> reservas;

	@ManyToMany
	@JoinTable(name = "acomodacao_amenidade", joinColumns = @JoinColumn(name = "acomodacao_id"), inverseJoinColumns = @JoinColumn(name = "amenidade_id", nullable = false))
	private Set<Amenidade> amenidades;

	@ManyToOne
	@JoinColumn(name = "funcionario_id")
	@JsonIgnore
	private Usuario funcionario;

	public Acomodacao() {
	}

	public Acomodacao(Integer id, String nome, String descricao, int capacidade, double preco, boolean habilitado,
			String contentType, String base64Image, Set<Reserva> reservas, Set<Amenidade> amenidades,
			Usuario funcionario) {
		this.id = id;
		this.nome = nome;
		this.descricao = descricao;
		this.capacidade = capacidade;
		this.preco = preco;
		this.habilitado = habilitado;
		this.contentType = contentType;
		this.base64Image = base64Image;
		this.reservas = reservas;
		this.amenidades = amenidades;
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

	public String getDescricao() {
		return descricao;
	}

	public void setDescricao(String descricao) {
		this.descricao = descricao;
	}

	public int getCapacidade() {
		return capacidade;
	}

	public void setCapacidade(int capacidade) {
		this.capacidade = capacidade;
	}

	public double getPreco() {
		return preco;
	}

	public void setPreco(double preco) {
		this.preco = preco;
	}

	public boolean isHabilitado() {
		return habilitado;
	}

	public void setHabilitado(boolean habilitado) {
		this.habilitado = habilitado;
	}

	public String getContentType() {
		return contentType;
	}

	public void setContentType(String contentType) {
		this.contentType = contentType;
	}

	public String getBase64Image() {
		return base64Image;
	}

	public void setBase64Image(String base64Image) {
		this.base64Image = base64Image;
	}

	public Set<Reserva> getReservas() {
		return reservas;
	}

	public void setReservas(Set<Reserva> reservas) {
		this.reservas = reservas;
	}

	public Set<Amenidade> getAmenidades() {
		return amenidades;
	}

	public void setAmenidades(Set<Amenidade> amenidades) {
		this.amenidades = amenidades;
	}

	public Usuario getFuncionario() {
		return funcionario;
	}

	public void setFuncionario(Usuario funcionario) {
		this.funcionario = funcionario;
	}

}
