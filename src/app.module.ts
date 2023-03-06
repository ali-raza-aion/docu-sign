import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DocuSignModule } from './docu-sign/docusign.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    DocuSignModule,
    ConfigModule.forRoot({ isGlobal: true, envFilePath: ['.env'] }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
