package com.senai;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.senai.api.dto.AuthDto;
import com.senai.api.security.AdminInitializer;
import com.senai.api.services.impl.UsuarioServiceImpl;

@SpringBootTest(classes = HospedagemApplication.class)
@ActiveProfiles("test")
@AutoConfigureMockMvc  
public class TesteUnitario {

    @Autowired
    private UsuarioServiceImpl usuarioServiceImpl;

    @Autowired
    private MockMvc mockMvc;  

    private ObjectMapper objectMapper = new ObjectMapper();
    private String token;

    @Autowired
    private AdminInitializer adminInitializer;

    @Test
    public void testCPFValido() {
        String cpf = "32008729001"; 
        assertEquals(true, usuarioServiceImpl.isCpf(cpf));
    }

    @Test
    public void testCPFInvalido() {
        String cpf = "12345678900"; 
        assertEquals(false, usuarioServiceImpl.isCpf(cpf));
    }

    @Test
    public void testCriacaoAdmin() throws Exception {
        adminInitializer.run();
    }

    @BeforeEach
    public void testLogin() throws Exception {
        AuthDto credenciais = new AuthDto();
        credenciais.setCpf("32008729001"); 
        credenciais.setSenha("123456");    

        MvcResult resultado = mockMvc
                .perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(credenciais)))
                .andExpect(status().isAccepted())
                .andReturn();

        String response = resultado.getResponse().getContentAsString();
        JsonNode jsonNode = objectMapper.readTree(response);
        token = jsonNode.get("acessToken").asText(); 
    }

    @Test
    void testGetUsuarios() throws Exception {
        mockMvc.perform(get("/api/usuario/lista")
                .header(HttpHeaders.AUTHORIZATION, "Bearer " + token))
                .andExpect(status().isOk());
    }

    @Test
    void testGetClientes() throws Exception {
        mockMvc.perform(get("/api/hospedagem/clientes")
                .header(HttpHeaders.AUTHORIZATION, "Bearer " + token))
                .andExpect(status().isOk());
    }

    @Test
    void testGetAcomodacoes() throws Exception {
        mockMvc.perform(get("/api/hospedagem/acomodacoes")
                .header(HttpHeaders.AUTHORIZATION, "Bearer " + token))
                .andExpect(status().isOk());
    }
}
