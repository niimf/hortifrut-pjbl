# BFF Service - Backend for Frontend (API Gateway)

**Autores:** Nicole Fatuch, Jose Gabriel Kojo, Larissa Nichetti, Felipe Brugnera, Maria Fernanda  
**Disciplina:** Cloud Computing - PUC-PR  
**Data:** Novembro 2025

---

## 📐 Arquitetura Implementada

Este serviço implementa **Clean Architecture** + **API Gateway Pattern** + **BFF Pattern** (Backend for Frontend), atuando como ponto único de entrada para o frontend e orquestrando requisições para os microserviços.

---

## 🎯 Responsabilidades do BFF

1. **Autenticação centralizada** (JWT)
2. **Roteamento** de requisições para microserviços
3. **Agregação de dados** de múltiplas fontes
4. **Transformação de respostas** para o formato do frontend
5. **Controle de acesso** via middleware

---

## 🏗️ Clean Architecture - 4 Camadas

### 1. Domain Layer (Camada de Domínio)
**Localização:** `src/domain/`

**Responsabilidade:** Entidades relacionadas à autenticação e contratos de gateway.

**Componentes:**
- **Entities** (`entities/`):
  - `User.entity.js`: Entidade de usuário autenticado
- **Repositories Interfaces** (`repositories/`):
  - `IGatewayRepository.js`: Contrato para comunicação com microserviços

**Exemplo:**
// User.entity.js
class User {
constructor({ username, token, createdAt }) {
this.username = username;
this.token = token;
this.createdAt = createdAt || new Date();
this.validate();
}

validate() {
if (!this.username) throw new Error('Username is required');
}
}

---

### 2. Application Layer (Camada de Aplicação)
**Localização:** `src/application/`

**Responsabilidade:** Casos de uso de autenticação, proxy e agregação.

**Use Cases:**
- `LoginUser.usecase.js`: Gerar token JWT
- `GetDashboard.usecase.js`: Agregar dados de produtos + pedidos
- `ProxyRequest.usecase.js`: Fazer proxy para microserviços

**Exemplo:**
// GetDashboard.usecase.js
async execute(token) {
const [products, orders] = await Promise.all([
this.gatewayRepository.getProducts(token),
this.gatewayRepository.getOrders(token)
]);

return {
products,
orders,
summary: {
totalProducts: products.length,
totalOrders: orders.length
}
};
}

---

### 3. Infrastructure Layer (Camada de Infraestrutura)
**Localização:** `src/infrastructure/`

**Responsabilidade:** Comunicação HTTP com microserviços e serviços de autenticação.

**Componentes:**
- **Gateway** (`gateway/`):
  - `GatewayRepository.js`: Cliente HTTP (Axios) para comunicação com microserviços
- **Auth** (`auth/`):
  - `JwtService.js`: Geração e validação de tokens JWT

**Configuração de URLs:**
this.productServiceUrl = process.env.PRODUCT_SERVICE_URL || 'http://localhost:3001';
this.orderServiceUrl = process.env.ORDER_SERVICE_URL || 'http://localhost:3002';

---

### 4. Presentation Layer (Camada de Apresentação)
**Localização:** `src/presentation/`

**Responsabilidade:** Rotas HTTP e middlewares de autenticação.

**Componentes:**
- **Routes** (`routes/`): `index.js` - Definição de rotas públicas e protegidas
- **Middlewares** (`middlewares/`):
  - `authMiddleware.js`: Validação JWT em rotas protegidas
  - `errorHandler.js`: Tratamento de erros

**Exemplo de proteção de rota:**
// Rota pública
router.post('/auth/login', (req, res) => authFeature.login(req, res));

// Rotas protegidas (requerem token)
router.get('/api/dashboard', authMiddleware, (req, res) =>
dashboardFeature.handle(req, res)
);

---

## 🔪 Vertical Slice Architecture

**Localização:** `src/features/`

Cada feature encapsula toda a lógica necessária:

features/
├── auth/ → AuthFeature (login, geração de token)
├── dashboard/ → DashboardFeature (agregação de dados)
├── products/ → ProductsFeature (proxy para product-service)
└── orders/ → OrdersFeature (proxy para order-service)

**Vantagem do BFF:** Cada feature pode transformar os dados de forma otimizada para o frontend específico.

---

## 🔐 Autenticação JWT

