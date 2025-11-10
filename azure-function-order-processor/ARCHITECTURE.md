# Azure Function - Order Event Processor

**Autores:** Nicole Fatuch, Jose Gabriel Kojo, Larissa Nichetti, Felipe Brugnera, Maria Fernanda  
**Disciplina:** Cloud Computing - PUC-PR  
**Data:** Novembro 2025

---

## 📐 Arquitetura Serverless

Esta Azure Function implementa **Event-Driven Architecture** usando **Serverless Computing**, processando eventos de pedidos publicados pelo Order-Service.

---

## 🎯 Responsabilidades

1. **Escutar eventos** de criação, atualização e deleção de pedidos
2. **Processar eventos** de forma assíncrona e escalável
3. **Executar ações** baseadas no tipo de evento:
   - Enviar emails de confirmação
   - Atualizar dashboards de analytics
   - Registrar logs de auditoria
   - Notificar sistemas externos

---

## 🏗️ Arquitetura Event-Driven

Order-Service
↓ (Cria pedido)
EventPublisher
↓ (Publica evento)
EventListener
↓ (HTTP POST)
Azure Function (Serverless)
↓ (Processa)
Ações: Email, Analytics, Logs

---

## 📋 Tipos de Eventos Suportados

### **1. ORDER_CREATED**
Disparado quando um novo pedido é criado.

**Payload:**
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

**Ações executadas:**
- ✅ Enviar email de confirmação para o cliente
- ✅ Atualizar dashboard de analytics
- ✅ Registrar log de auditoria

---

### **2. ORDER_UPDATED**
Disparado quando um pedido é atualizado.

**Payload:**
{
"type": "ORDER_UPDATED",
"timestamp": "2025-11-10T18:35:00.000Z",
"payload": {
"orderId": 8,
"status": "completed"
}
}


**Ações executadas:**
- ✅ Notificar cliente sobre mudança de status
- ✅ Atualizar métricas

---

### **3. ORDER_DELETED**
Disparado quando um pedido é deletado.

**Payload:**
{
"type": "ORDER_DELETED",
"timestamp": "2025-11-10T18:40:00.000Z",
"payload": {
"orderId": 8
}
}

**Ações executadas:**
- ✅ Registrar log de auditoria
- ✅ Atualizar estatísticas

---

## 🔧 Implementação

### **Trigger HTTP**
A função é acionada via **HTTP POST** no endpoint:
http://localhost:7071/api/OrderCreatedHandler (local)
https://<function-app>.azurewebsites.net/api/OrderCreatedHandler (produção)

### **Estrutura do Código**

module.exports = async function (context, req) {
// 1. Receber evento
const event = req.body;
// 2. Validar formato
if (!event || !event.type) {
    return { status: 400, body: { error: 'Invalid event' } };
}

// 3. Log detalhado
context.log('Event Type:', event.type);
context.log('Payload:', event.payload);

// 4. Processar baseado no tipo
switch (event.type) {
    case 'ORDER_CREATED':
        await processOrderCreated(context, event.payload);
        break;
    case 'ORDER_UPDATED':
        await processOrderUpdated(context, event.payload);
        break;
    case 'ORDER_DELETED':
        await processOrderDeleted(context, event.payload);
        break;
}

// 5. Retornar sucesso
return {
    status: 200,
    body: {
        message: 'Event processed successfully',
        eventType: event.type,
        processedAt: new Date().toISOString()
    }
};


---

## 📊 Fluxo de Processamento

### **Exemplo: Criação de Pedido**

**1. Order-Service cria pedido:**
// Salva no banco
const order = await orderRepository.create(orderData);

// Publica evento
eventPublisher.publishOrderCreated(order);

**2. EventListener captura evento:**
eventPublisher.on('orderCreated', async (event) => {
await sendToAzureFunction(event);
});

**3. Azure Function recebe via HTTP:**
POST http://127.0.0.1:7071/api/OrderCreatedHandler
Content-Type: application/json

{
"type": "ORDER_CREATED",
"timestamp": "2025-11-10T18:32:57.963Z",
"payload": { ... }
}

**4. Azure Function processa:**
🚀 Azure Function triggered: OrderCreatedHandler
📨 Event Type: ORDER_CREATED
✅ Processing ORDER_CREATED
Order ID: 8
Customer: Maria Silva
Total: 250
📧 Sending confirmation email to customer...
📊 Updating analytics dashboard...
✅ Order processed successfully!

**5. Retorna resposta:**
{
"message": "Event processed successfully",
"eventType": "ORDER_CREATED",
"processedAt": "2025-11-10T18:32:58.000Z"
}

---

## 🚀 Vantagens do Serverless

### **1. Escalabilidade Automática**
- Azure Functions escala automaticamente baseado na demanda
- Pode processar 1 ou 10.000 eventos simultaneamente

### **2. Custo Otimizado**
- **Pay-per-execution:** Paga apenas quando a função executa
- Sem custos de servidor ocioso
- Primeiro 1 milhão de execuções/mês é grátis

### **3. Alta Disponibilidade**
- Gerenciado pela Azure (99.95% SLA)
- Não precisa se preocupar com infraestrutura
- Failover automático

### **4. Desacoplamento**
- Order-Service não precisa esperar processamento
- Função pode falhar sem afetar criação do pedido
- Retry automático em caso de erro

---

## 🔗 Integração com Order-Service

### **Configuração no Order-Service**

**`.env`:**
AZURE_FUNCTION_URL=http://127.0.0.1:7071/api/OrderCreatedHandler

**EventListener.js:**
async sendToAzureFunction(event) {
const url = process.env.AZURE_FUNCTION_URL;
await axios.post(url, event, {
headers: { 'Content-Type': 'application/json' }
});
}

---

## 🧪 Testes

### **Teste Manual (Local):**

Iniciar Azure Function
func start

Testar diretamente
curl -X POST http://127.0.0.1:7071/api/OrderCreatedHandler
-H "Content-Type: application/json"
-d '{
"type": "ORDER_CREATED",
"timestamp": "2025-11-10T18:00:00.000Z",
"payload": {
"orderId": 999,
"customerName": "Test",
"total": 100,
"status": "pending"
}
}'

