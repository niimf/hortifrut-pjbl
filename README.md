# 🍎 Hortifrut - Sistema de Gestão Cloud

Projeto de arquitetura em nuvem desenvolvido como trabalho acadêmico, implementando um sistema completo de gestão de hortifruti com microserviços, MicroFrontEnd e Azure Functions.

## 📋 Índice

- [Sobre o Projeto](#sobre-o-projeto)
- [Arquitetura](#arquitetura)
- [Tecnologias Utilizadas](#tecnologias-utilizadas)
- [Pré-requisitos](#pré-requisitos)
- [Como Executar](#como-executar)
- [Endpoints da API](#endpoints-da-api)
- [Estrutura do Projeto](#estrutura-do-projeto)
- [Equipe](#equipe)

---

## 📖 Sobre o Projeto

Sistema distribuído para gestão de produtos e pedidos de hortifruti, implementando:

- **Arquitetura de Microserviços**: Serviços independentes e escaláveis
- **BFF (Backend for Frontend)**: Camada de agregação e autenticação
- **MicroFrontEnd**: Interface web moderna em React
- **Banco de Dados Híbrido**: MongoDB Atlas (NoSQL) + Azure SQL Database (SQL)
- **Azure Functions**: Processamento serverless de eventos
- **Containerização**: Todos os serviços dockerizados

---

## 🏗️ Arquitetura
;;

## 🚀 Tecnologias Utilizadas

### Backend
- **Node.js** v18.17.1
- **Express.js** - Framework web
- **JWT** - Autenticação e autorização
- **Mongoose** - ODM para MongoDB
- **MSSQL** - Driver para Azure SQL

### Frontend
- **React** 18
- **Vite** 4 - Build tool
- **Axios** - Cliente HTTP

### Banco de Dados
- **MongoDB Atlas** - Produtos (NoSQL)
- **Azure SQL Database** - Pedidos (SQL relacional)

### DevOps
- **Docker** - Containerização
- **Git/GitHub** - Controle de versão
- **Azure Functions** - Serverless computing

---

## ✅ Pré-requisitos

Antes de começar, você precisa ter instalado:

- [Node.js](https://nodejs.org/) v18.17+
- [npm](https://www.npmjs.com/) v9.6+
- [Git](https://git-scm.com/)
- [Docker](https://www.docker.com/) (opcional, para containerização)

---

## 🔧 Como Executar

### 1. Clonar o Repositório
git clone https://github.com/niimf/hortifrut-pjbl.git
cd hortifrut-pjbl

### 2. Configurar Variáveis de Ambiente

Crie arquivos `.env` em cada serviço:

**product-service/.env:**
MONGODB_URI=sua_connection_string_mongodb
PORT=3001

**order-service/.env:**
AZURE_SQL_CONN=sua_connection_string_azure_sql
PORT=3002

**bff-service/.env:**
PORT=4000
JWT_SECRET=sua_chave_secreta
PRODUCT_SERVICE_URL=http://localhost:3001
ORDER_SERVICE_URL=http://localhost:3002
FUNCTION_BASE_URL=url_das_azure_functions

### 3. Instalar Dependências e Executar

**Terminal 1 - Product Service:**
cd product-service
npm install
npm start

**Terminal 2 - Order Service:**
cd order-service
npm install
npm start

**Terminal 3 - BFF Service:**
cd bff-service
npm install
npm start

**Terminal 4 - MicroFrontEnd:**
cd microfrontend
npm install
npm run dev

### 4. Acessar a Aplicação

Abra o navegador em: [**http://localhost:5173**](http://localhost:5173)

---

## 🔑 Endpoints da API

### Autenticação

POST /auth/login
Content-Type: application/json

{
"username": "seu_usuario"
}

**Resposta:**
{
"token": "eyJhbGc...",
"message": "Login successful"
}

### Produtos (via BFF)

GET /api/products # Listar todos
POST /api/products # Criar produto
GET /api/products/:id # Buscar por ID
PUT /api/products/:id # Atualizar
DELETE /api/products/:id # Deletar

**Exemplo - Criar Produto:**
curl -X POST http://localhost:4000/api/products
-H "Authorization: Bearer SEU_TOKEN"
-H "Content-Type: application/json"
-d '{"name":"Maçã","price":5.50,"category":"Frutas","stock":100}'

### Pedidos (via BFF)

GET /api/orders # Listar todos
POST /api/orders # Criar pedido
GET /api/orders/:id # Buscar por ID
PUT /api/orders/:id # Atualizar
DELETE /api/orders/:id # Deletar

### Dashboard Agregado

GET /api/dashboard
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6InRlc3R1c2VyIiwiaWF0IjoxNzYxNTI3MzMzLCJleHAiOjE3NjE1MzQ1MzN9.kPv_cmHI_-b_aWcbPDUgM6CEhryi-mma4dX3jEpJ_iA"

**Resposta:**
{
"products": [...],
"orders": [...],
"functionStatus": {"status": "ok"}
}

---

## 📁 Estrutura do Projeto

hortifrut-pjbl/
├── product-service/ # Microserviço de Produtos
│ ├── src/
│ │ ├── config/ # Configurações
│ │ ├── models/ # Modelos MongoDB
│ │ ├── routes/ # Rotas da API
│ │ └── index.js # Servidor
│ ├── Dockerfile
│ └── package.json
│
├── order-service/ # Microserviço de Pedidos
│ ├── src/
│ │ ├── config/ # Configurações
│ │ ├── db/ # Schema SQL
│ │ ├── routes/ # Rotas da API
│ │ └── index.js # Servidor
│ ├── Dockerfile
│ └── package.json
│
├── bff-service/ # Backend for Frontend
│ ├── src/
│ │ ├── middleware/ # Autenticação JWT
│ │ ├── routes/ # Rotas (auth + api)
│ │ └── index.js # Servidor
│ ├── Dockerfile
│ └── package.json
│
├── microfrontend/ # Interface Web
│ ├── src/
│ │ ├── pages/ # Páginas (Login, Dashboard)
│ │ ├── services/ # Cliente API
│ │ └── App.jsx # Componente raiz
│ └── package.json
│
└── README.md # Este arquivo

---

## 👥 Equipe

- **Nicole Fatuch** - [@niimf](https://github.com/niimf)
- **Jose Gabriel Kojo**
- **Larissa Nichetti**
- **Felipe Brugnera**
- **Maria Fernanda**

---
## 📝 Licença

Este projeto foi desenvolvido para fins acadêmicos.

---

## 🎯 Funcionalidades Implementadas

- [x] MicroFrontEnd React
- [x] 2 Microserviços (Products + Orders)
- [x] BFF com autenticação JWT
- [x] Agregação de dados de múltiplas fontes
- [x] MongoDB Atlas (NoSQL)
- [x] Azure SQL Database (SQL)
- [x] Dockerfiles para todos os serviços
- [x] API RESTful completa
- [ ] Azure Functions (em desenvolvimento)
- [ ] Deploy em produção

---

## 📸 Screenshots

### Dashboard Principal
![Dashboard](docs/dashboard.png)

### Tela de Login
![Login](docs/login.png)

---

## 🤝 Como Contribuir

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/NovaFeature`)
3. Commit suas mudanças (`git commit -m 'Adiciona nova feature'`)
4. Push para a branch (`git push origin feature/NovaFeature`)
5. Abra um Pull Request

---

⭐️ Desenvolvido com 💚 para PUC-PR