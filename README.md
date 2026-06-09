
# Regenera Bank • Enterprise Core Banking   
[![Regenera Enterprise CI/CD Pipeline](https://github.com/Copyrigh2098233287ByDonPauloRicardoLeao/RegeneraBank/actions/workflows/ci.yml/badge.svg)](https://github.com/Copyrigh2098233287ByDonPauloRicardoLeao/RegeneraBank/actions) ![High-Availabilit](https://img.shields.io/badge/Production_Ready-_Copyright_©-00AEEF?style=for-the-badge&labelColor=0A1024) ![High-Availabilit](https://img.shields.io/badge/Certificate_FREE_AI%E2%8A%98_-ff3366?style=for-the-badge&labelColor=0A1024)
---

> ### 🛡️ Certificate 100% Human Architeture  • GitHub Nativo • High-Availability  • v 4.0

![Regenera Bank](https://img.shields.io/badge/Regenera_Bank-Enterprise_Core-0052cc?style=for-the-badge)
![Version](https://img.shields.io/badge/v4.0.0-Production_Grade-111827?style=for-the-badge)
![Backend](https://img.shields.io/badge/NestJS_10-TypeScript_5.9-1f2937?style=for-the-badge)
![Ledger](https://img.shields.io/badge/ACID_Ledger-SHA256-4c1d95?style=for-the-badge)
![Security](https://img.shields.io/badge/Zero_Trust-Architecture-0f766e?style=for-the-badge)
![Compliance](https://img.shields.io/badge/BACEN_LGPD_COAF-Ready-b45309?style=for-the-badge)
![Human Built](https://img.shields.io/badge/Human_Built-Core_Architecture-00AEEF?style=for-the-badge\&labelColor=0A1024)

# Regenera Bank Enterprise System v4.0.0

[![Regenera Enterprise CI/CD Pipeline](https://github.com/Copyrigh2098233287ByDonPauloRicardoLeao/RegeneraBank/actions/workflows/ci.yml/badge.svg)](https://github.com/Copyrigh2098233287ByDonPauloRicardoLeao/RegeneraBank/actions)

> Enterprise banking infrastructure for ledger operations, instant payments, compliance, identity, Open Finance, investments and financial orchestration.

**Regenera Bank Enterprise System** is a proprietary financial platform designed to operate critical banking workflows with strong consistency, regulatory readiness, high availability and production-grade observability.

The platform combines an ACID ledger engine, immutable transaction hashing, PIX processing, KYC and AML workflows, Open Finance consent management, investment services, cloud-native infrastructure and multi-layer security controls.

It is organized as a modular banking core, with clear separation between domain logic, infrastructure, compliance, frontend, mobile, documentation and operational tooling.

---

## Mission

**Protect and multiply.**

Regenera Bank was not designed to replicate the legacy banking model. It was built to establish a financial infrastructure where technology, governance and capital protection work under the same principle: every transaction, every architectural decision and every product layer must serve long-term value creation.

The project was founded from a single question raised by **Raphaela Cerveski**:

> “Don, have you ever thought about building something that does not exist only to generate profit, but uses service as the foundation of a regenerative legacy?”

That question became the operating thesis behind the system.

---

## Core Principles

### Financial Integrity

Every financial operation is processed through an ACID transaction model with strict balance control, pessimistic locking and immutable transaction records.

The ledger is designed to prevent inconsistent states, negative balances, duplicate execution and silent data corruption.

### Regulatory Readiness

Compliance is part of the system architecture, not an external layer added after the fact.

The platform includes native structures for KYC, AML, audit logging, consent lifecycle, transaction risk scoring, judicial account blocking and data retention policies.

### Operational Governance

The repository is organized for controlled delivery, technical review, evidence tracking and continuous validation through automated pipelines.

CI/CD, unit tests, integration tests, ledger invariants, security scanning and load testing are part of the release process.

### Security by Design

The architecture follows a Zero Trust model with identity-based access, restricted CORS, secure headers, encrypted communication, secret isolation, audit trails and hardened infrastructure boundaries.

---

## Repository Structure

```txt
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
├── 6. Repository Files/
│
├── .github/
│   └── workflows/
│
├── README.md
├── .gitignore
└── .trivyignore
```

---

## Backend

The backend is built with **NestJS 10**, **TypeScript 5.9.3**, **TypeORM**, **PostgreSQL**, **Redis** and Google Cloud services.

### Main Modules

| Module           | Responsibility                                                     |
| ---------------- | ------------------------------------------------------------------ |
| `core`           | Ledger, accounts, transactions, PIX, idempotency and payment links |
| `auth`           | Firebase IAM, internal JWT, RBAC and biometric workflows           |
| `compliance`     | KYC, AML, PLD, watchlists, risk scoring and audit trails           |
| `investments`    | Portfolio custody, order execution, market data and mark-to-market |
| `open-finance`   | Consent lifecycle, provider integration and regulated data access  |
| `neural`         | Financial intelligence, user insights and voice interface          |
| `infra`          | Secret Manager, Storage, Cloud Armor and cloud service bindings    |
| `metrics`        | Prometheus metrics and operational counters                        |
| `events`         | Webhooks, HMAC signatures, retry strategy and transactional outbox |
| `reconciliation` | Accounting reconciliation workflows                                |
| `analytics`      | BigQuery pipelines and operational reporting                       |

---

## ACID Ledger Engine

The ledger is the financial core of the platform.

It is responsible for account balance integrity, transaction immutability, double-entry accounting and event consistency.

### Capabilities

```txt
1. ACID transaction handling
2. Double-entry accounting model
3. Pessimistic locking with SELECT FOR UPDATE
4. Balance storage in integer cents
5. SHA-256 transaction hash chain
6. Transactional Outbox Pattern
7. Negative balance prevention
8. Account status enforcement
9. Idempotent financial execution
10. Auditable ledger history
```

### Ledger Guarantees

| Guarantee                 | Implementation                                    |
| ------------------------- | ------------------------------------------------- |
| Atomic execution          | QueryRunner transaction boundary                  |
| Race condition protection | Pessimistic write lock                            |
| Historical integrity      | Previous hash plus current transaction hash       |
| Event reliability         | Outbox record created inside the same transaction |
| Balance safety            | Debit validation before commit                    |
| Replay protection         | Idempotency guard                                 |

---

## PIX Engine

The PIX module handles instant payment workflows with strict idempotency, operational limits and real-time event delivery.

### Features

| Feature            | Description                                       |
| ------------------ | ------------------------------------------------- |
| PIX transfer       | Outbound instant payment execution                |
| PIX inbound        | Incoming payment processing                       |
| QR Code            | Payment request generation and scanning           |
| DICT keys          | PIX key workflows                                 |
| Idempotency        | Replay protection using `Idempotency-Key`         |
| WebSocket events   | Real-time updates through `/pix-events`           |
| Ledger integration | All movements are settled through the ACID ledger |

### Operational Limits

| Period    |        Limit |
| --------- | -----------: |
| Daytime   | R$ 50,000.00 |
| Nighttime |  R$ 1,000.00 |

---

## Authentication and Identity

Authentication is implemented through a hybrid model using Firebase IAM and internal JWT issuance.

### Stack

```txt
Firebase Admin SDK
Google Identity Toolkit
Passport JWT Strategy
Role-Based Access Control
Google Cloud Vision liveness checks
Internal JWT issuer
ValidationPipe with strict input validation
Helmet security headers
Restricted CORS policy
```

### Access Roles

| Role       | Scope                          |
| ---------- | ------------------------------ |
| `user`     | Standard account operations    |
| `admin`    | Administrative workflows       |
| `sysadmin` | Restricted operational control |

---

## Compliance, KYC and AML

The compliance layer provides onboarding, document analysis, transaction risk scoring and regulatory auditability.

### KYC Flow

```txt
1. CPF validation
2. Document submission
3. OCR processing
4. Liveness verification
5. Watchlist screening
6. Provider validation
7. Approval, rejection or manual review
```

### AML Engine

The AML service evaluates transaction risk using amount thresholds, PEP checks, origin analysis and regulatory indicators.

Possible outcomes include:

```txt
CLEARED
MANUAL_REVIEW
FROZEN
```

High-risk events are recorded in the compliance audit trail and may trigger account restrictions.

---

## Investments

The investments module provides brokerage-style capabilities for financial assets.

### Capabilities

```txt
Portfolio custody
BUY and SELL order execution
B3 and crypto asset support
Mark-to-market calculation
Quote cache with TTL
Idempotent order execution
Trading WebSocket namespace
Ledger-based settlement
```

---

## Open Finance

The Open Finance module manages consent lifecycle and provider communication.

### Consent Lifecycle

```txt
ACTIVE
REVOKED
EXPIRED
```

### Features

| Feature              | Description                                               |
| -------------------- | --------------------------------------------------------- |
| Consent creation     | User-authorized data access                               |
| Consent revocation   | Immediate permission cancellation                         |
| Expiration control   | Time-bound access management                              |
| Provider integration | Prometeo Banking API layer                                |
| Secure transport     | Prepared for production mTLS with ICP-Brasil certificates |

---

## Raphaela Intelligence Engine

The Raphaela Intelligence Engine provides financial insights, contextual analysis and voice interaction for the platform.

### Stack

```txt
Google Cloud Vertex AI
southamerica-east1 region
Text-to-Speech
Financial insight generation
User financial snapshot analysis
Frontend and mobile integration
```

The engine is isolated as a dedicated module and communicates with the rest of the platform through controlled service boundaries.

---

## Frontend Web

The web application is built with **React 18**, **TypeScript**, **Vite**, **TailwindCSS**, **Zustand** and **React Query**.

### Product Areas

| Area           | Description                                           |
| -------------- | ----------------------------------------------------- |
| Authentication | Login, registration and biometric setup               |
| Banking        | Dashboard, balance and transaction history            |
| PIX            | Transfer, receive, QR Code and key management         |
| Cards          | Card management, limits and virtual card              |
| Investments    | Portfolio, orders and market data                     |
| Compliance     | KYC flow, document upload and AML status              |
| Open Banking   | Consent management and linked accounts                |
| Lifestyle      | Dream Vault, cashback and marketplace                 |
| Sustainability | ESG dashboard and green investment views              |
| Neural         | Raphaela chat, financial insights and voice interface |

---

## Mobile

The mobile application is built with **React Native**, **Expo** and **React Navigation**.

### Mobile Capabilities

```txt
Face ID
Touch ID
Liveness checks
Document capture
QR scanning
Push notifications
PIN code
Root and jailbreak detection
Native PIX transfer flow
Dark-first theme system
```

---

## Infrastructure

The infrastructure layer is cloud-native and prepared for production-grade deployment.

### Stack

| Component            | Usage                        |
| -------------------- | ---------------------------- |
| Docker               | Application containerization |
| Kubernetes           | Production orchestration     |
| ArgoCD               | GitOps deployment            |
| Istio                | Service mesh and mTLS        |
| Google Cloud Run     | Serverless runtime option    |
| Pub/Sub              | Event bus                    |
| Secret Manager       | Secret storage and rotation  |
| Cloud Storage        | KYC documents and reports    |
| BigQuery             | Analytics and AML reporting  |
| Cloud Armor          | WAF and DDoS protection      |
| Firebase             | IAM and application services |
| Firestore            | Low-latency state storage    |
| reCAPTCHA Enterprise | Bot protection               |

---

## Technical Stack

### Backend

| Layer          | Technology                            | Purpose                                      |
| -------------- | ------------------------------------- | -------------------------------------------- |
| Runtime        | Node.js 20+ and TypeScript            | Server-side runtime with strong typing       |
| Framework      | NestJS                                | Modular enterprise backend architecture      |
| API Layer      | REST and WebSocket                    | Request-response and real-time communication |
| ORM            | TypeORM                               | Database abstraction and entity management   |
| Validation     | class-validator and class-transformer | Payload validation and transformation        |
| Authentication | JWT and identity services             | Multi-layer access control                   |

### Data Layer

| Component         | Technology                  | Purpose                                          |
| ----------------- | --------------------------- | ------------------------------------------------ |
| Primary Database  | PostgreSQL                  | ACID transactions and financial integrity        |
| Cache and Session | Redis                       | Idempotency, rate limiting and session workflows |
| Messaging         | BullMQ and Redis Streams    | Asynchronous processing and events               |
| Search            | PostgreSQL Full-Text Search | Transaction and key lookup optimization          |

### Frontend and Mobile

| Platform   | Technology                      | Purpose                                  |
| ---------- | ------------------------------- | ---------------------------------------- |
| Web Admin  | React 18, Vite and TypeScript   | Internal dashboard and B2B interface     |
| Mobile App | React Native and Expo           | iOS and Android application              |
| Styling    | TailwindCSS and Design System   | Consistent product interface             |
| State      | Zustand and React Query         | Client state and server state management |
| Navigation | React Navigation and Deep Links | Mobile navigation and app routing        |

### Infrastructure and DevOps

| Area          | Technology                   | Purpose                                    |
| ------------- | ---------------------------- | ------------------------------------------ |
| Cloud         | Google Cloud Platform        | Compute, storage, IAM and managed services |
| Containers    | Docker and Docker Compose    | Reproducible environments                  |
| Orchestration | Kubernetes                   | High-availability deployment model         |
| CI/CD         | GitHub Actions               | Automated validation and release pipeline  |
| Secrets       | Google Secret Manager        | Credential protection                      |
| Monitoring    | Prometheus and Grafana ready | Observability foundation                   |

---

## Security Architecture

The system follows a layered security model.

### Controls

| Control            | Implementation                         |
| ------------------ | -------------------------------------- |
| Identity           | Firebase IAM, GCP IAM and internal JWT |
| Transport security | TLS 1.3 and Istio mTLS                 |
| Data at rest       | AES-256 through managed KMS            |
| HTTP hardening     | Helmet.js                              |
| CORS               | Restricted origins                     |
| WAF                | Google Cloud Armor                     |
| Audit trail        | Critical events recorded and forwarded |
| Ledger integrity   | SHA-256 hash chain                     |
| Account blocking   | `BLOCKED_JUDICIAL` account status      |
| Secrets            | Secret Manager with controlled access  |

### Quality and Security Gates

```txt
Lint
Typecheck
Automated build
Unit tests
Integration tests
End-to-end tests
Ledger invariant tests
Dependency audit
Secret scanning
Vulnerability scanning
Static analysis
Migration validation
```

---

## Testing and Quality

The project includes automated validation for financial invariants, service behavior, security boundaries and load performance.

### Test Coverage Areas

```txt
Unit tests
Integration tests
End-to-end tests
Ledger invariant tests
PIX concurrency tests
Security authentication tests
AML risk tests
Webhook dispatch tests
Open Finance consent tests
K6 load tests
```

### K6 Load Test Summary

```txt
Target: POST /v1/pix/transfer
Load: 50 VUs to 200 VUs
Duration: 1m45s

checks_succeeded: 100.00%
http_req_duration p95: 58ms
http_req_failed: 0.00%
throughput: 1,567 req/s
```

---

## Architectural Patterns

| Pattern                 | Usage                                 |
| ----------------------- | ------------------------------------- |
| ACID Transactions       | Critical financial operations         |
| Double-Entry Accounting | Ledger settlement                     |
| Transactional Outbox    | Reliable post-commit events           |
| Idempotency Guard       | PIX, orders and sensitive commands    |
| Pessimistic Locking     | Balance race condition prevention     |
| Hash-Chain Ledger       | Immutable transaction history         |
| Saga Pattern            | PIX coordination and compensation     |
| Event Sourcing          | Ledger entries and operational events |
| Circuit Breaker         | External provider resilience          |
| Repository Pattern      | TypeORM persistence boundary          |
| Dependency Injection    | NestJS service composition            |
| WebSocket Gateway       | PIX and trading streams               |
| GitOps                  | ArgoCD automated deployment           |
| Zero Trust              | Identity-first internal communication |

---

## High-Level Architecture

The system is organized around three strategic layers:

```txt
1. Financial Core
   Ledger, interchange, credit logic, subscriptions and account operations.

2. Financial Ecosystem
   Investments, financial services, ESG marketplace and customer-facing services.

3. Technology Frontier
   Banking-as-a-Service, Raphaela Intelligence Engine, data, analytics and automation.
```

This structure allows each vertical to evolve independently while sharing the same financial, compliance and infrastructure foundation.

---

## Documentation

The repository includes technical, operational and compliance documentation.

```txt
docs/
├── Architecture/
│   ├── SYSTEM_DESIGN.md
│   ├── SECURITY_ARCHITECTURE.md
│   ├── SCALING_STRATEGY.md
│   ├── CONTINUOUS_OPERATIONS_ROADMAP.md
│   ├── SIEM_PENTEST_PLAN.md
│   └── WAF_IAM_VALIDATION.md
│
├── Compliance/
│   ├── LEDGER_INVARIANTS_REPORT.md
│   ├── K6_REPORT.md
│   ├── AUDIT_LOGGING.md
│   ├── DATA_RETENTION_POLICY.md
│   ├── DR_RESTORE_REPORT.md
│   └── INCIDENT_RUNBOOK.md
│
├── API/
└── Runbooks/
```

---

## Getting Started

```bash
git clone https://github.com/Copyrigh2098233287ByDonPauloRicardoLeao/RegeneraBank.git

cd RegeneraBank

cd "1. Backend"

npm ci

npm run start:dev
```

Create a local `.env` file with the required environment variables.

Never commit real credentials, certificates, tokens or production secrets.

---

## Production Notes

The following items should be completed or validated before a full regulated production launch.

| Item                | Recommendation                                                |
| ------------------- | ------------------------------------------------------------- |
| Open Finance mTLS   | Load real ICP-Brasil x509 certificates through Secret Manager |
| B3 market data      | Replace hardcoded quotes with a production-grade provider     |
| Consent storage     | Move in-memory consent state to Redis or PostgreSQL           |
| Balance seed method | Remove or restrict to administrative environments             |
| Test coverage       | Maintain minimum coverage targets for critical domains        |
| Secret rotation     | Validate scheduled rotation and incident access paths         |

---

## Technical Status

```txt
ACID Ledger: approved
PIX Engine: approved
KYC and AML: approved
Authentication and RBAC: approved
Infrastructure: approved
CI/CD pipeline: approved
Load testing: approved
Documentation: approved
Release v4.0.0: approved for controlled evolution
```

---

## Intellectual Property

```txt
Project: Regenera Bank Enterprise System
Version: v4.0.0
Classification: Proprietary
License: EULA - End User License Agreement
Copyright: Copyright (c) 2026
Rights: All rights reserved
```

This repository and all source code contained in it are restricted intellectual property of Regenera Corporate.

Unauthorized copying, distribution, sublicensing, reverse engineering, model training, modification or creation of derivative works is strictly prohibited without formal written authorization.

---

## Ownership

```txt
CEO and Founder: Raphaela Cerveski
Developer and Founder: Don Paulo Ricardo de Leão
Project: Regenera Bank Enterprise System
Repository: https://github.com/Copyrigh2098233287ByDonPauloRicardoLeao/RegeneraBank
```

---

## Final Statement

**Regenera Bank Enterprise System v4.0.0** is a proprietary banking infrastructure designed for high-integrity financial operations.

Its architecture combines ACID accounting, immutable ledger records, native compliance workflows, secure identity, automated delivery pipelines, cloud-native deployment and structured operational governance.

The system is positioned as a controlled, auditable and extensible foundation for modern financial products.

> Regenera Bank is not only a bank. It is the beginning of a new financial standard built around protection, regeneration and long-term value.

