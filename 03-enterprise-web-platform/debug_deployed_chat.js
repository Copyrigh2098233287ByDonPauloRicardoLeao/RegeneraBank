/*
|---------------------------------------------------------------------------------------|
|  --> REGENERA ENTERPRISE SYSTEM v4.0                                                  |
|---------------------------------------------------------------------------------------|

PROJECT:       Regenera Bank
CEO:           Raphaela Cerveski
DEVELOPER:     Don Paulo Ricardo
ID:            2098233287
COPYRIGHT:     Copyright (c) 2026 Regenera Corporate

LICENSE:       EULA (End-User License Agreement)
PROTECTION:    PROPRIEDADE INTELECTUAL RESTRITA

WARNING:       TODOS OS DIREITOS RESERVADOS. Proibida a cópia, distribuição,
               engenharia reversa ou modificação não autorizada.

|---------------------------------------------------------------------------------------|
|  --> CLASSIFICATION: PROPRIETARY // DEVELOPER MAINTAINED // REQUIRES SENIOR REVIEW          |
|---------------------------------------------------------------------------------------|
*/

import { chromium } from '@playwright/test';

(async () => {
  console.log("Launching Chromium for diagnostics...");
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();

  page.on('console', msg => {
    console.log(`[Console ${msg.type()}] ${msg.text()}`);
  });

  page.on('request', req => {
    if (req.url().includes('neural-core/chat') || req.url().includes('chat')) {
      console.log(`\n>>> REQUEST: ${req.method()} ${req.url()}`);
      console.log("Headers:", JSON.stringify(req.headers(), null, 2));
      console.log("Post data:", req.postData());
    }
  });

  page.on('response', async res => {
    if (res.url().includes('neural-core/chat') || res.url().includes('chat')) {
      console.log(`\n<<< RESPONSE: ${res.status()} ${res.statusText()}`);
      console.log("Headers:", JSON.stringify(res.headers(), null, 2));
      try {
        console.log("Body:", await res.text());
      } catch (e) {
        console.log("Failed to read response body:", e.message);
      }
    }
  });

  try {
    console.log("Going to login...");
    await page.goto("https://regenera-bank-enterprise.vercel.app/login");
    await page.waitForLoadState('networkidle');

    console.log("Selecting EMAIL...");
    await page.click('button:has-text("EMAIL")');
    await page.waitForTimeout(500);

    console.log("Entering credentials...");
    await page.fill('input[type="email"]', 'donpauloricardo@gmail.com');
    await page.fill('input[type="password"]', '270990@Cristo2');

    console.log("Submitting login...");
    await page.click('button:has-text("Acessar Sistema")');
    await page.waitForURL('**/home', { timeout: 15000 });
    console.log("Logged in!");

    console.log("Navigating to neural core...");
    await page.goto("https://regenera-bank-enterprise.vercel.app/neural-core");
    await page.waitForLoadState('networkidle');

    console.log("Sending chat message...");
    await page.fill('input[placeholder*="Mensagem"]', 'Analise minha saúde financeira e sugira alocação de ativos');
    await page.click('button[type="submit"]');

    // Wait 5s for network traffic
    await page.waitForTimeout(5000);
  } catch (err) {
    console.error("Diagnostic failed:", err);
  }

  await browser.close();
})();
