                    HORTIFRUT - SISTEMA DE GESTÃO CLOUD

Sistema distribuído para gestão de produtos e pedidos de hortifruti, 
desenvolvido como projeto acadêmico da disciplina de Arquitetura em Nuvem. 
Implementa arquitetura de microserviços completa com MicroFrontEnd, 
Backend for Frontend (BFF), e Azure Functions.

Status: 100% funcional
Azure Functions: operacional
MongoDB Atlas: connected
Azure SQL: connected

                              ÍNDICE

1. Sobre o Projeto
2. Arquitetura
3. Tecnologias Utilizadas
4. Pré-requisitos
5. Como Executar
6. Endpoints da API
7. Azure Functions
8. Estrutura do Projeto
9. Equipe

                         SOBRE O PROJETO

Sistema completo de gestão para hortifruti que demonstra a implementação 
prática de conceitos avançados de arquitetura em nuvem.

CARACTERÍSTICAS PRINCIPAIS:

- Arquitetura de Microserviços: Serviços independentes e escaláveis
- Database Polyglot: MongoDB (NoSQL) + Azure SQL (SQL relacional)
- BFF Pattern: Backend for Frontend com agregação de dados
- Serverless Computing: Azure Functions para processamento assíncrono
- MicroFrontEnd: Interface web moderna em React
- Autenticação JWT: Segurança e autorização
- Containerização: Todos os serviços dockerizados

                            ARQUITETURA

FLUXO DE DADOS:

    MicroFrontEnd (React)
    http://localhost:5173
    • Login com JWT
    • Dashboard agregado
    • Interface responsiva
           |
           v
    BFF Service (Node.js + JWT)
    http://localhost:4000
    • Autenticação e autorização
    • Agregação de dados
    • Proxy reverso
           |
    +------+------+----------+----------+
    |      |      |          |          |
    v      v      v          v          v
Product Order Azure    Azure
Service Service Func1  Func2
:3001   :3002  (Event) (Notification)
   |      |
   v      v
MongoDB  Azure SQL
Atlas    Database
(NoSQL)  (SQL)

                      TECNOLOGIAS UTILIZADAS=

BACKEND:
- Node.js v18.17.1 - Runtime JavaScript
- Express.js - Framework web minimalista
- JWT (jsonwebtoken) - Autenticação e autorização
- Mongoose - ODM para MongoDB
- MSSQL - Driver para Azure SQL Server
- Axios - Cliente HTTP
- Cors - Cross-Origin Resource Sharing
- Dotenv - Gerenciamento de variáveis de ambiente

FRONTEND:
- React 18 - Biblioteca UI
- Vite 4 - Build tool e dev server
- Axios - Cliente HTTP
- LocalStorage - Gestão de sessão

BANCO DE DADOS:
- MongoDB Atlas
  Cluster: hortifrut-cluster
  Região: São Paulo, Brasil
  Collection: products

- Azure SQL Database
  Server: hortifruti-sql-server-pjbl
  Database: hortifruti-orders
  Região: Brazil South

CLOUD SERVICES:
- Azure Functions
  Function App: hortifruti-functions-pjbl
  Runtime: Node.js 18
  Região: Brazil South

DEVOPS:
- Docker - Containerização
- Git/GitHub - Controle de versão
- npm - Gerenciador de pacotes

                          PRÉ-REQUISITOS

- Node.js v18.17+
- npm v9.6+
- Git
- Docker (opcional)

                          COMO EXECUTAR

1. CLONAR O REPOSITÓRIO

git clone https://github.com/niimf/hortifrut-pjbl.git
cd hortifrut-pjbl

2. CONFIGURAR VARIÁVEIS DE AMBIENTE

product-service/.env:
MONGODB_URI=mongodb+srv://usuario:senha@hortifrut-cluster.tv4fpme.mongodb.net/hortifrut
PORT=3001

order-service/.env:
AZURE_SQL_SERVER=hortifruti-sql-server-pjbl.database.windows.net
AZURE_SQL_DATABASE=hortifruti-orders
AZURE_SQL_USER=adminhorti
AZURE_SQL_PASSWORD=sua_senha
PORT=3002

bff-service/.env:
PORT=4000
JWT_SECRET=hortifrut_secret_key_2025
PRODUCT_SERVICE_URL=http://localhost:3001
ORDER_SERVICE_URL=http://localhost:3002
FUNCTION_BASE_URL=https://hortifruti-functions-pjbl.azurewebsites.net

