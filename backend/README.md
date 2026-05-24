# Raízes do Nordeste - API

Projeto desenvolvido para a disciplina de Projeto Multidisciplinar.
Sistema de gerenciamento de pedidos para uma rede de lanchonetes nordestinas.

---

## O que foi feito

- Cadastro e autenticação de usuários com JWT
- Gestão de unidades da rede
- Cardápio por unidade
- Controle de estoque
- Realização de pedidos com canal de origem (APP, TOTEM, BALCAO, PICKUP, WEB)
- Pagamento simulado (mock)
- Programa de fidelidade

---

## Como rodar

**1. Instalar as dependências**
```bash
npm install
```

**2. Configurar o .env**
```env
DATABASE_URL="postgresql://postgres:SUA_SENHA@localhost:5432/raizesdb"
JWT_SECRET="raizes_nordeste_secret_2026"
JWT_EXPIRES_IN="8h"
PORT=3000
```

**3. Criar as tabelas**
```bash
npx prisma db push
```

**4. Rodar o servidor**
```bash
npm run dev
```

---

## Documentação

Swagger disponível em `http://localhost:3000/api-docs`

Coleção Postman em `docs/postman/`

---

## Tecnologias

- Node.js, TypeScript, Express
- Prisma + PostgreSQL
- JWT, bcryptjs
- Swagger