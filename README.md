# Order API

REST API para gerenciamento de pedidos com autenticação JWT. Construída com Node.js, Express e PostgreSQL.

---

## Tecnologias

| Tecnologia | Versão |
|------------|--------|
| Node.js    | >= 18  |
| Express    | ^5.2   |
| Knex       | ^3.1   |
| PostgreSQL | >= 14  |
| JWT        | ^9.0   |
| bcryptjs   | ^3.0   |

---

## Estrutura do Projeto

```
src/
├── app/
│   └── app.js                  # Configuração do Express
├── config/
│   └── swaggert.js             # Configuração do Swagger UI
├── database/
│   ├── connection.js           # Instância do Knex
│   ├── createDatabase.js       # Script de criação do banco
│   ├── migrations/             # Tabelas: users, orders, order_items
│   └── seeds/
│       └── 01_admin_user.js    # Dados fictícios para testes
├── docs/
│   └── swagger.yaml            # Documentação OpenAPI
├── middlewares/
│   └── authenticate.js         # Middleware JWT
├── modules/
│   ├── auth/
│   │   ├── controllers/
│   │   ├── repositories/
│   │   ├── routes/
│   │   └── services/
│   └── order/
│       ├── controllers/
│       ├── mappers/
│       ├── repositories/
│       ├── routes/
│       └── services/
├── routes/
│   └── index.js                # Roteador raiz
└── server.js                   # Ponto de entrada
```

---

## Pré-requisitos

- Node.js >= 18
- PostgreSQL rodando localmente (padrão: `localhost:5432`)
- pnpm (recomendado) ou npm

---

## Configuração

Crie um arquivo `.env` na raiz do projeto com as seguintes variáveis:

```env
PORT=3000

DB_HOST=127.0.0.1
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=postgres
DB_NAME=order_api

JWT_SECRET=sua_chave_secreta
JWT_EXPIRES_IN=1d
```

---

## Instalação

```bash
pnpm install
```

---

## Scripts

| Script           | Descrição |
|------------------|-----------|
| `pnpm start:dev` | Setup completo + servidor (use na **primeira execução**) |
| `pnpm dev`       | Inicia apenas o servidor com hot-reload |
| `pnpm migrate`   | Executa as migrations pendentes |
| `pnpm seed`      | Popula o banco com dados fictícios |

---

## Primeira Execução — `start:dev`

> Use este comando ao rodar o projeto pela primeira vez ou após resetar o banco de dados.

```bash
pnpm start:dev
```

Este comando executa **automaticamente e em sequência**:

1. **Cria o banco de dados** `order_api` (se não existir)
2. **Executa as migrations** — cria as tabelas `users`, `orders` e `order_items`
3. **Executa os seeds** — popula o banco com dados fictícios prontos para teste
4. **Inicia o servidor** com hot-reload via Nodemon

### Credenciais geradas pelos seeds

Após o `start:dev`, os seguintes dados estarão disponíveis para teste imediato:

**Usuário Admin**

| Campo  | Valor         |
|--------|---------------|
| E-mail | `admin@admin` |
| Senha  | `123`         |

**Pedidos fictícios**

| Número do Pedido   | Total     | Status      | Data       |
|--------------------|-----------|-------------|------------|
| `v10089015vdb-01`  | R$ 100,00 | `pending`   | 19/02/2026 |
| `v10089015vdb-02`  | R$ 50,00  | `completed` | 10/02/2026 |

> Para iniciar o servidor em execuções subsequentes, use `pnpm dev` para evitar re-executar migrations e seeds desnecessariamente.

---

## Endpoints

### Autenticação — `/auth`

#### `POST /auth/register` — Cadastrar usuário

**Body:**
```json
{
  "name": "João Silva",
  "email": "joao@email.com",
  "password": "senha123"
}
```

**Resposta `201`:**
```json
{
  "id": 2,
  "name": "João Silva",
  "email": "joao@email.com"
}
```

---

#### `POST /auth/login` — Autenticar usuário

**Body:**
```json
{
  "email": "admin@admin",
  "password": "123"
}
```

**Resposta `200`:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

> Use o token retornado no header `Authorization: Bearer <token>` para os endpoints de pedidos.

