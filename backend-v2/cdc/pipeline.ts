import { IOperator } from "./operator/IOperator";
import { ISink } from "./sink/ISink";
import { ISource } from "./source/ISource";

export class Pipeline {
    sink: ISink
    source: ISource
    operators: IOperator[]
    constructor(sink: ISink, source: ISource, operators: IOperator[]) {
        this.operators = operators
        this.sink = sink
        this.source = source
    }
    async run() {
        const eventEmitter = await this.source.get();
        eventEmitter.on('change', async (data) => {
            console.log('[Pipeline] Received data:', data);

            for (const operator of this.operators) {
                data = await operator.run(data);
            }

            console.log('[Pipeline] Transformed data:', data);
            await this.sink.save(data);
        });
    }
}