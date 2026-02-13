# 🏭 Industrial Production Manager

Sistema Full Stack desenvolvido para o gerenciamento de produção industrial, focado em controle de inventário de matérias-primas e planejamento inteligente de produção.

[![Cypress.io](https://img.shields.io/badge/tested%20with-Cypress-04C38E.svg)](https://www.cypress.io/)
[![React](https://img.shields.io/badge/React-19-blue.svg)](https://reactjs.org/)
[![Prisma](https://img.shields.io/badge/Prisma-ORM-2D3748.svg)](https://www.prisma.io/)

## 📋 Sobre o Projeto

Este projeto resolve o desafio de equilibrar o estoque de matérias-primas com a capacidade produtiva. Ele permite o cadastro de insumos, a criação de produtos com receitas específicas (associação de materiais) e utiliza um algoritmo para sugerir a melhor estratégia de produção baseada no estoque disponível.

## 🛠️ Tecnologias

### Frontend
- **React 19** com **TypeScript**
- **Redux Toolkit** (Gestão de estado global)
- **Tailwind CSS** (Design moderno e responsivo)
- **Lucide React** (Ícones)
- **SweetAlert2** (Notificações e diálogos de confirmação)
- **Cypress** (Testes de ponta a ponta)

### Backend
- **Node.js** com **Express 5**
- **Prisma ORM**
- **PostgreSQL / SQLite**
- **Zod** (Validação de schemas e tipos)
- **Vitest** (Testes unitários e de integração)

## 📦 Estrutura de Pastas

```text
industrial-production-manager/
├── backend/          # API REST, Prisma Schema e Regras de Negócio
└── frontend/         # Interface React, Redux e Testes Cypress
```

## 🚀 Como Executar

### Pré-requisitos

* Node.js v20 ou superior
* npm ou yarn

### 1. Configuração do Backend

```bash
cd backend
npm install
# Renomeie o .env.example para .env e ajuste a DATABASE_URL
npx prisma migrate dev
npm run dev
```

*A API estará rodando em `http://localhost:3000`

### 2. Configuração do Frontend

```bash
cd frontend
npm install
npm run dev
```

*O App estará rodando em `http://localhost:5173`

### 3. Executando Testes E2E (Cypress)

Com ambos os servidores rodando, abra uma nova aba no terminal:

```bash
cd frontend
npm cy:open
```

## 🧠 Algoritmo de Otimização (RF008)

O sistema utiliza uma abordagem de **Algoritmo Guloso (Greedy Algorithm)** para a sugestão de produção. Ele prioriza os produtos com maior valor de mercado (Preço), deduzindo virtualmente os materiais do estoque em tempo real para calcular a viabilidade dos produtos subsequentes, garantindo uma sugestão focada em **lucratividade**.

## 👤 Autor

**Carlos Jeferson Jacinto da Silva**
*Estudante de Sistemas de Informação - UFC*

---

Desenvolvido para fins de avaliação técnica.
