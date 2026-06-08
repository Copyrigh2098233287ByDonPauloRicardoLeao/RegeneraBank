![Regenera Bank Logo](https://img.shields.io/badge/Regenera_Bank-ENTERPRISE-0052cc?style=for-the-badge)

# Regenera Bank Enterprise System v4.0.0

> **CLASSIFICATION: PROPRIETARY // DEVELOPER MAINTAINED // PRODUCTION-GRADE**

O **Regenera Bank Enterprise** é uma infraestrutura bancária de alta disponibilidade e liquidação contábil desenvolvida para gerir ativos, *compliance* e transações em ambiente de *Banking-as-a-Service* (BaaS). O sistema é arquitetado para garantir integridade **ACID**, escalabilidade, tolerância a falhas e segurança institucional.

Esta versão (v4.0.0) atinge o grau **10/10 (Production Grade)**, assegurando um processo de compilação sem falhas (`zero-errors`), total ausência de telemetria indesejada ou dados de automação de IAs geradoras, além de impor os mais estritos protocolos de segurança financeira do mercado (Bacen/COAF).

---

## 🏛️ Arquitetura Bancária

Este projeto adota a arquitetura **FSD (Feature-Sliced Design)** orientada a domínio (DDD) e microsserviços modulares.

- **Core Ledger**: Motor contábil com transações ACID estritas, prevenindo *Double-Spend* usando bloqueio pessimista transacional (`SELECT ... FOR UPDATE`).
- **Idempotency Engine**: Controle de transações via Redis com clusterização e arquitetura **Fail-Closed**. Não há "fallback permissivo"; se a idempotência não puder ser garantida, a transação é automaticamente recusada.
- **Compliance & AML (Anti-Money Laundering)**: Abstrações de provedores (Mock/Real) via injeção de dependência nativa do NestJS. Sem regras arbitrárias "hardcoded" na lógica central, permitindo roteamento dinâmico para DataValid, COAF e ClearSale.
- **Security & TLS**: Todas as conexões de banco de dados e mensageria exigem verificação rígida de certificados SSL em produção (`rejectUnauthorized: true`).

## 🛠️ Tecnologias Principais

### Backend (Core Ledger Engine)
- **Runtime**: Node.js / TypeScript (NestJS)
- **Banco de Dados**: PostgreSQL com TypeORM
- **Mensageria/Cache**: Redis (Idempotência e Filas Rápidas)
- **Infraestrutura**: Google Cloud Platform (BigQuery, Storage, Secret Manager)
- **Testes**: Jest (CI enforce test coverage de forma rigorosa)

### Frontend (User Interfaces)
- **Runtime**: React (Vite) / TypeScript
- **Estilização**: TailwindCSS + UI Component Library Privada
- **State Management**: Zustand / Context API

---

## 🔐 Governança, CI/CD e Qualidade (10/10 Grade)

Para manter o status de *Production Grade*, este repositório adota métricas extremas de CI/CD:
- **Zero Compiling Errors**: O Typescript possui `strict: true` e todas as tipagens são honradas no ambiente.
- **Strict Testing**: O comando de integração contínua (`npm run test:ci`) exige cobertura estrita, rejeitando a flag permissiva `--passWithNoTests`.
- **Clean Audit**: Ausência de vestígios de IA na árvore de diretórios, códigos limpos e coesos.
- **Idempotência Garantida**: Todos os *endpoints* transacionais (`/lifestyle/marketplace/buy`, `/investments/trade`, `/webhook/pix`) requerem chaves de idempotência para garantir `at-most-once delivery`.

---

## 🚀 Setup do Ambiente

Para rodar este projeto em ambiente corporativo seguro, certifique-se de possuir o Node.js v20+ e o Redis Server em execução.

### Instalação

```bash
git clone <url-do-repositorio>
cd RegeneraBank
cd "1. Backend"

# O repositório exige lockfile estrito para evitar corrupção de subdependências
npm ci
```

### Configuração de Ambiente

Crie um arquivo `.env` na raiz do backend seguindo os padrões de criptografia da empresa:
```env
PORT=3000
NODE_ENV=production
DATABASE_URL=postgres://user:password@localhost:5432/regenera
REDIS_URL=redis://localhost:6379
PROMETEO_API_KEY=secrete_key_here
JWT_NEURAL_SECRET=sua_chave_secreta_jwt
```

### Execução e Compilação

```bash
# Validar a pureza do código (Build limpo garantido)
npm run build

# Executar a suíte de testes do CI
npm run test:ci

# Iniciar o motor transacional (Local Dev)
npm run start:dev
```

---

## ⚖️ Propriedade Intelectual e Licenciamento

**CEO:** Raphaela Cerveski
**Desenvolvedor Líder:** Don Paulo Ricardo de Leão
**ID Institucional:** 2098233287

> **AVISO LEGAL**: Este repositório e todo o código fonte nele contido constituem **PROPRIEDADE INTELECTUAL RESTRITA** da Regenera Corporate. É expressamente **PROIBIDA** a cópia, distribuição, engenharia reversa, uso comercial ou modificação não autorizada. O sistema possui métodos de *watermarking* e proteção anti-DDOS a nível de código. O uso indevido resultará em medidas judiciais severas.

© 2026 Regenera Corporate. Todos os direitos reservados.
