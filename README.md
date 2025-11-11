# 🍎 Hortifrut - Sistema de Gestão de Hortifruti

**Autores:** Nicole Fatuch, Jose Gabriel Kojo, Larissa Nichetti, Felipe Brugnera, Maria Fernanda  
**Disciplina:** Cloud - PUC-PR  
**Professor:** Manoel  
**Data:** Novembro 2025

---

## 📋 Sobre o Projeto

Sistema de microserviços para gestão de produtos e pedidos de uma empresa de hortifrutigranjeiros, implementando **Clean Architecture**, **Vertical Slice Architecture**, **Event-Driven Architecture** e **Serverless Computing** com padrões de arquitetura de software modernos.


---

## 🏗️ Arquitetura de Microserviços

O projeto é composto por **3 microserviços independentes**:

┌─────────────────────────────────────────────────────┐
│ FRONTEND (React) │
│ (porta: 5173) │
└──────────────────────┬──────────────────────────────┘
│
↓
┌─────────────────────────────────────────────────────┐
│ BFF-SERVICE (API Gateway) │
│ (porta: 4000) │
│ - Autenticação JWT │
│ - Roteamento │
│ - Agregação de dados │
└────────────┬────────────────────────┬───────────────┘
│ │
↓ ↓
┌───────────────────────┐ ┌─────────────────────────┐
│ PRODUCT-SERVICE │ │ ORDER-SERVICE │
│ (porta: 3001) │ │ (porta: 3002) │
│ - CRUD de Produtos │ │ - CRUD de Pedidos │
│ - MongoDB Atlas │ │ - Azure SQL Database │
└───────────────────────┘ └───────────┬─────────────┘
│
┌───────────┴──────────┐
│ EVENT PUBLISHER │
│ (Event-Driven) │
└──────────┬───────────┘
│
↓
┌────────────────────────────┐
│ AZURE FUNCTION │
│ (Serverless - porta 7071) │
│ - Processa eventos │
│ - Envia emails │
│ - Atualiza analytics │
└────────────────────────────┘

---

## 🎯 Clean Architecture Implementada

Todos os microserviços seguem **Clean Architecture** com 4 camadas:

### **1. Domain Layer** (Camada de Domínio)
- Entidades de negócio
- Interfaces de repositórios
- Regras de negócio puras
- **Independente** de frameworks e infraestrutura

### **2. Application Layer** (Camada de Aplicação)
- Use Cases (casos de uso)
- Lógica de aplicação
- Orquestração de fluxo de dados
- Depende apenas de **Domain**

### **3. Infrastructure Layer** (Camada de Infraestrutura)
- Implementações de repositórios
- Conexões com bancos de dados
- Clientes HTTP (Axios)
- Depende de **Domain** e **Application**

### **4. Presentation Layer** (Camada de Apresentação)
- Controllers
- Rotas HTTP (Express)
- Middlewares
- Depende de **Application** e **Domain**

---

## 🔪 Vertical Slice Architecture

Complementa Clean Architecture organizando código por **features**:

features/
├── products/
│ ├── create/ → Feature completa de criação
│ ├── list/ → Feature completa de listagem
│ ├── get-by-id/ → Feature completa de busca
│ ├── update/ → Feature completa de atualização
│ └── delete/ → Feature completa de deleção


**Benefícios:**
- ✅ Mudanças isoladas por feature
- ✅ Deploy independente
- ✅ Times paralelos por feature
- ✅ Reduz conflitos de merge

---

## 📡 Event-Driven Architecture

### **Como Funciona:**

1. **Order-Service** cria/atualiza/deleta um pedido
2. **EventPublisher** publica evento (ORDER_CREATED, ORDER_UPDATED, ORDER_DELETED)
3. **EventListener** captura evento
4. **EventListener** envia para Azure Function via HTTP
5. **Azure Function** processa evento de forma assíncrona

### **Exemplo de Evento:**

{
"type": "ORDER_CREATED",
"timestamp": "2025-11-10T18:32:57.963Z",
"payload": {
"orderId": 8,
"customerName": "Maria Silva",
"total": 250.00,
"status": "pending"
}
}

### **Vantagens:**
- ✅ **Desacoplamento:** Serviços não dependem diretamente um do outro
- ✅ **Escalabilidade:** Processa eventos de forma assíncrona
- ✅ **Resiliência:** Falha na Azure Function não impede criação de pedidos
- ✅ **Extensibilidade:** Fácil adicionar novos listeners

---

## ☁️ Serverless Computing (Azure Functions)

### **OrderCreatedHandler Function**

**Trigger:** HTTP POST  
**Porta Local:** 7071  
**Produção:** Azure Cloud

**Responsabilidades:**
- Escutar eventos de pedidos
- Enviar emails de confirmação
- Atualizar dashboards de analytics
- Registrar logs de auditoria