3. INSTALAR DEPENDÊNCIAS E EXECUTAR

TERMINAL 1 - Product Service:
cd product-service
npm install
npm start

TERMINAL 2 - Order Service:
cd order-service
npm install
npm start

TERMINAL 3 - BFF Service:
cd bff-service
npm install
npm start

TERMINAL 4 - MicroFrontEnd:
cd microfrontend
npm install
npm run dev

4. ACESSAR A APLICAÇÃO

Abra o navegador em: http://localhost:5173

Credenciais de teste:
Username: qualquer nome (ex: admin, teste, etc.)
O sistema gerará um token JWT automaticamente

                        ENDPOINTS DA API

AUTENTICAÇÃO

Login:
POST /auth/login
Content-Type: application/json
Body: {"username": "seu_usuario"}

Resposta:
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "message": "Login successful"
}

PRODUTOS (via BFF)

Todos os endpoints requerem header: Authorization: Bearer TOKEN

GET    /api/products           - Listar todos os produtos
POST   /api/products           - Criar novo produto
GET    /api/products/:id       - Buscar produto por ID
PUT    /api/products/:id       - Atualizar produto
DELETE /api/products/:id       - Deletar produto

Exemplo - Criar Produto:
curl -X POST http://localhost:4000/api/products \
  -H "Authorization: Bearer SEU_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Maçã Fuji",
    "price": 8.90,
    "category": "Frutas",
    "stock": 100
  }'

PEDIDOS (via BFF)

GET    /api/orders             - Listar todos os pedidos
POST   /api/orders             - Criar novo pedido
GET    /api/orders/:id         - Buscar pedido por ID
PUT    /api/orders/:id         - Atualizar pedido
DELETE /api/orders/:id         - Deletar pedido

Exemplo - Criar Pedido:
curl -X POST http://localhost:4000/api/orders \
  -H "Authorization: Bearer SEU_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "customerName": "Maria Silva",
    "total": 250.00
  }'

DASHBOARD AGREGADO

GET /api/dashboard
Authorization: Bearer TOKEN

Resposta:
{
  "products": [...],
  "orders": [...],
  "functionStatus": {
    "ok": true,
    "message": "notification-service up"
  }
}

                         AZURE FUNCTIONS

FUNCTION 1: Event Processor

Endpoint: POST /api/event-processor
URL: https://hortifruti-functions-pjbl.azurewebsites.net/api/event-processor

Função: Processa eventos de criação de pedidos de forma assíncrona

Exemplo de uso direto:
curl -X POST https://hortifruti-functions-pjbl.azurewebsites.net/api/event-processor \
  -H "Content-Type: application/json" \
  -d '{"orderId":123,"customer":"João Silva"}'

Exemplo via BFF (autenticado):
curl -X POST http://localhost:4000/api/orders/event \
  -H "Authorization: Bearer SEU_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"orderId":123,"customer":"João Silva"}'

Resposta esperada:
{
  "ok": true,
  "id": "68ffef04b9bc96cc4624f2dcb"
}

FUNCTION 2: Notification Service

Endpoint: GET /api/notification-service
URL: https://hortifruti-functions-pjbl.azurewebsites.net/api/notification-service

Função: Serviço de notificações e health check das Azure Functions

Exemplo de uso:
curl https://hortifruti-functions-pjbl.azurewebsites.net/api/notification-service?ping=true

Resposta esperada:
{
  "ok": true,
  "message": "notification-service up"
}

                      ESTRUTURA DO PROJETO

