package com.senai.api.dto;

public class AuthResponseDto {

	private String acessToken;
	private String tokenType = "Bearer ";

	public AuthResponseDto(String acessToken) {
		this.acessToken = acessToken;
	}

	public AuthResponseDto(String acessToken, String tokenType) {
		this.acessToken = acessToken;
		this.tokenType = tokenType;
	}

	public String getAcessToken() {
		return acessToken;
	}

	public void setAcessToken(String acessToken) {
		this.acessToken = acessToken;
	}

	public String getTokenType() {
		return tokenType;
	}

	public void setTokenType(String tokenType) {
		this.tokenType = tokenType;
	}

}