**Vantagens do Serverless:**
- 💰 **Pay-per-execution:** Paga apenas quando executa
- 🚀 **Auto-scaling:** Escala automaticamente
- 🛠️ **Zero infraestrutura:** Gerenciado pela Azure
- ⚡ **Alta disponibilidade:** 99.95% SLA

---

## 🧪 Testes de Arquitetura

Cada microserviço possui **testes automatizados** que validam as regras arquiteturais:

Executar testes em cada serviço
cd product-service && npm test # 7 testes
cd order-service && npm test # 7 testes
cd bff-service && npm test # 7 testes

**Regras validadas:**
1. ✅ Domain não depende de outras camadas
2. ✅ Application depende apenas de Domain
3. ✅ Infrastructure não depende de Presentation
4. ✅ Entities possuem método `validate()`
5. ✅ Use Cases seguem convenção `.usecase.js`
6. ✅ Repositories implementam interfaces
7. ✅ Features encapsulam lógica completa

**Resultado esperado:** 21 testes passando (7 por serviço)

---

## 📦 Estrutura do Projeto

hortifrut-pjbl/
├── product-service/ # Microserviço de Produtos
│ ├── src/
│ │ ├── domain/ # Camada de Domínio
│ │ │ ├── entities/
│ │ │ └── repositories/
│ │ ├── application/ # Camada de Aplicação
│ │ │ └── use-cases/
│ │ ├── infrastructure/ # Camada de Infraestrutura
│ │ │ └── database/
│ │ ├── presentation/ # Camada de Apresentação
│ │ │ ├── controllers/
│ │ │ ├── routes/
│ │ │ └── middlewares/
│ │ ├── features/ # Vertical Slices
│ │ └── index.js
│ ├── tests/
│ │ └── architecture/
│ ├── ARCHITECTURE.md
│ ├── Dockerfile
│ └── package.json
│
├── order-service/ # Microserviço de Pedidos
│ ├── src/
│ │ ├── domain/
│ │ ├── application/
│ │ ├── infrastructure/
│ │ │ ├── database/
│ │ │ └── events/ # ⭐ Event Publisher & Listener
│ │ ├── presentation/
│ │ ├── features/
│ │ └── index.js
│ ├── tests/
│ ├── ARCHITECTURE.md
│ ├── Dockerfile
│ └── package.json
│
├── bff-service/ # Backend for Frontend (API Gateway)
│ ├── src/
│ │ ├── domain/
│ │ ├── application/
│ │ ├── infrastructure/
│ │ │ ├── auth/ # JWT Service
│ │ │ └── gateway/ # HTTP Client
│ │ ├── presentation/
│ │ ├── features/
│ │ └── index.js
│ ├── tests/
│ ├── ARCHITECTURE.md
│ ├── Dockerfile
│ └── package.json
│
├── azure-function-order-processor/ # ⭐ Azure Function (Serverless)
│ ├── OrderCreatedHandler/
│ │ ├── function.json
│ │ └── index.js
│ ├── host.json
│ ├── local.settings.json
│ ├── ARCHITECTURE.md
│ └── package.json
│
├── frontend/ # Frontend React
│ ├── src/
│ ├── Dockerfile
│ └── package.json
│
├── docker-compose.yml
└── README.md # Este arquivo

---

## 🚀 Como Executar

### **Pré-requisitos**
- Node.js 18+
- Docker (opcional)
- MongoDB Atlas (configurado)
- Azure SQL Database (configurado)
- Azure Functions Core Tools

### **Opção 1: Execução Local**

#### **1. Instalar dependências em todos os serviços:**
cd product-service && npm install
cd ../order-service && npm install
cd ../bff-service && npm install
cd ../azure-function-order-processor && npm install
cd ../frontend && npm install

#### **2. Configurar variáveis de ambiente:**

**product-service/.env:**
PORT=3001
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/hortifruti

**order-service/.env:**
PORT=3002
AZURE_SQL_SERVER=hortifruti-sql-server-pjbl.database.windows.net
AZURE_SQL_DATABASE=hortifruti-orders
AZURE_SQL_USER=adminhorti
AZURE_SQL_PASSWORD=Pjblhorti123!

**bff-service/.env:**
PORT=4000
JWT_SECRET=hortifrut_secret_key_2025
PRODUCT_SERVICE_URL=http://localhost:3001
ORDER_SERVICE_URL=http://localhost:3002

#### **3. Iniciar serviços (5 terminais):**

**Terminal 1 - Azure Function:**
cd azure-function-order-processor
func start

**Terminal 2 - Product Service:**
cd product-service
npm start

**Terminal 3 - Order Service:**
cd order-service
npm start

**Terminal 4 - BFF Service:**
cd bff-service
npm start

**Terminal 5 - Frontend:**
cd frontend
npm run dev

