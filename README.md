# 🍎 Hortifrut - Sistema de Gestão de Hortifrutigranjeiros

**Autores:** Nicole Fatuch, Jose Gabriel Kojo, Larissa Nichetti, Felipe Brugnera, Maria Fernanda  
**Disciplina:** Cloud - PUC-PR  
**Professor:** Manuel  
**Data:** Novembro 2025

---

## 📋 Sobre o Projeto

Sistema de microserviços para gestão de produtos e pedidos de uma empresa de hortifrutigranjeiros, implementando **Clean Architecture**, **Vertical Slice Architecture** e padrões de arquitetura de software modernos.

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
└───────────────────────┘ └─────────────────────────┘

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

## 🧪 Testes de Arquitetura

Cada microserviço possui **testes automatizados** que validam as regras arquiteturais:

Executar testes em cada serviço
cd product-service && npm test
cd order-service && npm test
cd bff-service && npm test

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

### **Opção 1: Execução Local**

#### **1. Instalar dependências em todos os serviços:**
cd product-service && npm install
cd ../order-service && npm install
cd ../bff-service && npm install
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

#### **3. Iniciar serviços (4 terminais):**

**Terminal 1:**
cd product-service
npm start

**Terminal 2:**
cd order-service
npm start


**Terminal 3:**
cd bff-service
npm start

#### **4. Acessar:**
- Frontend: http://localhost:5173
- BFF API: http://localhost:4000
- Product Service: http://localhost:3001
- Order Service: http://localhost:3002

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

### **Teste de Integração Manual:**
1. Fazer login
TOKEN=$(curl -s -X POST http://localhost:4000/auth/login
-H "Content-Type: application/json"
-d '{"username":"admin"}' | jq -r '.token')

2. Buscar dashboard agregado
curl http://localhost:4000/api/dashboard
-H "Authorization: Bearer $TOKEN"

---

## 🛠️ Tecnologias Utilizadas

### **Backend:**
- Node.js + Express.js
- MongoDB Atlas (Product Service)
- Azure SQL Database (Order Service)
- JWT (Autenticação)
- Axios (HTTP Client)
- Jest (Testes)

### **Frontend:**
- React 18
- Vite
- Axios
- React Router

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

---

## 📚 Documentação Adicional

Cada microserviço possui documentação detalhada:

- [Product Service Architecture](./product-service/ARCHITECTURE.md)
- [Order Service Architecture](./order-service/ARCHITECTURE.md)
- [BFF Service Architecture](./bff-service/ARCHITECTURE.md)

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

---

## 👥 Equipe

- **Nicole Fatuch** - Backend Development & Architecture & Testing
- **Jose Gabriel Kojo** - Backend Development
- **Larissa Nichetti** - Documentation
- **Felipe Brugnera** - 
- **Maria Fernanda** - 

---

## 📄 Licença

Este projeto foi desenvolvido como trabalho acadêmico para a disciplina de Cloud da PUC-PR.

---

**Desenvolvido com 💚 para PUC-PR | 2025**
