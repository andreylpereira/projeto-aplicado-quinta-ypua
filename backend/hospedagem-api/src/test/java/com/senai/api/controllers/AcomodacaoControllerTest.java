import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;
import static org.junit.jupiter.api.Assertions.*;

import com.senai.api.controllers.AcomodacaoController;
import com.senai.api.dto.AcomodacaoDto;
import com.senai.api.models.Acomodacao;
import com.senai.api.repository.AcomodacaoRepository;
import com.senai.api.services.AcomodacaoService;
import java.util.Arrays;
import java.util.HashSet;
import java.util.List;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;



@ExtendWith(MockitoExtension.class)
public class AcomodacaoControllerTest {

    private MockMvc mockMvc;

    @Mock
    private AcomodacaoService acomodacaoService;

    @Mock
    private AcomodacaoRepository acomodacaoRepository;

    @InjectMocks
    private AcomodacaoController acomodacaoController;

    @BeforeEach
    void setUp() {
        mockMvc = MockMvcBuilders.standaloneSetup(acomodacaoController).build();
    }

    @Test
    void testInsertAcomodacao_Success() throws Exception {
        printTestHeader(1, "POST /api/hospedagem/{usuarioId}/acomodacoes", "Dados válidos");
        String requestBody = "{\"descricao\": \"Acomodação Válida\"}";

        when(acomodacaoService.cadastrar(any(), anyInt())).thenReturn(ResponseEntity.ok().build());

        MvcResult result = mockMvc.perform(MockMvcRequestBuilders.post("/api/hospedagem/1/acomodacoes")
                .contentType(MediaType.APPLICATION_JSON)
                .content(requestBody))
                .andReturn();

        printResult(requestBody, 200, result.getResponse().getStatus());
        assertEquals(200, result.getResponse().getStatus());
    }

    @Test
    void testInsertAcomodacao_Failure() throws Exception {
        printTestHeader(2, "POST /api/hospedagem/{usuarioId}/acomodacoes", "Dados inválidos");
        String requestBody = "{\"descricao\": \"\"}";

        when(acomodacaoService.cadastrar(any(), anyInt())).thenReturn(ResponseEntity.badRequest().build());

        MvcResult result = mockMvc.perform(MockMvcRequestBuilders.post("/api/hospedagem/1/acomodacoes")
                .contentType(MediaType.APPLICATION_JSON)
                .content(requestBody))
                .andReturn();

        printResult(requestBody, 400, result.getResponse().getStatus());
        assertEquals(400, result.getResponse().getStatus());
    }

    @Test
    void testInsertAcomodacaoSuccess() {
        printTestHeader(3, "POST /acomodacoes (diretamente)", "DTO válido");
        AcomodacaoDto dto = createValidAcomodacaoDto();

        when(acomodacaoService.cadastrar(any(), anyInt())).thenReturn(ResponseEntity.status(201).build());

        ResponseEntity<?> response = acomodacaoController.insertAcomodacao(dto, 1);
        printResult(dtoToString(dto), 201, response.getStatusCodeValue());
        assertEquals(201, response.getStatusCodeValue());
    }

    @Test
    void testUpdateAcomodacaoSuccess() {
        printTestHeader(4, "PUT /acomodacoes/{id}", "Atualização válida");
        AcomodacaoDto dto = createValidAcomodacaoDto();

        when(acomodacaoService.editar(any(), anyInt(), anyInt())).thenReturn(ResponseEntity.ok().build());

        ResponseEntity<?> response = acomodacaoController.updateAcomodacao(dto, 1, 1);
        printResult(dtoToString(dto), 200, response.getStatusCodeValue());
        assertEquals(200, response.getStatusCodeValue());
    }

    @Test
    void testFindAcomodacoesSuccess() {
        printTestHeader(5, "GET /acomodacoes", "Listagem completa");
        List<Acomodacao> lista = Arrays.asList(
            createValidAcomodacao(1), 
            createValidAcomodacao(2)
        );

        when(acomodacaoService.recuperarAcomodacoes()).thenReturn(ResponseEntity.ok(lista));

        ResponseEntity<List<Acomodacao>> response = acomodacaoController.findAcomodacoes();
        printResult("Quantidade esperada: 2", 2, response.getBody().size());
        assertEquals(2, response.getBody().size());
    }

    @Test
    void testFindAcomodacaoSuccess() {
        printTestHeader(6, "GET /acomodacoes/{id}", "ID existente");
        Integer id = 1;

        when(acomodacaoService.recuperarAcomodacao(id)).thenReturn(ResponseEntity.ok(createValidAcomodacao(id)));

        ResponseEntity<Acomodacao> response = acomodacaoController.findAcomodacao(id);
        printResult("ID: " + id, 200, response.getStatusCodeValue());
        assertEquals(id, response.getBody().getId());
    }