---

### Pedidos — `/order`

> Todos os endpoints abaixo requerem autenticação via `Authorization: Bearer <token>`.

#### `POST /order` — Criar pedido

**Body:**
```json
{
  "numeroPedido": "PED-2026-001",
  "valorTotal": 150.00,
  "dataCriacao": "2026-03-09T10:00:00.000Z",
  "items": [
    {
      "idItem": 101,
      "quantidadeItem": 2,
      "valorItem": 50.00
    },
    {
      "idItem": 102,
      "quantidadeItem": 1,
      "valorItem": 50.00
    }
  ]
}
```

**Resposta `201`:**
```json
{
  "orderId": "PED-2026-001",
  "value": 150.00,
  "creationDate": "2026-03-09T10:00:00.000Z",
  "items": [
    { "productId": 101, "quantity": 2, "price": 50.00 },
    { "productId": 102, "quantity": 1, "price": 50.00 }
  ]
}
```

---

#### `GET /order/list` — Listar pedidos do usuário

**Resposta `200`:**
```json
[
  {
    "orderId": "v10089015vdb-01",
    "value": 100.00,
    "creationDate": "2026-02-19T12:24:11.529Z",
    "items": [...]
  }
]
```

---

#### `GET /order/:orderId` — Buscar pedido por ID

**Parâmetro:** `orderId` — número do pedido (ex: `v10089015vdb-01`)

**Resposta `200`:** objeto do pedido com seus itens.

**Resposta `404`:** pedido não encontrado.

---

#### `PUT /order/:orderId` — Atualizar pedido

**Parâmetro:** `orderId` — número do pedido

**Body:** mesmo formato do `POST /order`

**Resposta `200`:** pedido atualizado com os novos itens.

---

#### `DELETE /order/:orderId` — Remover pedido (soft delete)

**Parâmetro:** `orderId` — número do pedido

**Resposta `204`:** sem conteúdo.

> O pedido não é excluído fisicamente do banco — o campo `deleted_at` é preenchido com a data/hora da remoção.

---

## Documentação Swagger

Com o servidor rodando, acesse a documentação interativa em:

```
http://localhost:3000/docs
```

---

## Modelo de Dados

```
users
├── id (PK)
├── name
├── email (unique)
├── password (hash bcrypt)
├── deleted_at (soft delete)
└── created_at / updated_at

orders
├── id (PK)
├── user_id (FK → users.id)
├── order_id (unique)
├── total (decimal)
├── creation_date
├── status
├── deleted_at (soft delete)
└── created_at / updated_at

order_items
├── id (PK)
├── order_id (FK → orders.id)
├── product_id
├── quantity
└── price (decimal)
```

---

## Códigos de Status

| Status | Descrição                        |
|--------|----------------------------------|
| `200`  | Sucesso                          |
| `201`  | Recurso criado                   |
| `204`  | Sem conteúdo (delete)            |
| `401`  | Não autenticado                  |
| `404`  | Recurso não encontrado           |
| `409`  | Conflito (recurso já existe)     |
| `500`  | Erro interno do servidor         |

---

## Melhorias Futuras

### Centralização de Tratamento de Erros

Atualmente, o tratamento de erros é feito individualmente em cada controller via `try/catch`. Uma melhoria planejada é criar um middleware centralizado em `src/middlewares/errorHandler.js`.

**Benefícios:**
- Elimina o bloco `try/catch` repetido em todos os controllers
- Padroniza o formato de resposta de erro em toda a API
- Facilita a adição de logs estruturados e monitoramento
- Simplifica a manutenção e os testes

**Implementação prevista:**

```js
// src/middlewares/errorHandler.js
export const errorHandler = (err, req, res, next) => {
  const status = err.statusCode || 500;
  const message = err.message || "Erro interno do servidor.";
  res.status(status).json({ message });
};
```

```js
// src/app/app.js — registrar após as rotas
import { errorHandler } from "../middlewares/errorHandler.js";
app.use(errorHandler);
```

Com isso, os controllers apenas propagariam o erro via `next(error)`, e toda a lógica de resposta ficaria centralizada no middleware.
