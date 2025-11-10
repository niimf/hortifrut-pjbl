# Order Service - Arquitetura

**Autores:** Nicole Fatuch, Jose Gabriel Kojo, Larissa Nichetti, Felipe Brugnera, Maria Fernanda  
**Disciplina:** Cloud Computing - PUC-PR  
**Data:** Novembro 2025

---

## 📐 Arquitetura Implementada

Este serviço implementa **Clean Architecture** combinada com **Vertical Slice Architecture**, garantindo separação de responsabilidades, testabilidade e manutenibilidade.

---

## 🏗️ Clean Architecture - 4 Camadas

### 1. Domain Layer (Camada de Domínio)
**Localização:** `src/domain/`

**Responsabilidade:** Contém as regras de negócio puras relacionadas a pedidos.

**Componentes:**
- **Entities** (`entities/`):
  - `Order.entity.js`: Entidade Pedido com validações de status e valores
- **Repositories Interfaces** (`repositories/`):
  - `IOrderRepository.js`: Interface do repositório de pedidos


---

### 2. Application Layer (Camada de Aplicação)
**Localização:** `src/application/`

**Responsabilidade:** Casos de uso relacionados a operações com pedidos.

**Componentes:**
- **Use Cases** (`use-cases/`):
  - `CreateOrder.usecase.js`: Criar novo pedido
  - `GetAllOrders.usecase.js`: Listar todos os pedidos
  - `GetOrderById.usecase.js`: Buscar pedido específico
  - `UpdateOrder.usecase.js`: Atualizar pedido
  - `DeleteOrder.usecase.js`: Deletar pedido

---

### 3. Infrastructure Layer (Camada de Infraestrutura)
**Localização:** `src/infrastructure/`

**Responsabilidade:** Implementação concreta com Azure SQL Database.

**Componentes:**
- **Database** (`database/mssql/`):
  - `connection.js`: Pool de conexão com Azure SQL
  - `OrderRepository.js`: Implementação do repositório com SQL queries

**Destaque:** Usa o driver `mssql` para comunicação com Azure SQL Server.


---

### 4. Presentation Layer (Camada de Apresentação)
**Localização:** `src/presentation/`

**Responsabilidade:** Endpoints HTTP e tratamento de requisições.

**Componentes:**
- **Controllers** (`controllers/`): `OrderController.js`
- **Routes** (`routes/`): `order.routes.js`
- **Middlewares** (`middlewares/`): `errorHandler.js`

---

## 🔪 Vertical Slice Architecture

**Localização:** `src/features/orders/`

Cada feature encapsula:
- UseCase (lógica)
- Controller (handler)
- Resposta formatada

**Estrutura:**
features/orders/
├── create/ → CreateOrderFeature
├── list/ → ListOrdersFeature
├── get-by-id/ → GetOrderByIdFeature
├── update/ → UpdateOrderFeature
└── delete/ → DeleteOrderFeature


**Vantagem:** Team pode trabalhar em features paralelas sem conflitos.

---

## 🗄️ Integração com Azure SQL

**Configuração:**
AZURE_SQL_SERVER=hortifruti-sql-server-pjbl.database.windows.net
AZURE_SQL_DATABASE=hortifruti-orders
AZURE_SQL_USER=adminhorti
AZURE_SQL_PASSWORD=Pjblhorti123!

**Schema esperado:**
CREATE TABLE orders (
id INT PRIMARY KEY IDENTITY(1,1),
customerName NVARCHAR(255) NOT NULL,
total DECIMAL(10,2) NOT NULL,
status NVARCHAR(50) NOT NULL,
createdAt DATETIME DEFAULT GETDATE()
);


---

## 🧪 Testes de Arquitetura

**Localização:** `tests/architecture/layers.test.js`

Validações automáticas:
1. ✅ Domain não depende de outras camadas
2. ✅ Application depende apenas de Domain
3. ✅ Infrastructure não depende de Presentation
4. ✅ Entities possuem método `validate()`
5. ✅ Repositories implementam interfaces

**Executar:**
npm test


---

## 📊 Fluxo de Dados

HTTP POST /orders
↓
[Presentation Layer]
→ OrderController
↓
[Features - Vertical Slice]
→ CreateOrderFeature
↓
[Application Layer]
→ CreateOrderUseCase
↓
[Domain Layer]
→ Order.entity (valida)
↓
[Infrastructure Layer]
→ OrderRepository
→ mssql Pool
→ Azure SQL Database
↓
Response JSON

---

## 🗂️ Estrutura de Diretórios

order-service/
├── src/
│ ├── domain/
│ │ ├── entities/
│ │ │ └── Order.entity.js
│ │ └── repositories/
│ │ └── IOrderRepository.js
│ ├── application/
│ │ └── use-cases/
│ │ ├── CreateOrder.usecase.js
│ │ ├── GetAllOrders.usecase.js
│ │ ├── GetOrderById.usecase.js
│ │ ├── UpdateOrder.usecase.js
│ │ └── DeleteOrder.usecase.js
│ ├── infrastructure/
│ │ └── database/
│ │ └── mssql/
│ │ ├── connection.js
│ │ └── OrderRepository.js
│ ├── presentation/
│ │ ├── controllers/
│ │ │ └── OrderController.js
│ │ ├── routes/
│ │ │ └── order.routes.js
│ │ └── middlewares/
│ │ └── errorHandler.js
│ ├── features/
│ │ └── orders/
│ │ ├── create/index.js
│ │ ├── list/index.js
│ │ ├── get-by-id/index.js
│ │ ├── update/index.js
│ │ └── delete/index.js
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

Executar serviço
npm start

Executar testes
npm test