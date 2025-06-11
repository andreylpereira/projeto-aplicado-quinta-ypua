package com.senai.api.security;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

import com.senai.api.enums.Perfil;


@Configuration
@EnableWebSecurity
public class SecurityConfig {

    private final JwtAuthEntryPoint authEntryPoint;
    private final CustomUserDetailsService customUserDetailsService;

    @Autowired
    public SecurityConfig(CustomUserDetailsService customUserDetailsService, JwtAuthEntryPoint authEntryPoint) {
        this.authEntryPoint = authEntryPoint;
        this.customUserDetailsService = customUserDetailsService;
    }

    /*
     * Definindo o ponto permitido:  Autenticação via login;
     * Entre os pontos que são acessados por meio de autenticação, apenas o cadastro de usuário SOMENTE o perfil de ADMINISTRADOR é permitido.
     * Os demais pontos, tanto Perfil FUNCIONARIO, como ADMINISTRADOR têm acesso.
     * */

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http.csrf(csrf -> csrf.disable())
            .exceptionHandling(exceptionHandling -> exceptionHandling.authenticationEntryPoint(authEntryPoint)) 
            .sessionManagement(sessionManagement -> sessionManagement.sessionCreationPolicy(SessionCreationPolicy.STATELESS)) 
            .authorizeHttpRequests(authorizeHttpRequests -> authorizeHttpRequests
                .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll() 
                .requestMatchers("/api/auth/login/**").permitAll() 
                .requestMatchers("/v3/api-docs/**", "/swagger-ui/**", "/swagger-ui.html").permitAll() 
                .requestMatchers("/api/usuario/lista/**").hasAnyAuthority(Perfil.FUNCIONARIO.getDescricao(), Perfil.ADMINISTRADOR.getDescricao())
                .requestMatchers("/api/usuario/atualizarSenha/**").hasAnyAuthority(Perfil.FUNCIONARIO.getDescricao(), Perfil.ADMINISTRADOR.getDescricao())
                .requestMatchers("/api/usuario/cadastrarUsuario/**").hasAnyAuthority(Perfil.ADMINISTRADOR.getDescricao())
                .requestMatchers("/api/hospedagem/**").hasAnyAuthority(Perfil.ADMINISTRADOR.getDescricao(), Perfil.FUNCIONARIO.getDescricao())
                .requestMatchers("/api/usuario/**").hasAnyAuthority(Perfil.ADMINISTRADOR.getDescricao())
                .anyRequest().authenticated() 
            )
            .httpBasic();

        http.addFilterBefore(jwtAuthenticationFilter(), UsernamePasswordAuthenticationFilter.class);

        // Configuração CORS para a porta da aplicação react
        http.cors(cors -> cors.configurationSource(request -> {
            var corsConfig = new org.springframework.web.cors.CorsConfiguration();
            corsConfig.setAllowedOrigins(java.util.List.of("https://hospedagem-frontend.onrender.com")); 
            corsConfig.setAllowedMethods(java.util.List.of("GET", "POST", "PUT", "DELETE", "OPTIONS")); 
            corsConfig.setAllowedHeaders(java.util.List.of("Authorization", "Content-Type")); 
            corsConfig.setAllowCredentials(true); 
            corsConfig.setMaxAge(3600L); 
            return corsConfig;
        }));

        return http.build();
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration authConfiguration) throws Exception {
        return authConfiguration.getAuthenticationManager();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public JWTAuthenticationFilter jwtAuthenticationFilter() {
        return new JWTAuthenticationFilter();
    }
}
