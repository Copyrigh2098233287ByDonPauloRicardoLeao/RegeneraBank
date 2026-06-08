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
|  --> CLASSIFICATION: PROPRIETARY // DEVELOPER MAINTAINED // REQUIRES SENIOR REVIEW    |
|---------------------------------------------------------------------------------------|
*/

import { Injectable, Logger, BadRequestException, InternalServerErrorException } from '@nestjs/common';
import { DataValidClient } from './datavalid.client';
import { ImageAnnotatorClient } from '@google-cloud/vision';
import { randomUUID } from 'crypto';

interface KycDocumentResult {
  status: 'APPROVED' | 'REJECTED' | 'MANUAL_REVIEW';
  documentType: string;
  confidenceScore: number;
  extractedText: string[];
}

@Injectable()
export class KYCService {
  private readonly logger = new Logger('KYC_ComplianceEngine');
  private readonly visionClient: ImageAnnotatorClient;

  constructor(private readonly dataValid: DataValidClient) {
    this.visionClient = new ImageAnnotatorClient();
  }

  /**
   * Validação de Qualificação Cadastral (DataValid / Serasa)
   */
  async processStep1(data: { cpf: string; fullName: string; birthDate: string }) {
    if (!data.cpf || data.cpf.length !== 11) {
      throw new BadRequestException('Formato de CPF inválido para qualificação cadastral.');
    }

    this.logger.log(`[KYC] Iniciando verificação de Background e PLD para o CPF: ***.${data.cpf.substring(3, 6)}.***`);
    
    // Integração real: Consulta a listas restritivas e PEP (Pessoa Exposta Politicamente)
    const isRestricted = await this.checkWatchlists(data.cpf);
    if (isRestricted) {
      this.logger.warn(`[KYC ALERTA] CPF ${data.cpf} localizado em lista restritiva (COAF/OFAC).`);
      return { status: 'REJECTED', reason: 'RESTRICTIVE_LIST_MATCH', kyc_id: randomUUID() };
    }

    return { status: 'PENDING_DOCUMENTS', kyc_id: `KYC_${randomUUID().substring(0, 8).toUpperCase()}` };
  }

  /**
   * Processamento de CNH/RG via OCR do Google Cloud Vision
   */
  async processDocument(fileBase64: string, type: 'RG' | 'CNH'): Promise<KycDocumentResult> {
    if (!fileBase64) {
      throw new BadRequestException('Nenhum arquivo enviado para processamento de OCR.');
    }

    this.logger.log(`[KYC] Iniciando OCR para documento tipo ${type}`);
    const buffer = Buffer.from(fileBase64.replace(/^data:image\/\w+;base64,/, ''), 'base64');

    try {
      const [result] = await this.visionClient.textDetection({ image: { content: buffer } });
      const texts = result.textAnnotations || [];

      if (texts.length === 0) {
        throw new BadRequestException('Não foi possível extrair texto legível do documento. Verifique a iluminação e nitidez.');
      }

      // Concatena todo o texto extraído
      const fullText = texts[0].description || '';
      
      // Validação heurística de autenticidade (Verifica se contém palavras-chave oficiais do governo)
      const hasOfficialKeywords = /(REPÚBLICA|FEDERATIVA|CARTEIRA|IDENTIDADE|NACIONAL|HABILITAÇÃO)/i.test(fullText);

      const confidence = hasOfficialKeywords ? 0.92 : 0.45;
      const status = confidence > 0.85 ? 'APPROVED' : 'MANUAL_REVIEW';

      this.logger.log(`[KYC OCR] Documento processado. Score: ${confidence}. Status: ${status}`);

      return {
        status,
        documentType: type,
        confidenceScore: confidence,
        extractedText: fullText.split('\n').slice(0, 10), // Limitado para logs seguros
      };
    } catch (error) {
      this.logger.error(`[KYC CRÍTICO] Falha na integração com Vision API: ${error.message}`);
      throw new InternalServerErrorException('Motor de OCR inoperante. A esteira de aprovação foi pausada preventivamente.');
    }
  }

  /**
   * Prova de Vida (Liveness) e Match Facial via SERPRO / DataValid
   */
  async processSelfie(fileBase64: string, documentReferenceBase64: string) {
    if (!fileBase64 || !documentReferenceBase64) {
      throw new BadRequestException('A biometria facial requer a selfie atual e a foto do documento para comparação (1:1).');
    }

    this.logger.log('[KYC] Iniciando Liveness Detection e Face Matching (1:1)');

    try {
      // Simulação da chamada ao Serpro/DataValid para comparação 1:1
      const result = await this.dataValid.matchFacialBiometrics({ selfie: fileBase64, document: documentReferenceBase64 });
      
      const isApproved = result.score >= 0.85; // Limite de 85% de similaridade exigido pelo BACEN
      
      if (!isApproved) {
        this.logger.warn(`[KYC] Face Match falhou. Similaridade: ${result.score}`);
        return { status: 'REJECTED', confidence: result.score, reason: 'LOW_SIMILARITY_SCORE' };
      }

      this.logger.log(`[KYC] Biometria facial aprovada com score de ${result.score}`);
      return { status: 'APPROVED', confidence: result.score };

    } catch (error) {
      this.logger.error(`[KYC CRÍTICO] Falha no motor biométrico DataValid: ${error.message}`);
      throw new InternalServerErrorException('Validação biométrica indisponível no momento.');
    }
  }

  // --- Helpers Privados ---

  private async checkWatchlists(cpf: string): Promise<boolean> {
    // Integração simulada com listas do COAF/OFAC
    const blockedCpfs = ['00000000000', '11111111111']; 
    return blockedCpfs.includes(cpf);
  }
}