hortifrut-pjbl/
├── product-service/              Microserviço de Produtos
│   ├── src/
│   │   ├── config/
│   │   │   └── db.js            Configuração MongoDB
│   │   ├── models/
│   │   │   └── Product.js       Schema Mongoose
│   │   ├── routes/
│   │   │   └── products.js      Rotas CRUD
│   │   └── index.js             Servidor Express
│   ├── .env
│   ├── Dockerfile
│   └── package.json
│
├── order-service/                Microserviço de Pedidos
│   ├── src/
│   │   ├── config/
│   │   │   └── db.js            Configuração Azure SQL
│   │   ├── db/
│   │   │   └── schema.sql       Schema SQL
│   │   ├── routes/
│   │   │   └── orders.js        Rotas CRUD
│   │   └── index.js             Servidor Express
│   ├── .env
│   ├── Dockerfile
│   └── package.json
│
├── bff-service/                  Backend for Frontend
│   ├── src/
│   │   ├── middleware/
│   │   │   └── auth.js          Middleware JWT
│   │   ├── routes/
│   │   │   ├── auth.routes.js   Rotas de autenticação
│   │   │   └── api.routes.js    Proxy e agregação
│   │   └── index.js             Servidor Express
│   ├── .env
│   ├── Dockerfile
│   └── package.json
│
├── microfrontend/                Interface Web React
│   ├── src/
│   │   ├── pages/
│   │   │   ├── Login.jsx        Página de login
│   │   │   └── Dashboard.jsx    Dashboard principal
│   │   ├── services/
│   │   │   └── api.js           Cliente API
│   │   ├── App.jsx              Componente raiz
│   │   └── main.jsx             Entry point
│   ├── index.html
│   └── package.json
│
└── README.md                     Este arquivo

                    FUNCIONALIDADES IMPLEMENTADAS

BACKEND:
✓ 3 Microserviços independentes (Product, Order, BFF)
✓ 2 Azure Functions serverless
✓ Autenticação JWT completa
✓ Agregação de dados de múltiplas fontes
✓ Proxy reverso no BFF
✓ CRUD completo de produtos
✓ CRUD completo de pedidos
✓ Health checks

BANCO DE DADOS:
✓ MongoDB Atlas (NoSQL) - 5 produtos cadastrados
✓ Azure SQL Database (SQL) - 2 pedidos cadastrados
✓ Schemas definidos e validados
✓ Conexões seguras e estáveis

FRONTEND:
✓ MicroFrontEnd em React
✓ Dashboard agregado em tempo real
✓ Autenticação e gestão de sessão
✓ Interface responsiva
✓ Indicadores visuais de status
✓ Listagem de produtos e pedidos
✓ Logout funcional

CLOUD & DEVOPS:
✓ Dockerfiles para todos os serviços
✓ Código versionado no GitHub
✓ Variáveis de ambiente configuradas
✓ Firewall e segurança configurados
✓ APIs RESTful testadas
✓ Documentação completa

                          COMO TESTAR

TESTE COMPLETO VIA TERMINAL:

# 1. Login
TOKEN=$(curl -s -X POST http://localhost:4000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"teste"}' | jq -r '.token')

# 2. Listar produtos
curl http://localhost:4000/api/products \
  -H "Authorization: Bearer $TOKEN"

# 3. Listar pedidos
curl http://localhost:4000/api/orders \
  -H "Authorization: Bearer $TOKEN"

# 4. Dashboard agregado
curl http://localhost:4000/api/dashboard \
  -H "Authorization: Bearer $TOKEN"

# 5. Criar pedido via Azure Function
curl -X POST http://localhost:4000/api/orders/event \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"orderId":999,"customer":"Teste"}'

TESTE VIA INTERFACE WEB:

1. Acesse: http://localhost:5173
2. Faça login com qualquer username
3. Visualize o dashboard com:
   - 5 produtos do MongoDB
   - 2 pedidos do Azure SQL
   - Status "notification-service up" das Functions

                              EQUIPE

Nicole Fatuch - @niimf - Backend, BFF, MicroFrontEnd
Jose Gabriel Kojo - Azure Functions, Infraestrutura Azure
Larissa Nichetti - Atualização do documento Arc 42 e diagramas
Felipe Brugnera -
Maria Fernanda -


Instituição: PUC-PR
Disciplina: Cloud
Período: 6o | 2025.2

                        STATUS DO PROJETO

Progresso: 100% COMPLETO

✓ Infraestrutura cloud configurada
✓ Microserviços implementados
✓ Azure Functions integradas e operacionais
✓ Frontend funcional
✓ Documentação completa
✓ Testes realizados e validados
✓ Todos os requisitos atendidos

                            LINKS ÚTEIS

Repositório: https://github.com/niimf/hortifrut-pjbl
MongoDB Atlas: https://cloud.mongodb.com
Azure Portal: https://portal.azure.com
Azure Functions: https://hortifruti-functions-pjbl.azurewebsites.net


Desenvolvido com 💚 para PUC-PR | 2025
