import { ConfigService } from '@nestjs/config';
import { JwtModuleOptions } from '@nestjs/jwt';
import { auth } from './config.json';

// export const getJWTConfig = async (configService: ConfigService): Promise<JwtModuleOptions> => {
// 	return {
// 		secret: configService.get('JWT_SECRET')
// 	};
// };

export const getJWTConfig = async (): Promise<JwtModuleOptions> => {
	return {
		secret: auth.secretKey
	};
};