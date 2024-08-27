# WebChat Microservice

## Visão Geral

Este microserviço de WebChat permite a comunicação em tempo real entre usuários por meio de sockets. Ele é construído com Node.js, Express, Socket.io, e Mongoose para o gerenciamento de conexões e persistência de mensagens. O serviço suporta autenticação baseada em chave de API e email do usuário, e armazena as mensagens trocadas entre os usuários em um banco de dados MongoDB.

Funcionalidades

- Autenticação: Os usuários são autenticados utilizando um email e uma chave de API (definida como ACCESS_TOKEN nas variáveis de ambiente).

- Mensagens Privadas: Os usuários podem enviar mensagens privadas entre si.

- Histórico de Mensagens: As mensagens são persistidas no banco de dados MongoDB, permitindo que os usuários recuperem conversas anteriores.

- Listagem de Mensagens: As mensagens trocadas entre dois usuários específicos podem ser recuperadas e listadas via uma rota HTTP.

## Endpoints

### Registro de Usuário

```bash
{
  "name": "Nome do Usuário",
  "email": "email@example.com",
  "password": "senha123"
}
```

Responses:

- 201 Created: Usuário criado com sucesso.
- 500 Internal Server Error: Erro ao criar o usuário.
- 401 Unauthorized: Token inválido.

Listagem de Mensagens Privadas
Rota: GET /personalMessages

Descrição: Recupera as mensagens trocadas entre dois usuários.

Headers:

x-api-key: Chave de API para autenticação.
Query Params:

emailA: Email do primeiro usuário.

emailB: Email do segundo usuário.

Responses:

200 OK: Retorna a lista de mensagens entre os usuários.
400 Bad Request: Ambos os emails são necessários.
404 Not Found: Usuário não encontrado.
500 Internal Server Error: Erro ao buscar as mensagens.
401 Unauthorized: Token inválido.
Variáveis de Ambiente
Certifique-se de criar um arquivo .env na raiz do projeto com as seguintes variáveis:

```bash
ACCESS_TOKEN=your_access_token_here
MONGODB_URI=mongodb://localhost:27017/your_db_name
PORT=3000
ACCESS_TOKEN: A chave de API usada para autenticação.
MONGODB_URI: A URI de conexão ao MongoDB.
PORT: Porta na qual o serviço estará rodando.
```

Instalação e Execução
Clone o repositório:

```bash
git clone https://github.com/seu-usuario/webchat-microservice.git
cd webchat-microservice
```

Instale as dependências:

```bash
yarn
```

Configure as variáveis de ambiente: Crie um arquivo .env na raiz do projeto e adicione as variáveis conforme descrito acima.

Inicie o servidor:

```bash
yarn dev
```

Acesse a aplicação: O servidor estará rodando em http://localhost:3000.

Tecnologias Utilizadas
Node.js
Express
Socket.io
Mongoose
TypeScript
Considerações Finais
Este microserviço foi desenvolvido com foco em comunicação em tempo real e serve como um exemplo prático de como implementar funcionalidades de chat com persistência de dados. Pode ser facilmente expandido para suportar funcionalidades mais avançadas como grupos de chat, mensagens de áudio, etc.
