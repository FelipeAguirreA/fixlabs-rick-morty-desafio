import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { RickMortyModule } from './rick-morty/rick-morty.module';

@Module({
  imports: [RickMortyModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
