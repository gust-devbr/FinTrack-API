# FinTrack API

Documentação da API REST implementada neste repositório. Os exemplos e regras abaixo descrevem o comportamento atual do código.

## Visão geral

- **Prefixo das rotas da API:** `/api`
- **Swagger UI:** `/docs` (documento OpenAPI em `/docs-json`, conforme configuração do Nest Swagger)
- **Versão declarada no Swagger:** `1.0`
- **Formato:** JSON
- **Autenticação:** JWT Bearer para rotas protegidas
- **Persistência:** MongoDB por Prisma
- **CORS:** habilitado globalmente
- **Porta:** `PORT`, com fallback para `3000`

O endpoint de saúde é `GET /api`.

## Executar localmente

Requisitos: Node.js compatível com NestJS 11, pnpm e uma instância MongoDB acessível.

1. Instale as dependências:

   ```bash
   pnpm install
   ```

2. Configure as variáveis de ambiente (ver [Configuração](#configuração)).
3. Gere o cliente Prisma, se necessário:

   ```bash
   pnpm exec prisma generate
   ```

4. Inicie em desenvolvimento:

   ```bash
   pnpm run start:dev
   ```

Comandos disponíveis: `pnpm run start`, `pnpm run start:dev`, `pnpm run build`, `pnpm run start:prod`. Os testes estão disponíveis em `pnpm run test` e `pnpm run test:e2e`.

### Configuração

| Variável             | Obrigatória | Descrição                                              |
| -------------------- | ----------: | ------------------------------------------------------ |
| `DATABASE_URL`       |         Sim | URI de conexão MongoDB usada pelo Prisma.              |
| `JWT_ACCESS_SECRET`  |         Sim | Segredo usado para assinar e verificar access tokens.  |
| `JWT_REFRESH_SECRET` |         Sim | Segredo usado para assinar e verificar refresh tokens. |
| `PORT`               |         Não | Porta HTTP; padrão `3000`.                             |

Não reutilize segredos de desenvolvimento em produção. O arquivo `.env` local contém valores de ambiente e não deve ser publicado.

## Autenticação

Para acessar rotas protegidas, envie o access token no cabeçalho:

```http
Authorization: Bearer <accessToken>
```

O token carrega o identificador do usuário no campo `sub`. O guard verifica assinatura e expiração com `JWT_ACCESS_SECRET`. Access tokens emitidos no login/cadastro expiram em 20 minutos. O endpoint de refresh emite um novo access token com validade de 15 minutos, conforme a implementação atual. Refresh tokens expiram em 20 dias e são armazenados no banco; há um único refresh token ativo por usuário, substituído em novo cadastro/login.

## Formato das respostas

O interceptor global envolve os retornos dos controllers no envelope abaixo:

```json
{
  "success": true,
  "message": "Operação realizada",
  "data": {}
}
```

A propriedade `data` contém o retorno específico da rota depois da remoção de `message`. Em respostas de sucesso cujos handlers não fornecem `message`, esse campo pode ser omitido no JSON serializado. Em erros HTTP tratados pelo filtro global:

```json
{
  "success": false,
  "statusCode": 400,
  "message": "Detalhe do erro"
}
```

Erros comuns: `400` validação inválida, `401` token/credenciais inválidos, `404` registro não encontrado e `409` e-mail já cadastrado. A validação global rejeita propriedades não declaradas (`whitelist` e `forbidNonWhitelisted`) e converte tipos habilitados pelos DTOs.

## Endpoints

### App

#### `GET /api`

Verifica se a aplicação está respondendo. Não requer autenticação.

Resposta interna do handler:

```json
{ "message": "API funcionando!" }
```

> O interceptor global também aplica o envelope de resposta a esta rota.

### Auth

#### `POST /api/auth/register`

Cria uma conta e inicia uma sessão.

**Body**

```json
{
  "name": "Ana Silva",
  "email": "ana@example.com",
  "password": "senha123"
}
```

`name`: string não vazia; `email`: e-mail válido; `password`: string com pelo menos 6 caracteres.

**Sucesso — `201`**: mensagem, tokens e usuário sem senha em `data`.

```json
{
  "success": true,
  "message": "Cadastrado com sucesso",
  "data": {
    "accessToken": "<jwt>",
    "refreshToken": "<jwt>",
    "user": {
      "id": "68f123456789012345678901",
      "name": "Ana Silva",
      "email": "ana@example.com",
      "createdAt": "2026-10-21T20:00:00.000Z"
    }
  }
}
```

Erros: `409` quando o e-mail já está cadastrado; `400` para body inválido.

#### `POST /api/auth/sign-in`

Autentica um usuário existente.

**Body**

```json
{ "email": "ana@example.com", "password": "senha123" }
```

**Sucesso — `200`**: mesmo formato de dados de `register`, com mensagem `Logado com sucesso`. Credenciais incorretas retornam `401` (`Credenciais inválidas`).

#### `POST /api/auth/refresh`

Valida um refresh token assinado e ainda registrado, e emite somente um novo access token.

**Body**

```json
{ "refreshToken": "<refresh-jwt>" }
```

**Sucesso — `200`**

```json
{
  "success": true,
  "message": "Operação realizada com sucesso",
  "data": { "accessToken": "<novo-access-jwt>" }
}
```

Token inválido, expirado, revogado ou não encontrado retorna `401`. O refresh token não é rotacionado por este endpoint.

#### `POST /api/auth/logout`

Revoga o refresh token informado, removendo-o do banco. O endpoint não exige access token.

**Body:** `{ "refreshToken": "<refresh-jwt>" }`

**Sucesso — `200`**: `{ "success": true, "message": "Logout realizado com sucesso", "data": {} }`. A operação é idempotente para token inexistente.

### Users

Todas as rotas exigem Bearer access token e operam na conta associada ao token.

#### `GET /api/users/me`

Retorna o usuário autenticado, excluindo a senha.

**Sucesso — `200`**: `data.user` contém `id`, `name`, `email` e `createdAt`.

#### `PUT /api/users/me`

Atualiza parcialmente os campos do usuário autenticado. Todos são opcionais; quando fornecidos, `name` deve ser string não vazia, `email` e-mail válido, e `password` string com no mínimo 6 caracteres. Senha é armazenada com hash bcrypt.

**Body de exemplo:** `{ "name": "Ana Souza", "password": "novaSenha123" }`

**Sucesso — `200`**: mensagem `Dados atualizados com sucesso` e `data.user` sem senha. E-mail duplicado pode resultar em conflito do banco.

#### `DELETE /api/users/me`

Exclui a conta do usuário autenticado. A exclusão requer confirmação da senha e remove também categorias, transações e refresh token relacionados (relações em cascata).

**Body:** `{ "password": "senha123" }`

**Sucesso — `200`**: `{ "success": true, "message": "Conta excluída com sucesso", "data": {} }`. Senha incorreta retorna `401`.

### Categories

Todas as rotas exigem Bearer access token.

#### `POST /api/categories`

Cria uma categoria para o usuário autenticado.

**Body**

```json
{ "name": "Lazer", "color": "#349BEB", "icon": "ticket-outline" }
```

Os três campos são strings não vazias.

**Sucesso — `201`**: mensagem `Categoria criada` e categoria criada em `data.category`.

#### `GET /api/categories`

Lista categorias do usuário autenticado. Cada objeto inclui `id`, `name`, `color`, `icon`, `createdAt`, `transactionCount` e `totalAmount`. `totalAmount` soma os valores de transações daquela categoria (sem separar receitas e despesas); categorias sem transações retornam zero.

**Sucesso — `200`**: `{ "success": true, "data": { "categories": [] } }` (o campo `message` não é definido pelo handler).

#### `PUT /api/categories/:id`

Atualiza parcialmente `name`, `color` e/ou `icon`; todos opcionais. Retorna `404` se o ID não existir.

**Sucesso — `200`**: mensagem `Categoria atualizada` e objeto em `data.category`.

#### `DELETE /api/categories/:id`

Exclui categoria pelo ID. Retorna `404` se não existir. Como a relação usa exclusão em cascata, transações associadas à categoria também são excluídas.

**Sucesso — `200`**: mensagem `Categoria excluída`.

### Transactions

Todas as rotas exigem Bearer access token.

#### `POST /api/transactions`

Cria uma transação para o usuário autenticado.

**Body**

```json
{
  "title": "Salário",
  "amount": 5000,
  "categoryId": "68f123456789012345678901",
  "type": "INCOME"
}
```

`title` e `categoryId` devem ser strings não vazias; `amount` deve ser conversível para número; `type` deve ser `INCOME` ou `EXPENSE`. A categoria deve existir e ser compatível com as relações do banco.

**Sucesso — `201`**: mensagem `Transação criada` e transação em `data.transaction`.

#### `GET /api/transactions`

Lista as transações do usuário autenticado e o resumo agregado. Cada transação inclui os campos persistidos (`id`, `title`, `amount`, `type`, `categoryId`, `userId`, `createdAt`, `updatedAt`) e uma categoria reduzida a `id` e `name`.

**Sucesso — `200`**

```json
{
  "success": true,
  "data": {
    "summary": { "income": 5000, "expense": 1200, "balance": 3800 },
    "transactions": []
  }
}
```

O resumo soma valores `INCOME` e `EXPENSE` separadamente; saldo é receita menos despesa. Sem registros, os totais são zero. O handler não define mensagem.

#### `PUT /api/transactions/:id`

Atualiza parcialmente `title`, `amount`, `categoryId` e/ou `type`; todos opcionais e sujeitos às validações correspondentes ao criar. Retorna `404` quando o ID não existir.

**Sucesso — `200`**: mensagem `Transação atualizada` e transação em `data.transaction`.

#### `DELETE /api/transactions/:id`

Exclui transação pelo ID. Retorna `404` quando não existir.

**Sucesso — `200`**: mensagem `Transação excluída`.

## Segurança e escopo dos registros

As consultas de listagem são filtradas pelo usuário autenticado. Na implementação atual, porém, `PUT` e `DELETE` de categorias e transações recebem o ID da URL e fazem a busca/alteração sem validar que o registro pertence ao usuário autenticado. Isso significa que um usuário autenticado que conheça outro ID pode atingir esse registro. Trate isso como uma limitação de segurança a corrigir antes de expor a API em produção. A criação de transações também não faz uma verificação explícita de que a categoria informada pertence ao mesmo usuário.

## Modelo de dados

- **User:** `id`, `name`, `email` (único), senha com hash e `createdAt`.
- **Category:** `id`, `name`, `color`, `icon`, `userId` e `createdAt`.
- **Transaction:** `id`, `title`, `amount` (float), `type` (`INCOME`/`EXPENSE`), `categoryId`, `userId`, `createdAt`, `updatedAt`.
- **RefreshToken:** token único, vínculo único com usuário e `createdAt`.

IDs são ObjectIds do MongoDB representados como strings. O schema declara exclusão em cascata nas relações de usuário/categoria.
