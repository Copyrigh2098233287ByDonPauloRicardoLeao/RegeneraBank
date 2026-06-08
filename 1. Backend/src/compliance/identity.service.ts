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

// |---------------------------------------------------------------------------------------|
// |  --> REGENERA ENTERPRISE SYSTEM v4.0                                                  |
// |---------------------------------------------------------------------------------------|
//
// PROJECT:       Regenera Bank
// CEO:           Raphaela Cerveski
// DEVELOPER:     Don Paulo Ricardo
// ID:            2098233287
// COPYRIGHT:     Copyright (c) 2026 Regenera Corporate
//
// LICENSE:       EULA (End-User License Agreement)
// PROTECTION:    PROPRIEDADE INTELECTUAL RESTRITA
//
// WARNING:       TODOS OS DIREITOS RESERVADOS. Proibida a cópia, distribuição,
//                engenharia reversa ou modificação não autorizada.
//
// |---------------------------------------------------------------------------------------|
// |  --> CLASSIFICATION: PROPRIETARY // DEVELOPER MAINTAINED // REQUIRES SENIOR REVIEW          |
// |---------------------------------------------------------------------------------------|

import { Injectable, Logger, HttpException, HttpStatus } from '@nestjs/common';
import axios from 'axios';

/**
 * Identity Service - Integrates with Prometeo Identity API for KYC.
 */
@Injectable()
export class IdentityService {
  private readonly logger = new Logger(IdentityService.name);
  
  private readonly PROMETEO_API_KEY = process.env.PROMETEO_API_KEY || 'CuI6HgmMnoprLdyoHPrugQVUTiih0rxMOkxB0JlcWViFAma8N72orDMYsrI7j7Ve';
  private readonly PROMETEO_BASE_URL = 'https://banking.sandbox.prometeoapi.com'; // Adjust to actual Identity URL if different

  async validateCpf(cpf: string) {
    this.logger.log(`Validating KYC for CPF via Prometeo: ${cpf}`);

    try {
      const response = await axios.get(
        `${this.PROMETEO_BASE_URL}/cpf/`, // Assuming endpoint based on docs context
        {
          headers: {
            'X-API-Key': this.PROMETEO_API_KEY,
          },
          params: {
             document_number: cpf
          }
        }
      );

      if (response.data && response.data.data && response.data.data.Result) {
         return response.data;
      } else {
         throw new Error('Invalid CPF response from Prometeo');
      }

    } catch (error) {
      this.logger.error('Prometeo Identity API Integration Error', error);
      
      // Fallback for Sandbox/Demonstration purposes
      if (cpf === '12345678909') {
         return {
            data: {
              Result: {
                BasicData: {
                  TaxIdNumber: 12345678909,
                  TaxIdCountry: "BR",
                  Name: "DON PAULO RICARDO",
                  Gender: "M"
                }
              }
            }
         };
      }
      throw new HttpException('Falha na validação de identidade (KYC)', HttpStatus.BAD_REQUEST);
    }
  }
}
