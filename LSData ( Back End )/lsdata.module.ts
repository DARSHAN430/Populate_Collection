import { Module } from '@nestjs/common';
import { LsdataService } from './lsdata.service';
import { LSDataController } from './lsdata.controller';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config'; // Import ConfigModule and ConfigService
import { MongooseModule } from '@nestjs/mongoose';
import { sdata, sdataSchema } from './Chema/sdata.Schema';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        return {
          secret: config.get<string>('JWT_SECRET'),
          signOptions: {
            expiresIn: config.get<string>('JWT_EXPIRE'),
          },
        };
      },
    }),
    MongooseModule.forFeature([{ name: 'sdata', schema: sdataSchema }]), // Use 'sdata' as the name
  ],
  controllers: [LSDataController],
  providers: [LsdataService],
})
export class LsdataModule {}