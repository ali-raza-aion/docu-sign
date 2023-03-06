import axios from 'axios';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
// import { DocuSignOAuth2, DocuSignClient } from 'docusign-esign';
import { DocuSignClient, EnvelopesApi, ApiClient } from 'docusign-esign';
import { of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { Logger } from '@nestjs/common';

@Injectable()
export class DocuSignService {
  private readonly apiClient: ApiClient;

  constructor(private readonly configService: ConfigService) {
    this.apiClient = new ApiClient();
    // const oauth2 = new DocuSignOAuth2({
    //   clientId: this.configService.get<string>('docusign.clientId'),
    //   clientSecret: this.configService.get<string>('docusign.clientSecret'),
    //   redirectUri: this.configService.get<string>('docusign.redirectUri'),
    //   responseType: 'token',
    // });
    // this.client = new DocuSignClient(oauth2);
  }

  private get baseUrl(): string {
    return this.configService.get<string>('DOCUSIGN_BASE_URL');
  }

  async getAccessToken(authorizationCode: string): Promise<string> {
    const response = await this.apiClient.getToken(authorizationCode);
    return response.accessToken;
  }

  async getAccountInfo(accessToken: string): Promise<any> {
    return this.apiClient
      .getAccountInfo(accessToken)
      .pipe(
        map<any, any>((response) => response.data),
        catchError((error) => of(error)),
      )
      .toPromise();
  }

  // Step 3: Create Template
  async createTemplate(
    accessToken: string,
    accountId: string,
    templateDefinition: any,
  ): Promise<any> {
    const url = `${this.baseUrl}/v2.1/accounts/${accountId}/templates`;
    const headers = {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    };
    const response = await axios.post(url, templateDefinition, { headers });
    console.log('TEMPLATE_CREATED::', response?.data);
    return response.data;
  }

  // Step 4: Create Envelope by using that template
  async createEnvelope(
    accessToken: string,
    accountId: string,
    envelopeDefinition: any,
  ): Promise<any> {
    const url = `${this.baseUrl}/v2.1/accounts/${accountId}/envelopes`;
    const headers = {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    };
    try {
      const response = await axios.post(url, envelopeDefinition, { headers });
      console.log("ENVELOPE::",response.data);
      
      return response.data;
    } catch (error) {
      console.log(
        error?.response?.data ? error?.response?.data : error?.response,
        'ERROR::',
      );
      throw error;
    }
  }

  // Step 6: Create URL for each user which mobile app will use to add his/her signature.
  async getSigningUrl(
    accessToken: string,
    envelopeId: string,
    recipientParams: any,
    accountId: string,
  ): Promise<any> {
    const url = `${this.baseUrl}/v2.1/accounts/${accountId}/envelopes/${envelopeId}/views/recipient`;
    const headers = {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    };
    const params = {
      returnUrl: `http://localhost/signing_complete?${envelopeId}`,
      authenticationMethod: 'email',
      email: recipientParams.email,
      userName: recipientParams.name,
      clientUserId: recipientParams.clientUserId,
    };
    console.log("Params::",params);
    
    try {
      const response = await axios.post(url, params, { headers });
      return response.data;
    } catch (error) {
      console.log(
        error?.response?.data ? error?.response?.data : error?.response,
        'ERROR::',
      );
      throw error;
    }
  }
}
