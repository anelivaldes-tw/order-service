import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { TerminusModule } from '@nestjs/terminus';
import { HealthController } from './health.controller';
import { mysql } from '../sequelize.config';

@Module({
  imports: [SequelizeModule.forRoot(mysql), TerminusModule],
  controllers: [HealthController],
})
export class HealthModule {}
