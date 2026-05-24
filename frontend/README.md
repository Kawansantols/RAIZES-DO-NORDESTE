<<<<<<< HEAD
# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```
=======
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
>>>>>>> 58492562d43cce780d8b5ab23e2b4411bb76f44a
