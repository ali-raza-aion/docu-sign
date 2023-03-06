import { Module } from '@nestjs/common';
import { DocuSignService } from './docusign.service';
import { DocuSignController } from './docusign.controller';

@Module({
  imports: [],
  controllers: [DocuSignController],
  providers: [DocuSignService],
  exports: [],
})
export class DocuSignModule {
  constructor() {
    console.log('DocuSignModule');
  }
}
