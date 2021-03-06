import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Configuration } from './shared/configuration/configuration.enum';
import { ConfigurationService } from './shared/configuration/configuration.service';
import { InfrastructureModule } from './@infrastructure/infrastructure.module';
import { SharedModule } from './shared/shared.module';
import { TodoModule } from './todo/todo.module';
import { UserModule } from './user/user.module';
import { SiteModule } from './site/site.module';

@Module({
    imports: [SharedModule, InfrastructureModule, MongooseModule.forRootAsync({
        imports: [SharedModule],
        useFactory: async (_configService: ConfigurationService) => ({
            uri:  _configService.get(Configuration.MONGO_URI),
            retryDelay: 500,
            retryAttempts: 3,
            useNewUrlParser: true,
            useCreateIndex: true,
        }),
        inject: [ConfigurationService],
    }), UserModule, TodoModule, SiteModule],
})
export class AppModule {
    static host: string;
    static port: number | string;
    static isDev: boolean;


    constructor(private readonly _configurationService: ConfigurationService) {
        AppModule.port = AppModule.normalizePort(_configurationService.get(Configuration.PORT));
        AppModule.host = _configurationService.get(Configuration.HOST);
        AppModule.isDev = _configurationService.isDevelopment;
    }

    private static normalizePort(param: number | string): number | string {
        const portNumber: number = typeof param === 'string' ? parseInt(param, 10) : param;
        if (isNaN(portNumber)) return param;
        else if (portNumber >= 0) return portNumber;
    }

}