**Fluxo:**

1. **Cliente** → POST `/auth/login` com `{ "username": "admin" }`
2. **BFF** → Gera token JWT com payload `{ username, iat, exp }`
3. **BFF** → Retorna `{ "token": "eyJ..." }`
4. **Cliente** → Armazena token (localStorage/sessionStorage)
5. **Cliente** → Envia token em requisições: `Authorization: Bearer TOKEN`
6. **BFF** → Valida token no `authMiddleware`
7. **BFF** → Permite acesso aos recursos protegidos

**Configuração:**
JWT_SECRET=hortifrut_secret_key_2025

---

## 🌐 API Gateway Pattern

O BFF atua como **API Gateway**, centralizando:

### **Rotas Públicas:**
- `POST /auth/login` - Login e geração de token

### **Rotas Protegidas (requerem token):**
- `GET /api/dashboard` - Dados agregados de produtos + pedidos
- `GET /api/products` - Proxy para product-service
- `GET /api/orders` - Proxy para order-service
- `POST /api/orders` - Criar pedido via order-service

---

## 📊 Fluxo de Agregação de Dados (Dashboard)

Cliente Frontend
↓
GET /api/dashboard
Authorization: Bearer TOKEN
↓
[authMiddleware valida token]
↓
[DashboardFeature]
↓
[GetDashboardUseCase]
↓
Promise.all([
GatewayRepository.getProducts(token) → product-service:3001
GatewayRepository.getOrders(token) → order-service:3002
])
↓
Agregação:
{
products: [...],
orders: [...],
summary: { totalProducts, totalOrders }
}
↓
Response JSON ← ← ←

---

## 🧪 Testes de Arquitetura

**Localização:** `tests/architecture/layers.test.js`

**7 testes automatizados:**
1. ✅ Domain não depende de outras camadas
2. ✅ Application depende apenas de Domain
3. ✅ Infrastructure não depende de Presentation
4. ✅ Features encapsulam UseCase + Infrastructure
5. ✅ Entities possuem método `validate()`
6. ✅ GatewayRepository estende IGatewayRepository
7. ✅ authMiddleware valida JWT corretamente

**Executar:**
npm test

---

## 🗂️ Estrutura de Diretórios

bff-service/
├── src/
│ ├── domain/
│ │ ├── entities/
│ │ │ └── User.entity.js
│ │ └── repositories/
│ │ └── IGatewayRepository.js
│ ├── application/
│ │ └── use-cases/
│ │ ├── LoginUser.usecase.js
│ │ ├── GetDashboard.usecase.js
│ │ └── ProxyRequest.usecase.js
│ ├── infrastructure/
│ │ ├── auth/
│ │ │ └── JwtService.js
│ │ └── gateway/
│ │ └── GatewayRepository.js
│ ├── presentation/
│ │ ├── routes/
│ │ │ └── index.js
│ │ └── middlewares/
│ │ ├── authMiddleware.js
│ │ └── errorHandler.js
│ ├── features/
│ │ ├── auth/index.js
│ │ ├── dashboard/index.js
│ │ ├── products/index.js
│ │ └── orders/index.js
│ └── index.js
├── tests/
│ └── architecture/
│ └── layers.test.js
├── .env
├── jest.config.js
├── package.json
└── ARCHITECTURE.md

---

## 🚀 Como Executar

Instalar dependências
npm install

Executar BFF
npm start

Executar testes
npm test

---

## 🔗 Integração com Microserviços

**Variáveis de ambiente (.env):**
PORT=4000
JWT_SECRET=hortifrut_secret_key_2025
PRODUCT_SERVICE_URL=http://localhost:3001
ORDER_SERVICE_URL=http://localhost:3002

**Ordem de inicialização:**
1. Iniciar product-service (porta 3001)
2. Iniciar order-service (porta 3002)
3. Iniciar bff-service (porta 4000)

---

## 📈 Benefícios do BFF Pattern

- ✅ **Desacoplamento:** Frontend não conhece microserviços diretamente
- ✅ **Segurança:** Autenticação centralizada
- ✅ **Performance:** Agregação de dados reduz requisições do cliente
- ✅ **Flexibilidade:** Pode ter BFFs específicos (mobile, web, IoT)
- ✅ **Manutenibilidade:** Mudanças nos microserviços não afetam frontend

---