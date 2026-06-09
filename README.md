
# Regenera Bank • Enterprise Core Banking   
[![Regenera Enterprise CI/CD Pipeline](https://github.com/Copyrigh2098233287ByDonPauloRicardoLeao/RegeneraBank/actions/workflows/ci.yml/badge.svg)](https://github.com/Copyrigh2098233287ByDonPauloRicardoLeao/RegeneraBank/actions) ![Strictly Human Made](https://img.shields.io/badge/IP_Protection-Strictly_Human_Made-00AEEF?style=for-the-badge&labelColor=0A1024) ![No AI Allowed](https://img.shields.io/badge/ROBOTS-RESTRICTED_%E2%8A%98_NO_AI-ff3366?style=for-the-badge&labelColor=0A1024)
---

> ### 🛡️ 100% Human Architeture • Production-Ready • High-Availability  • v 4.0




>
> 
  

O **Regenera Bank Enterprise** é uma infraestrutura bancária de alta disponibilidade e liquidação contábil desenvolvida para gerir ativos, compliance e transações em ambiente de *Banking-as-a-Service* (BaaS).

O sistema foi projetado para garantir integridade transacional, consistência contábil, escalabilidade operacional, tolerância a falhas e segurança institucional em fluxos financeiros críticos.

A versão **v4.0.0** consolida a arquitetura enterprise do projeto, com pipeline de CI/CD validado, suíte de testes automatizada, verificação de segurança, análise estática, controle de dependências, proteção contra vazamento de segredos e validação de migrações de banco de dados.

---



##  Arquitetura Bancária

Este projeto adota uma arquitetura modular orientada a domínio, com separação clara entre núcleo financeiro, compliance, canais digitais, infraestrutura e interfaces de usuário.

> ###  Componentes principais



- **Core Ledger**  
  Motor contábil com transações ACID, registros imutáveis, controle de saldo em centavos e prevenção de inconsistências por meio de bloqueio transacional pessimista.

- **Pix Transaction Engine**  
  Fluxo transacional com validações de saldo, idempotência, consistência de ledger e integração com eventos assíncronos.

- **Idempotency Engine**  
  Controle de execução única para operações críticas, reduzindo risco de duplicidade, replay acidental e inconsistência em chamadas concorrentes.

- **Reconciliation Service**  
  Camada de conciliação para validação entre saldos operacionais e registros contábeis, com alertas críticos em caso de divergência.

- **Compliance & AML**  
  Estrutura preparada para regras de KYC, AML, PEP e validações antifraude, com separação entre provedores, regras de negócio e integrações externas.

- **Security Layer**  
  Endurecimento de autenticação, validação de entrada, proteção de headers, controle de segredos, TLS em produção e bloqueios preventivos em fluxos sensíveis.

Tecnologias
---



### Backend

- **Runtime:** Node.js / TypeScript
- **Framework:** NestJS
- **Database:** PostgreSQL
- **ORM:** TypeORM
- **Cache / Idempotência:** Redis
- **Testes:** Jest
- **Segurança:** Helmet, validação de payload, análise estática, secret scanning e dependency scanning

### Frontend

- **Runtime:** React / Vite
- **Linguagem:** TypeScript
- **Estilização:** TailwindCSS
- **Estado:** Zustand / Context API
- **Qualidade:** Build automatizado e validação em pipeline

### Infraestrutura

- **Cloud Ready:** Google Cloud Platform
- **Observabilidade:** Métricas operacionais e estrutura preparada para monitoramento
- **Containers:** Docker e Docker Compose
- **CI/CD:** GitHub Actions

---

Governança, CI/CD e Qualidade
---

O repositório adota uma esteira de validação contínua com foco em segurança, previsibilidade e rastreabilidade.

### Gates de validação

- **Lint:** validação de padrão de código
- **Typecheck:** verificação estática de tipos
- **Build:** compilação do backend e frontend
- **Unit Tests:** testes unitários automatizados
- **E2E Tests:** validação de fluxos integrados
- **Ledger Invariants:** testes dedicados às regras contábeis críticas
- **Migration Dry-Run:** validação controlada de migrações TypeORM
- **Dependency Audit:** auditoria de dependências
- **Gitleaks:** verificação contra vazamento de segredos
- **Trivy:** análise de vulnerabilidades em dependências e arquivos do repositório
- **Semgrep:** análise estática de segurança

---

##  Testes e Validação

A suíte de testes cobre fluxos críticos do sistema financeiro, incluindo:

- prevenção de saldo negativo;
- consistência entre débito e crédito;
- rollback em falhas transacionais;
- validação de idempotência;
- proteção contra duplicidade;
- simulação de divergência contábil;
- validação de webhooks;
- fluxos Pix;
- autenticação e segurança;
- invariantes do ledger.

Comandos principais:

```bash
cd "1. Backend"

npm ci
npm run lint
npm run typecheck
npm run build
npm run test:cov
npm run test:e2e
npm run test:ledger:invariants
````

---

## 🚀 Setup do Ambiente

Para executar o projeto em ambiente local, utilize Node.js v20+ e os serviços necessários configurados conforme o ambiente.

### Instalação

```bash
git clone <repository-url>
cd RegeneraBank
cd "1. Backend"

npm ci
```

### Configuração de ambiente

Crie um arquivo `.env` na raiz do backend com variáveis equivalentes às abaixo:

```env
PORT=3000
NODE_ENV=development

DATABASE_URL=postgres://user:password@localhost:5432/regenera
REDIS_URL=redis://localhost:6379

JWT_NEURAL_SECRET=CHANGE_ME
PROMETEO_API_KEY=CHANGE_ME
```

> Nunca versionar credenciais reais, tokens, chaves privadas ou segredos operacionais.

### Execução local

```bash
npm run start:dev
```

### Build

```bash
npm run build
```

---

## 🧾 Estrutura do Repositório

```text
regenera-bank/
├── 1. Backend/
│   ├── src/
│   ├── test/
│   ├── scripts/
│   └── package.json
│
├── 2. Mobile/
│   └── src/
│
├── 3. FrontEnd/
│   └── src/
│
├── 4. Infra/
│
├── 5. Docs/
│
├── 6.Arquivos Soltos/
│
├── .github/
│   └── workflows/
│
├── README.md
├── .gitignore
└── .trivyignore
```

---

##  Propriedade Intelectual e Licenciamento

**CEO:** Raphaela Cerveski
**Desenvolvedor Líder:** Don Paulo Ricardo de Leão
**ID Institucional:** 2098233287

> **AVISO LEGAL:** Este repositório e todo o código-fonte nele contido constituem **PROPRIEDADE INTELECTUAL RESTRITA** da Regenera Corporate. É expressamente proibida a cópia, distribuição, engenharia reversa, raspagem, treinamento de modelos, uso comercial, modificação não autorizada ou criação de obras derivadas sem autorização formal.

O sistema possui estrutura de proteção autoral, rastreabilidade técnica e mecanismos internos de controle de integridade. O uso indevido poderá resultar em responsabilização civil, contratual e judicial.

© 2026 Regenera Corporate. Todos os direitos reservados.

```
```
