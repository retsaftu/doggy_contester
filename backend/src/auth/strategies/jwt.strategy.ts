import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport'
import { ExtractJwt, Strategy } from "passport-jwt";
import { auth } from '../../../config/config.json';

@Injectable()
export class JwtStratagy extends PassportStrategy(Strategy) {

    constructor() {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: true,
            secretOrKey: auth.secretKey
        });
    }
    async validate({ email }) {
        return email
    }
}