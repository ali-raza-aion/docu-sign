// // src/services/docusign.service.ts

// import { Injectable } from '@nestjs/common';
// import axios, { AxiosRequestConfig } from 'axios';
// import { ConfigService } from '@nestjs/config';

// @Injectable()
// export class DocuSignService {
//   private readonly accessTokenUrl = 'https://account-d.docusign.com/oauth/auth';
//   private readonly accountIdUrl = 'https://account-d.docusign.com/oauth/userinfo';
//   private readonly responseType = 'token';
//   private readonly redirectUri = 'http://localhost:3000/auth/callback';
//   private readonly config: AxiosRequestConfig = {
//     headers: {
//       'Content-Type': 'application/x-www-form-urlencoded',
//     },
//     auth: {
//       username: '',
//       password: '',
//     },
//   };

//   constructor(private readonly configService: ConfigService) {
//     this.config.auth.username = this.configService.get('DOCUSIGN_INTEGRATION_KEY');
//     this.config.auth.password = this.configService.get('DOCUSIGN_SECRET_KEY');
//   }

//   getAuthorizationUrl(state: string): string {
//     const data = new URLSearchParams();
//     data.append('response_type', this.responseType);
//     data.append('client_id', this.config.auth.username);
//     data.append('redirect_uri', this.redirectUri);
//     data.append('scope', 'signature');
//     data.append('state', state);

//     return `${this.accessTokenUrl}?${data.toString()}`;
//   }

//   async getAccountId(accessToken: string): Promise<string> {
//     const response = await axios.get(this.accountIdUrl, {
//       headers: { Authorization: `Bearer ${accessToken}` },
//     });
//     return response.data.sub;
//   }

//   async getAccountDetails(accessToken: string): Promise<any> {
//     const response = await axios.get(this.accountIdUrl, {
//       headers: { Authorization: `Bearer ${accessToken}` },
//     });
//     return response.data;
//   }
// }
