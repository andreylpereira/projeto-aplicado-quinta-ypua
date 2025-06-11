package com.senai.api.security;

import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationCredentialsNotFoundException;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Component;

import com.senai.api.models.Usuario;
import com.senai.api.repository.UsuarioRepository;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;

@Component
public class JWTGenerator {

	@Autowired
	private UsuarioRepository usuarioRepository;

	public String generateToken(Authentication authentication) {

		String username = authentication.getName();
		Date currentDate = new Date();
		Date expireDate = new Date(currentDate.getTime() + SecurityConstants.JWT_EXPIRATION);
		Optional<Usuario> usuario = usuarioRepository.findByCpf(username);
		Map<String, Object> claims = new HashMap<>();
		claims.put("id", usuario.get().getId());
		claims.put("nome", usuario.get().getNome());
		claims.put("perfil", authentication.getAuthorities());

		String token = Jwts.builder().setClaims(claims).setSubject(username).setIssuedAt(new Date())
				.setExpiration(expireDate).signWith(SignatureAlgorithm.HS512, SecurityConstants.JWT_SECRET).compact();

		return token;
	}

	public String getUsernameFromJWT(String token) {

		Claims claims = Jwts.parser().setSigningKey(SecurityConstants.JWT_SECRET).parseClaimsJws(token).getBody();

		return claims.getSubject();
	}

	public boolean validateToken(String token) {
		try {
			Jwts.parser().setSigningKey(SecurityConstants.JWT_SECRET).parse(token);
			return true;
		} catch (Exception ex) {
			throw new AuthenticationCredentialsNotFoundException("Token expirado ou incorreto.");
		}
	}
}