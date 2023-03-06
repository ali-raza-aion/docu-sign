import { Controller, Res, Post, Body, Logger } from '@nestjs/common';
import { Response } from 'express';
import { DocuSignService } from './docusign.service';
import * as CircularJSON from 'circular-json';

const fs = require('fs');
const path = require('path');

@Controller('docusign')
export class DocuSignController {
  constructor(private readonly docusignService: DocuSignService) {}

  @Post('envelopes')
  async createEnvelope(@Res() res: Response, @Body() body: any): Promise<any> {
    const accessToken = body.access_token;
    const account_id = body.account_id;
    const filePath = path.join(__dirname, '../public/App-details.pdf');
    console.log(filePath);

    const buffer = fs.readFileSync(filePath);
    const base64 = buffer.toString('base64');
    // Step 3: Create Template
    const templateDefinition = {
      name: 'Testing Template',
      description: 'An testing template',
      document: {
        documentBase64: base64,
        name: 'Testing Document',
        fileExtension: 'pdf',
        documentId: '1',
      },
      templateRoles: [],
      status: 'created',
    };
    const template = await this.docusignService.createTemplate(
      accessToken,
      account_id,
      templateDefinition,
    );
    const tempId = template.templateId;

    // Step 4: Create Envelope by using that template
    const envelopeDefinition = {
      brandId: 'ab4fed4a-af28-4bea-8b33-80e641ec5f0b',
      documents: [
        {
          documentBase64: base64,
          name: 'Testing Document',
          fileExtension: 'pdf',
          documentId: '1',
        },
      ],
      templateId: tempId,
      emailSubject: 'Please sign this document',
      templateRoles: [
        {
          email: 'ali561642@gmail.com',
          name: 'Recipient 1',
          roleName: 'Recipient 1',
          clientUserId: '1',
          tabs: {
            signHereTabs: [
              {
                documentId: '1',
                pageNumber: '1',
                xPosition: '384',
                yPosition: '301',
              },
            ],
          },
        },
        {
          email: 'ma8569574@gmail.com',
          name: 'Recipient 2',
          roleName: 'Recipient 2',
          clientUserId: '2',
          tabs: {
            signHereTabs: [
              {
                documentId: '1',
                pageNumber: '1',
                xPosition: '140',
                yPosition: '301',
              },
            ],
          },
        },
        {
          email: 'samsid032@gmail.com',
          name: 'Recipient 3',
          roleName: 'Recipient 3',
          clientUserId: '3',
          tabs: {
            signHereTabs: [
              {
                documentId: '1',
                pageNumber: '1',
                xPosition: '190',
                yPosition: '380',
              },
            ],
          },
        },
      ],
      status: 'sent',
    };
    const serializedEnvelopeDefinition =
      CircularJSON.stringify(envelopeDefinition);
    const envelope = await this.docusignService.createEnvelope(
      accessToken,
      account_id,
      serializedEnvelopeDefinition,
    );
    // Step 5: Add multiple recipients into the envelop.
    const recipients = [
      {
        email: 'ali561642@gmail.com',
        name: 'Recipient 1',
        roleName: 'Recipient 1',
        clientUserId: '1',
      },
      {
        email: 'ma8569574@gmail.com',
        name: 'Recipient 2',
        roleName: 'Recipient 2',
        clientUserId: '2',
      },
      {
        email: 'samsid032@gmail.com',
        name: 'Recipient 3',
        roleName: 'Recipient 3',
        clientUserId: '3',
      },
    ];

    // Step 6: Create URL for each user which mobile app will use to add his/her signature.
    const signingUrls = recipients.map((recipient) =>
      this.docusignService.getSigningUrl(
        accessToken,
        envelope.envelopeId,
        recipient,
        account_id,
      ),
    );
    const urls = await Promise.all(signingUrls);
    const signingUrlsByRecipient = urls.reduce((result, response, index) => {
      const recipient = recipients[index];
      result[recipient.clientUserId] = response.url;
      return result;
    }, {});
    console.log('urls', signingUrlsByRecipient);

    return {
      envelopeId: envelope.envelopeId,
      signingUrls: signingUrlsByRecipient,
    };
  }
}
