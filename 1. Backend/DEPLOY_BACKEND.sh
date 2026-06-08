# |---------------------------------------------------------------------------------------|
# |  --> REGENERA ENTERPRISE SYSTEM v4.0                                                  |
# |---------------------------------------------------------------------------------------|
#
# PROJECT:       Regenera Bank
# CEO:           Raphaela Cerveski
# DEVELOPER:     Don Paulo Ricardo
# ID:            2098233287
# COPYRIGHT:     Copyright (c) 2026 Regenera Corporate
#
# LICENSE:       EULA (End-User License Agreement)
# PROTECTION:    PROPRIEDADE INTELECTUAL RESTRITA
#
# WARNING:       TODOS OS DIREITOS RESERVADOS. Proibida a cópia, distribuição,
#                engenharia reversa ou modificação não autorizada.
#
# |---------------------------------------------------------------------------------------|
# |  --> CLASSIFICATION: PROPRIETARY // DEVELOPER MAINTAINED // REQUIRES SENIOR REVIEW          |
# |---------------------------------------------------------------------------------------|

#!/bin/bash
# BLOCO 3 — Deploy Backend no Cloud Run
# Execute este script no terminal do Mac no diretório do backend real

set -e

BACKEND_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

echo "=== PASSO 1: Adicionando variáveis de ambiente ao .env ==="
cd "$BACKEND_DIR"

# SECURITY (per Guia RTF Decisão 9/12 + "Segredos exclusivamente no Secret Manager"):
# NEVER append raw secrets to .env in committed scripts. Values must come from:
# - Local dev: secure .env (gitignored) or manual entry.
# - Prod: gcloud secrets (create once from secure source, then --set-secrets refs ONLY).
# The raw values below were present in backup scripts; purged for repo hygiene.
# To (re)create in SM (run manually with real values from vault/1password, NEVER in git):
#   gcloud secrets create PROMETEO_API_KEY --data-file=<(echo -n 'YOUR_REAL_KEY') --project=project-93b8df04-72ab-4e44-8a6
#   gcloud secrets create GEMINI_API_KEY --data-file=<(echo -n 'YOUR_REAL_KEY') ...
#   gcloud secrets create DATABASE_URL ...
#   gcloud secrets create JWT_NEURAL_SECRET ...
#   gcloud secrets create FIREBASE_* ...
# Then deploys use name:latest refs only. "verificar" with: gcloud secrets list --project=...
# (no values ever in source or logs)
# Adiciona ao .env (local only - placeholders, no real keys committed):
grep -qF "PROMETEO_API_KEY" .env 2>/dev/null || echo "PROMETEO_API_KEY=PLACEHOLDER_FROM_SM_OR_VAULT" >> .env
grep -qF "GEMINI_API_KEY" .env 2>/dev/null || echo "GEMINI_API_KEY=PLACEHOLDER_FROM_SM_OR_VAULT" >> .env
grep -qF "FIREBASE_API_KEY" .env 2>/dev/null || echo "FIREBASE_API_KEY=PLACEHOLDER_FROM_FIREBASE_CONSOLE" >> .env

echo "✓ .env atualizado"

echo ""
echo "=== PASSO 2: Build e deploy no Cloud Run ==="
gcloud config set project project-93b8df04-72ab-4e44-8a6

  # Secrets must be pre-created. This keeps zero values in source/CI/logs.
  # Non-sensitive (project id) can stay env-var.
gcloud run deploy regenera-core-api \
  --source . \
  --region southamerica-east1 \
  --allow-unauthenticated \
  --set-secrets "DATABASE_URL=DATABASE_URL:latest,JWT_NEURAL_SECRET=JWT_NEURAL_SECRET:latest,PROMETEO_API_KEY=PROMETEO_API_KEY:latest,GEMINI_API_KEY=GEMINI_API_KEY:latest,FIREBASE_PROJECT_ID=FIREBASE_PROJECT_ID:latest,FIREBASE_API_KEY=FIREBASE_API_KEY:latest" \
  --set-env-vars "GOOGLE_CLOUD_PROJECT=project-93b8df04-72ab-4e44-8a6" \
  --min-instances 0 \
  --max-instances 10 \
  --memory 512Mi \
  --quiet

echo ""
echo "=== PASSO 3: Verificando se subiu ==="
curl https://regenera-core-api-520859662036.southamerica-east1.run.app/v1/health
echo ""
echo "✓ Deploy concluído!"
