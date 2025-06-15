# PROJETO APLICADO IV - POUSADA QUINTA DO YPUÃ

Este repositório contém o código-fonte de um sistema web desenvolvido para a gestão da Pousada Quinta do Ypuã.

A aplicação é hospedada online e pode ser acessada via navegador por meio de credenciais específicas.

---

## Sobre o Projeto

O sistema tem como objetivo facilitar o gerenciamento das operações diárias da pousada, oferecendo funcionalidades como:

- Autenticação de usuários via CPF e senha
- Cadastro e manutenção de clientes, usuários, reservas, acomodações e amenidades
- Controle de disponibilidade das acomodações em tempo real
- Visualização de dados gerenciais via dashboard integrado ao Power BI

Todo o acesso ao sistema é protegido por autenticação, garantindo segurança e controle de permissões.

---

## Como acessar o sistema online

<div align="center">
  <img src="qrcodes/Quinta%20do%20Ypu%C3%A3.png" alt="Imagem do QR Code Quinta do Ypuã" width="25%" />
</div>

<div align="center">
  https://hospedagem-frontend.onrender.com
</div>

## Credenciais de acesso:

- **CPF:** 32008729001
- **Senha:** 123456

> ⚠️ Obs.: Essas credenciais são exclusivas para fins acadêmicos e de demonstração. O uso fora desse contexto não é autorizado.

## Passo a passo:

1. Acesse o link do sistema pelo navegador.
2. Na tela de login, informe o CPF e a senha fornecidos acima.
3. Após o login, você terá acesso ao painel de gerenciamento da pousada.
4. Navegue pelas funcionalidades disponíveis como cadastro de reservas, clientes, acomodações e visualização de relatórios.

---

## Tecnologias utilizadas e justificativa das escolhas

Durante o desenvolvimento, foram utilizadas tecnologias que permitiram otimizar o tempo de entrega e reduzir a complexidade em diferentes etapas do projeto.

- Spring Boot: Utilizado para construção da API. A escolha se deu pela familiaridade prévia da equipe, pela robustez do Spring Security para a camada de segurança e pela extensa documentação, que facilitou a resolução de dúvidas durante o desenvolvimento.

- React: Adotado na construção da interface web pela sua popularidade, vasta documentação e pela possibilidade de criação de componentes reutilizáveis, o que acelerou o desenvolvimento do front-end.

- Bootstrap e Bootswatch: Ambos foram utilizados para a interface visual da aplicação. O Bootstrap auxiliou na criação de layouts responsivos e com componentes prontos, enquanto o Bootswatch facilitou a aplicação de temas visuais sem necessidade de customizações complexas.

- PostgreSQL: Escolhido como banco de dados por ser uma solução relacional gratuita, com bom desempenho, ampla compatibilidade com diferentes tecnologias e fácil integração com o Power BI.

- Power BI: Integrado para a construção de dashboards dinâmicos, permitindo a visualização dos dados da pousada em tempo real. Foi escolhido pela facilidade de integração com o PostgreSQL e pela familiaridade da equipe com a ferramenta.

- Git e GitHub: Utilizados para controle de versão e armazenamento do código-fonte. Ambos já eram ferramentas conhecidas pela equipe e oferecem integração direta com a plataforma de hospedagem escolhida.

- Render: Plataforma em nuvem utilizada para a publicação da aplicação. Foi escolhida por simplificar o processo de deploy, oferecer escalabilidade automática e disponibilizar um plano gratuito, suficiente para o escopo do projeto.

- Docker: Auxiliou na criação de ambientes isolados, especialmente na configuração da API, facilitando o deploy na Render.

- JUnit 5 e Mockito: Utilizados na construção dos testes unitários, permitindo validar o comportamento dos serviços de forma isolada e automatizada. Foram escolhidos pela integração fácil com o Maven e pelas boas práticas de mercado para projetos em Java.

Essas escolhas foram feitas com base em critérios como: facilidade de aprendizado, custo zero ou reduzido, compatibilidade entre as tecnologias, documentação disponível e experiência prévia da equipe.

---

## Funcionalidades principais

- Autenticação e controle de permissões
- Gestão de usuários, clientes, reservas, acomodações e amenidades
- Consulta de disponibilidade em tempo real
- Agenda diária e mensal das acomodações
- Dashboard dinâmico com dados da pousada

---

## Qualidade e Testes

Foram desenvolvidos:

- **32 testes unitários**, validando os principais serviços da aplicação
- **12 testes de integração**, garantindo a comunicação entre as camadas do sistema

Resultado: ✅ Todos os testes executados com sucesso.

---

## Equipe de Desenvolvimento

- Andrey Luiz Pereira  
- Luca Communello  
- Luiz Carlos Sousa da Fonseca  
- Paulo Henrique Bocardo  

---

## Observações finais

Este projeto é de caráter acadêmico, não sendo destinado a uso comercial. 
