import { MongoClient } from "mongodb"
import { ISink } from "./sink/ISink"
import { SinkImpl } from "./sink/SinkImpl"
import { ISource } from "./source/ISource"
import { SourceImpl } from "./source/SourceImpl"
import { Pipeline } from "./pipeline"
import { config } from 'dotenv'
import client from "./redisConnection"
import { IOperator } from "./operator/IOperator"
import { OperatorImpl } from "./operator/OperatorImpl"

config()
async function main() {
    try {
        const sink: ISink = new SinkImpl(client)
        const source: ISource = new SourceImpl()
        const operator: IOperator[] = []
        operator.push(new OperatorImpl())
        const pipeline = new Pipeline(sink, source, operator)

        await pipeline.run()
    }
    catch (err) {
        console.log(err)
        process.exit(1)
    }
}
main()