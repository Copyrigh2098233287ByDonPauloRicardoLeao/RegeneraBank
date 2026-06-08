PROJECT:       Regenera Bank

CEO:           Raphaela Cerveski

DEVELOPER:     Don Paulo Ricardo de Leão

COPYRIGHT:     Copyright (c) 2026

LICENSE:       EULA (End-User License Agreement)

PROTECTION:    PROPRIEDADE INTELECTUAL RESTRITA

WARNING:       TODOS OS DIREITOS RESERVADOS. Proibida a cópia, distribuição,
                Engenharia reversa ou modificação não autorizada.


# Regenera Bank Enterprise System

O Regenera Bank Enterprise é uma plataforma financeira de alta disponibilidade, desenvolvida para gerir ativos, compliance e transações em ambiente de *banking-as-a-service*. O sistema foi arquitetado para garantir integridade, escalabilidade e segurança de ponta a ponta, utilizando o paradigma *Feature-Sliced Design* (FSD).

## Arquitetura
Este projeto adota a arquitetura **FSD (Feature-Sliced Design)**, garantindo desacoplamento entre camadas de lógica de negócio, interface e serviços. 

- **Core**: Contratos de API, schemas de dados e utilitários globais.
- **Features**: Funcionalidades de negócio isoladas (Pix, Ledger, Auth, KYC).
- **Shared**: Componentes de UI, design tokens e *hooks* universais.

## Tecnologias Principais
* **Runtime**: Node.js / TypeScript
* **Frontend**: React (Vite)
* **Estilização**: TailwindCSS
* **State Management**: Zustand / Context API
* **Segurança**: JWT, Firebase Auth, Idempotência de transações
* **Integrações**: Google Cloud Platform (GCP), Prometeo OpenBanking APIs

## Configuração de Ambiente
Para rodar este projeto em ambiente de desenvolvimento, certifique-se de possuir o Node.js v20+ instalado.

1. **Clonar o repositório:**
```bash
   git clone <url-do-repositorio>
   cd RegeneraBank
Instalar dependências:

Bash
   npm install
Configuração de Variáveis de Ambiente:
Crie um arquivo .env na raiz seguindo o modelo .env.example e preencha as credenciais necessárias para a conexão com o Firebase e serviços bancários externos.

Execução:

Bash
   npm run dev
Governança e Autoria
Este repositório é uma propriedade intelectual protegida da Regenera Corporate. Qualquer modificação sem autorização expressa do desenvolvedor principal (Don Paulo Ricardo) ou do CEO (Raphaela Cerveski) constitui violação de EULA.

O ciclo de vida do software segue padrões rigorosos de DevOps e Zero-Trust Security.

Licenciamento
© 2026 Regenera Corporate. Todos os direitos reservados.
