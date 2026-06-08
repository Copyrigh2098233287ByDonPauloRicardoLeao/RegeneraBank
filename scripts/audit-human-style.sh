#!/usr/bin/env bash
set -euo pipefail
echo "Scanning for AI/tooling traces and weak technical wording..."
PATTERNS=(
"ChatGPT"
"OpenAI"
"Claude"
"Copilot"
"Cursor"
"Codex"
"LLM"
"AI-generated"
"gerado por IA"
"inteligência artificial"
"como uma IA"
"prompt"
"agente"
"robusto e escalável"
"solução inovadora"
"tecnologia de ponta"
"boas práticas de mercado"
"padrão enterprise"
)
FAILED=0
for pattern in "${PATTERNS[@]}"; do
  if grep -RIn \
    --exclude-dir=.git \
    --exclude-dir=node_modules \
    --exclude-dir=dist \
    --exclude-dir=build \
    --exclude-dir=coverage \
    --exclude-dir="6.Arquivos Soltos" \
    --exclude-dir=scripts \
    --exclude-dir=mobile \
    --exclude="package-lock.json" \
    --exclude="pnpm-lock.yaml" \
    --exclude="yarn.lock" \
    --exclude="scratch_comando.txt" \
    --exclude="MANIFESTO.md" \
    --exclude="README.md" \
    --exclude="INCIDENT_RUNBOOK.md" \
    --exclude="regenera-bank-ux-flow.html" \
    --exclude="run_audit.js" \
    "$pattern" . | \
    grep -v "promptMessage" | \
    grep -v "neural-core.service.ts" | \
    grep -v "handlers.ts" | \
    grep -v "NeuralCorePage.tsx" | \
    grep -v "neural.service.ts" | \
    grep -v "neural.controller.ts" | grep .; then
      FAILED=1
  fi
done
if [ "$FAILED" -eq 1 ]; then
echo "Found forbidden wording or tooling traces. Rewrite before commit."
exit 1
fi
echo "Editorial scan passed."
