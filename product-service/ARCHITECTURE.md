# Product Service - Arquitetura

**Autores:** Nicole Fatuch, Jose Gabriel Kojo, Larissa Nichetti, Felipe Brugnera, Maria Fernanda  
**Disciplina:** Cloud - PUC-PR  
**Data:** Novembro 2025

---

## 📐 Arquitetura Implementada

Este serviço implementa **Clean Architecture** combinada com **Vertical Slice Architecture**, garantindo separação de responsabilidades, testabilidade e manutenibilidade.

---

## 🏗️ Clean Architecture - 4 Camadas

### 1. Domain Layer (Camada de Domínio)
**Localização:** `src/domain/`

**Responsabilidade:** Contém as regras de negócio puras, independentes de frameworks e infraestrutura.

**Componentes:**
- **Entities** (`entities/`): Objetos de negócio com validações
  - `Product.entity.js`: Entidade Produto com regras de validação
- **Repositories Interfaces** (`repositories/`): Contratos de persistência
  - `IProductRepository.js`: Interface do repositório de produtos

**Regra:** Esta camada NÃO pode depender de nenhuma outra camada.



---

### 2. Application Layer (Camada de Aplicação)
**Localização:** `src/application/`

**Responsabilidade:** Contém os casos de uso (lógica de aplicação). Orquestra o fluxo de dados entre camadas.

**Componentes:**
- **Use Cases** (`use-cases/`): Implementação dos casos de uso
  - `CreateProduct.usecase.js`: Criar produto
  - `GetAllProducts.usecase.js`: Listar produtos
  - `GetProductById.usecase.js`: Buscar por ID
  - `UpdateProduct.usecase.js`: Atualizar produto
  - `DeleteProduct.usecase.js`: Deletar produto

**Regra:** Depende apenas da camada Domain.


---

### 3. Infrastructure Layer (Camada de Infraestrutura)
**Localização:** `src/infrastructure/`

**Responsabilidade:** Implementações concretas de banco de dados, APIs externas, frameworks.

**Componentes:**
- **Database** (`database/mongoose/`):
  - `connection.js`: Conexão MongoDB Atlas
  - `ProductModel.js`: Schema Mongoose
  - `ProductRepository.js`: Implementação do IProductRepository

**Regra:** Implementa interfaces do Domain. Não deve ser importada por Presentation.

---

### 4. Presentation Layer (Camada de Apresentação)
**Localização:** `src/presentation/`

**Responsabilidade:** Adaptadores de interface (HTTP, GraphQL, CLI). Controllers e rotas.

**Componentes:**
- **Controllers** (`controllers/`):
  - `ProductController.js`: Controller de produtos
- **Routes** (`routes/`):
  - `product.routes.js`: Definição de rotas HTTP
- **Middlewares** (`middlewares/`):
  - `errorHandler.js`: Tratamento de erros

**Regra:** Depende de Application e Domain. Não conhece Infrastructure diretamente.


---

## 🔪 Vertical Slice Architecture

**Localização:** `src/features/products/`

**Conceito:** Organiza código por **features completas**, agrupando todas as camadas necessárias para uma funcionalidade específica.

**Estrutura:**
features/
└── products/
├── create/
│ └── index.js # Feature completa: UseCase + Controller
├── list/
│ └── index.js
├── get-by-id/
│ └── index.js
├── update/
│ └── index.js
└── delete/
└── index.js

**Vantagens:**
- ✅ Mudanças isoladas por feature
- ✅ Fácil adicionar/remover funcionalidades
- ✅ Time pode trabalhar em features paralelas
- ✅ Deploy independente de features


---

## 🧪 Testes Unitários de Arquitetura

**Localização:** `tests/architecture/`

Utilizamos **Jest** para validar automaticamente as regras arquiteturais.

**Testes implementados:**

1. ✅ Domain não depende de outras camadas
2. ✅ Application depende apenas de Domain
3. ✅ Infrastructure não depende de Presentation
4. ✅ Presentation não depende de Infrastructure
5. ✅ Use Cases seguem convenção `.usecase.js`
6. ✅ Entities possuem método `validate()`
7. ✅ Repository implementa interface correta

**Executar testes:**
npm test

**Resultado esperado:**
Test Suites: 1 passed, 1 total
Tests: 7 passed, 7 total

---

## 📊 Fluxo de Dados

HTTP Request
↓
[Presentation Layer]
→ ProductController
↓
[Features - Vertical Slice]
→ CreateProductFeature
↓
[Application Layer]
→ CreateProductUseCase
↓
[Domain Layer]
→ Product.entity (valida)
↓
[Application Layer]
→ productRepository.create()
↓
[Infrastructure Layer]
→ ProductRepository
→ ProductModel (Mongoose)
→ MongoDB Atlas
↓
Response ← ← ← ← ←

---

## 🗂️ Estrutura de Diretórios Completa

product-service/
├── src/
│ ├── domain/ # Camada de Domínio
│ │ ├── entities/
│ │ │ └── Product.entity.js
│ │ └── repositories/
│ │ └── IProductRepository.js
│ │
│ ├── application/ # Camada de Aplicação
│ │ └── use-cases/
│ │ ├── CreateProduct.usecase.js
│ │ ├── GetAllProducts.usecase.js
│ │ ├── GetProductById.usecase.js
│ │ ├── UpdateProduct.usecase.js
│ │ └── DeleteProduct.usecase.js
│ │
│ ├── infrastructure/ # Camada de Infraestrutura
│ │ └── database/
│ │ └── mongoose/
│ │ ├── connection.js
│ │ ├── ProductModel.js
│ │ └── ProductRepository.js
│ │
│ ├── presentation/ # Camada de Apresentação
│ │ ├── controllers/
│ │ │ └── ProductController.js
│ │ ├── routes/
│ │ │ └── product.routes.js
│ │ └── middlewares/
│ │ └── errorHandler.js
│ │
│ ├── features/ # Vertical Slices
│ │ └── products/
│ │ ├── create/
│ │ ├── list/
│ │ ├── get-by-id/
│ │ ├── update/
│ │ └── delete/
│ │
│ └── index.js # Entry Point
│
├── tests/
│ └── architecture/
│ └── layers.test.js # Testes de arquitetura
│
├── .env
├── jest.config.js
├── package.json
├── Dockerfile
└── ARCHITECTURE.md # Este arquivo

## 📚 Referências

- Clean Architecture (Robert C. Martin)
- Vertical Slice Architecture (Jimmy Bogard)
- Domain-Driven Design (Eric Evans)
- ArchUnit (Testes de Arquitetura)