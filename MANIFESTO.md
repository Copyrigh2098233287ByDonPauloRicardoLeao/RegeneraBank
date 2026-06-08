# Manifesto de Hardening - Regenera Bank v4.1.0
**Função:** Orquestração de Squad Sênior
**Status:** Planejamento Aprovado / Pronto para Execução

---

## 1. Diretrizes de Escrita e Engenharia
- **Linguagem:** Técnica, concisa e orientada a dados. Nenhuma menção a assistentes artificiais, prompts ou automações externas no produto final.
- **Padrão de Código:** Zero logs com dados sensíveis (CPF, chaves Pix, tokens). Sem comentários redundantes no código; foco em documentar decisões arquiteturais, retries e concorrência.
- **Ambiente de Teste:** Isolamento estrito de banco de dados para testes unitários, E2E e testes de carga (k6).

---

## 2. Escopo e Ordem de Ataque

### Fase 1: Core Ledger, Pix e Conciliação (Agente 1)
- **Ação:**
  - Padronizar o motor contábil utilizando uma única entidade oficial (`LedgerEntryEntity` ou `TransactionEntity`) para consolidar lançamentos de débito e crédito.
  - Implementar o `ReconciliationModule` com rotina `@nestjs/schedule` baseada em cron e variável `RECONCILIATION_ENABLED`.
  - Aplicar bloqueio transacional (`SELECT ... FOR UPDATE`) no fluxo do Pix e garantir transações monetárias apenas em centavos (`amountCents` como bigint/integer).
  - Desenvolver lógica de congelamento automático de contas em caso de divergência de saldo mínima (1 centavo), disparando logs críticos e eventos Outbox.
- **Validação:**
  - `npm run test` cobrindo o fluxo de conciliação contábil.
  - Verificação de persistência atômica no banco de dados local.

### Fase 2: Qualidade, Cobertura e CI/CD (Agente 2)
- **Ação:**
  - Ajustar o pipeline do GitHub Actions para rodar compilação typescript strict, ESLint e Jest.
  - Definir cobertura mínima de testes (Backend: 80% statements/functions/lines, 75% branches; Frontend: 70% statements/functions/lines, 65% branches).
  - Criar testes E2E reais no Backend (auth, Pix inbound, rejeição por concorrência/duplicidade, contas congeladas, outbox).
- **Validação:**
  - Execução de `npm run test:cov` e `npm run test:e2e`. O pipeline deve quebrar caso as métricas de cobertura não sejam alcançadas.

### Fase 3: Segurança, Resiliência e Observabilidade (Agente 3)
- **Ação:**
  - Impor SSL/TLS seguro em produção (`rejectUnauthorized: true`) nas conexões PostgreSQL e Redis.
  - Habilitar proteção do Swagger por ambiente, helmet e restrições de payload.
  - Implementar exportador Prometheus no endpoint `/metrics` com métricas de Pix (sucesso/falha/replay), ledger, contas congeladas e locks do DB.
  - Configurar dashboard Grafana oficial via arquivo JSON.
  - Escrever testes de carga k6 dinâmicos (cenários de smoke, load, spike e stress) simulando Pix concorrente.
  - Configurar Dockerfile com usuário não-root e verificar o diretório do build no Cloud Build.
- **Validação:**
  - Subir stack local via docker-compose e checar `/metrics`.
  - Execução de `k6 run scripts/k6-pix-test.js`.

### Fase 4: Documentação, Compliance e Release (Agente 4)
- **Ação:**
  - Gerar documentação técnica interna em `docs/` (Arquitetura, Fluxo Pix, Idempotência, Modelo do Ledger, DR Plan e Threat Model).
  - Escrever ADRs (ADR-001 a ADR-008) na pasta `docs/adr/`.
  - Mapear fluxos reais de KYC, AML e PEP distinguindo-os de mock sandbox.
  - Escrever `CHANGELOG.md` e gerar tag `v4.1.0-production-hardening` contendo riscos residuais e histórico de commits.
- **Validação:**
  - Leitura externa por auditorias. Todos os arquivos sem marcas temporárias ou lixo de desenvolvimento.

---

## 3. Validação de Entrega
A entrega será considerada finalizada apenas após a execução bem-sucedida da suíte de scripts locais:
1. `bash scripts/clean-repo.sh`
2. `bash scripts/audit-metadata.sh`
3. `bash scripts/audit-human-style.sh`
4. `npm run build` (backend & frontend)
5. `npm run test:cov` (backend & frontend)
6. `npm run test:e2e` (backend)