**Resposta esperada:**
{
"message": "Event processed successfully",
"eventType": "ORDER_CREATED",
"processedAt": "2025-11-10T18:00:01.000Z"
}

---

### **Teste via Order-Service:**

1. Iniciar Azure Function (Terminal 1)
cd azure-function-order-processor
func start

2. Iniciar Order-Service (Terminal 2)
cd order-service
npm start

3. Criar pedido (Terminal 3)
curl -X POST http://localhost:3002/orders
-H "Content-Type: application/json"
-d '{"customerName":"Test Integration","total":150.00,"status":"pending"}'

**Verificar logs:**
- Terminal 2: Deve mostrar "✅ Azure Function Response: Event processed successfully"
- Terminal 1: Deve processar o evento e mostrar emojis de confirmação

---

## 📁 Estrutura de Arquivos

azure-function-order-processor/
├── OrderCreatedHandler/
│ ├── function.json # Configuração do trigger HTTP
│ └── index.js # Lógica de processamento
├── host.json # Configuração global
├── local.settings.json # Variáveis de ambiente (local)
├── package.json
└── ARCHITECTURE.md # Este arquivo

---

## 🌐 Deploy na Azure (Opcional)

### **Criar Function App:**
az functionapp create
--name hortifruti-order-processor
--resource-group hortifruti-rg
--consumption-plan-location brazilsouth
--runtime node
--runtime-version 18
--functions-version 4

### **Deploy:**
func azure functionapp publish hortifruti-order-processor

### **URL de Produção:**
https://hortifruti-order-processor.azurewebsites.net/api/OrderCreatedHandler

---

## 📈 Monitoramento

### **Logs no Portal Azure:**
- Application Insights (métricas, logs, erros)
- Monitor → Function executions
- Latência, taxa de sucesso/falha

### **Logs Locais:**
func start --verbose

---

## 🔐 Segurança

### **AuthLevel: anonymous (desenvolvimento)**
Para produção, usar **function** ou **admin** level:

{
"authLevel": "function"
}

Gera uma chave de acesso que deve ser incluída na URL:
https://.../api/OrderCreatedHandler?code=FUNCTION_KEY

---

## 🎓 Conceitos Aplicados

- ✅ **Serverless Computing**
- ✅ **Event-Driven Architecture**
- ✅ **HTTP Triggers**
- ✅ **Asynchronous Processing**
- ✅ **Cloud-Native Development**
- ✅ **Pay-per-execution Model**
- ✅ **Auto-scaling**

---

## 🚀 Melhorias Futuras

- [ ] Adicionar Azure Service Bus para fila de eventos
- [ ] Implementar retry com exponential backoff
- [ ] Adicionar dead-letter queue para eventos com falha
- [ ] Integrar com SendGrid para emails reais
- [ ] Adicionar Application Insights para telemetria
- [ ] Implementar circuit breaker pattern

---

