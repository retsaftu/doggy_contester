import { Module } from '@nestjs/common';
import { MongoClient, Db } from 'mongodb';
import { mongodb } from '../../config/config.json';

@Module({
    providers: [
        {
            provide: 'DATABASE_CONNECTION',
            useFactory: async (): Promise<Db> => {
                try {
                    const client = await MongoClient.connect(`mongodb://${mongodb.host}:${mongodb.port}`, {
                    });

                    const db = client.db(mongodb.dbname);
                    const answer = db.collection('users').aggregate(

                    ).toArray().then((data) => {
                        console.log(`data`, data);
                    });
                    console.log(`answer`, answer);

                    return db;
                } catch (e) {
                    throw e;
                }
            }
        },
    ],
    exports: ['DATABASE_CONNECTION'],
})
export class DatabaseModule { }