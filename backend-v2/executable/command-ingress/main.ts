import { config } from 'dotenv';
import path from 'path';
config({ path: path.join(process.cwd(), '.env') });
import { createHttpServer } from './app';
import mongoose from 'mongoose';
import env from './utils/env';
import { ISink } from '../../cdc/sink/ISink';
import { MongoClient } from 'mongodb';
import { SinkImpl } from '../../cdc/sink/SinkImpl';
import client from '../../cdc/redisConnection';
import { SourceImpl } from '../../cdc/source/SourceImpl';
import { ISource } from '../../cdc/source/ISource';
import { OperatorImpl } from '../../cdc/operator/OperatorImpl';
import { IOperator } from '../../cdc/operator/IOperator';
import { Pipeline } from '../../cdc/pipeline';

async function start() {
    await mongoose.connect(env.MONGO_URI);
    const redisClient = client;
    const server = createHttpServer(redisClient);
    const sink: ISink = new SinkImpl(client)
    const source: ISource = new SourceImpl()
    const operator: IOperator[] = []
    operator.push(new OperatorImpl())
    const pipeline = new Pipeline(sink, source, operator)

    console.log('Pipeline run')
    await pipeline.run()
    server.listen(env.PORT, () => {
        console.log(`Server running on port ${env.PORT}`);
    });
    // Graceful shutdown
    process.on('SIGINT', async () => {
        // redisClient.quit();
        await client.disconnect();
        // Avoid connection leak.
        mongoose.connection.close();
        process.exit(0);
    });
}

start().catch((err) => {
    console.error(err);
    process.exit(1);
});