    @Test
    void testUpdateHabilitadoSuccess() {
        printTestHeader(7, "PATCH /acomodacoes/{id}/status", "Status válido");

        when(acomodacaoService.habilitadoDesabilitado(1, true)).thenReturn(ResponseEntity.ok().build());

        ResponseEntity<?> response = acomodacaoController.updateHabilitado(1, true);
        printResult("Status: true", 200, response.getStatusCodeValue());
        assertEquals(200, response.getStatusCodeValue());
    }

    @Test
    void testUpdateAcomodacaoWithInvalidDataAndId() {
        printTestHeader(8, "PUT /acomodacoes/{id}", "DTO inválido + ID inexistente");
        AcomodacaoDto dto = new AcomodacaoDto();

        when(acomodacaoService.editar(any(), anyInt(), anyInt())).thenReturn(ResponseEntity.badRequest().build());

        ResponseEntity<?> response = acomodacaoController.updateAcomodacao(dto, 999, 999);
        printResult(dtoToString(dto), 400, response.getStatusCodeValue());
        assertEquals(400, response.getStatusCodeValue());
    }

    @Test
    void testFindAcomodacoesFailure() {
        printTestHeader(9, "GET /acomodacoes", "Erro interno");

        when(acomodacaoService.recuperarAcomodacoes()).thenReturn(ResponseEntity.internalServerError().build());

        ResponseEntity<List<Acomodacao>> response = acomodacaoController.findAcomodacoes();
        printResult("", 500, response.getStatusCodeValue());
        assertEquals(500, response.getStatusCodeValue());
    }

    @Test
    void testFindAcomodacaoInvalidIdFormat() throws Exception {
        printTestHeader(10, "GET /acomodacoes/{id}", "ID não numérico");
        String invalidId = "abc";

        MvcResult result = mockMvc.perform(MockMvcRequestBuilders.get("/acomodacoes/" + invalidId))
                .andReturn();

        printResult("ID: " + invalidId, 404, result.getResponse().getStatus());
        assertEquals(404, result.getResponse().getStatus());
    }

    @Test
    void testFindAcomodacaoNonExistentId() {
        printTestHeader(11, "GET /acomodacoes/{id}", "ID inexistente");
        Integer id = 999;

        when(acomodacaoService.recuperarAcomodacao(id)).thenReturn(ResponseEntity.notFound().build());

        ResponseEntity<Acomodacao> response = acomodacaoController.findAcomodacao(id);
        printResult("ID: " + id, 404, response.getStatusCodeValue());
        assertEquals(404, response.getStatusCodeValue());
    }

    @Test
    void testUpdateHabilitadoFailure() {
        printTestHeader(12, "PATCH /acomodacoes/{id}/status}", "ID inexistente");

        when(acomodacaoService.habilitadoDesabilitado(999, true)).thenReturn(ResponseEntity.notFound().build());

        ResponseEntity<?> response = acomodacaoController.updateHabilitado(999, true);
        printResult("ID: 999", 404, response.getStatusCodeValue());
        assertEquals(404, response.getStatusCodeValue());
    }

    // ========= MÉTODOS AUXILIARES ========= //

    private void printTestHeader(int testNumber, String endpoint, String scenario) {
        System.out.printf("\n[TESTE %02d] %s\n", testNumber, endpoint);
        System.out.println("Cenário: " + scenario);
    }

    private void printResult(String dataSent, int expectedStatus, int receivedStatus) {
        System.out.println("Dados enviados: " + dataSent);
        System.out.printf("Status esperado: %d | Status recebido: %d\n", expectedStatus, receivedStatus);
        System.out.println("Resultado: " + (expectedStatus == receivedStatus ? "SUCESSO" : "FALHA") + "\n");
    }

    private String dtoToString(AcomodacaoDto dto) {
        return String.format("AcomodacaoDto[nome=%s, descricao=%s]", 
            dto.getNome(), dto.getDescricao());
    }

    private AcomodacaoDto createValidAcomodacaoDto() {
        AcomodacaoDto dto = new AcomodacaoDto();
        dto.setNome("Válida");
        dto.setDescricao("Descrição completa");
        dto.setCapacidade(2);
        dto.setPreco(100.0);
        dto.setHabilitado(true);
        dto.setAmenidades(new HashSet<>());
        return dto;
    }

    private Acomodacao createValidAcomodacao(Integer id) {
        Acomodacao ac = new Acomodacao();
        ac.setId(id);
        ac.setNome("Acomodação " + id);
        ac.setDescricao("Descrição detalhada");
        ac.setCapacidade(2);
        ac.setPreco(100.0);
        ac.setHabilitado(true);
        ac.setAmenidades(new HashSet<>());
        return ac;
    }
}