#### **4. Acessar:**
- Frontend: http://localhost:5173
- BFF API: http://localhost:4000
- Product Service: http://localhost:3001
- Order Service: http://localhost:3002
- Azure Function: http://localhost:7071

---

### **Opção 2: Docker Compose**

Executar todos os serviços
docker-compose up --build

Parar serviços
docker-compose down

---

## 🔐 Autenticação

O sistema usa **JWT (JSON Web Tokens)** para autenticação:

1. **Login:**
curl -X POST http://localhost:4000/auth/login
-H "Content-Type: application/json"
-d '{"username":"admin"}'

2. **Resposta:**
{
"success": true,
"token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
"message": "Login successful"
}

3. **Usar token nas requisições:**
curl http://localhost:4000/api/products
-H "Authorization: Bearer SEU_TOKEN_AQUI"

---

## 🧪 Testes

### **Testes de Arquitetura:**
Product Service
cd product-service && npm test

Order Service
cd order-service && npm test

BFF Service
cd bff-service && npm test

### **Teste de Event-Driven + Azure Function:**

**1. Iniciar Azure Function e Order Service**

**2. Criar pedido:**
curl -X POST http://localhost:3002/orders
-H "Content-Type: application/json"
-d '{"customerName":"Test Event","total":150.00,"status":"pending"}'

**3. Verificar logs:**
- **Order-Service:** Deve mostrar "✅ Azure Function Response: Event processed successfully"
- **Azure Function:** Deve mostrar "🚀 Azure Function triggered: OrderCreatedHandler"

**4. Ver eventos acumulados:**
curl http://localhost:3002/events

---

## 🔄 Fluxo Completo de Criação de Pedido
Frontend → POST /auth/login
↓

BFF → Gera token JWT
↓

Frontend → POST /api/orders (com token)
↓

BFF → Valida token → Proxy para order-service
↓

Order-Service → Salva pedido no Azure SQL
↓

Order-Service → Publica evento ORDER_CREATED
↓

EventListener → Captura evento
↓

EventListener → POST para Azure Function
↓

Azure Function → Processa evento
├─→ Envia email de confirmação
├─→ Atualiza analytics
└─→ Registra log
↓

BFF → Retorna sucesso para frontend

**Tempo total:** ~50-100ms ⚡

---

## 🛠️ Tecnologias Utilizadas

### **Backend:**
- Node.js + Express.js
- MongoDB Atlas (Product Service)
- Azure SQL Database (Order Service)
- JWT (Autenticação)
- Axios (HTTP Client)
- Jest (Testes)
- EventEmitter (Event-Driven)

### **Frontend:**
- React 18
- Vite
- Axios
- React Router

### **Serverless:**
- Azure Functions
- Azure Functions Core Tools

### **DevOps:**
- Docker + Docker Compose
- Git + GitHub
- Azure Cloud Services

### **Arquitetura:**
- Clean Architecture
- Vertical Slice Architecture
- API Gateway Pattern
- BFF (Backend for Frontend)
- Microservices Pattern
- Event-Driven Architecture
- Serverless Computing

---

## 📚 Documentação Adicional

Cada componente possui documentação detalhada:

- [Product Service Architecture](./product-service/ARCHITECTURE.md)
- [Order Service Architecture](./order-service/ARCHITECTURE.md)
- [BFF Service Architecture](./bff-service/ARCHITECTURE.md)
- [Azure Function Architecture](./azure-function-order-processor/ARCHITECTURE.md)

---

## 🎓 Aprendizados

### **Clean Architecture:**
- Separação clara de responsabilidades
- Independência de frameworks
- Testabilidade aumentada
- Facilidade de manutenção

### **Microserviços:**
- Escalabilidade independente
- Deploy isolado
- Resiliência (falha de um não afeta outros)
- Tecnologias heterogêneas (MongoDB + Azure SQL)

### **API Gateway:**
- Ponto único de entrada
- Autenticação centralizada
- Agregação de dados
- Redução de requisições do cliente

### **Event-Driven Architecture:**
- Desacoplamento entre serviços
- Processamento assíncrono
- Resiliência e extensibilidade
- Fácil adicionar novos consumidores de eventos

### **Serverless Computing:**
- Custo otimizado (pay-per-execution)
- Escalabilidade automática
- Zero gerenciamento de infraestrutura
- Alta disponibilidade

---

## 👥 Equipe

- **Nicole Fatuch** - Backend Development & Architecture & Frontend Development & Testing
- **Jose Gabriel Kojo** - Backend Development & Testing
- **Larissa Nichetti** - Documentation
- **Felipe Brugnera** - Support with Documentation
- **Maria Fernanda** - 

---

## 📄 Licença

Este projeto foi desenvolvido como trabalho acadêmico para a disciplina de Cloud da PUC-PR.

---

