import { EventEmitter } from "stream";
import { ISource } from "./ISource";
import client from "../redisConnection";
import post from "../../internal/model/post";
export class SourceImpl implements ISource {
    collectionName: string
    client: typeof client
    constructor(collectionName: string, redis: typeof client) {
        this.collectionName = collectionName
        this.client = redis
    }   
    async get(): Promise<EventEmitter> {
        let watchOption: any = {}
        const eventEmitter = new EventEmitter()
        let resumeToken = await client.get('RESUME_TOKEN')
        if (resumeToken)
            watchOption.resumeAfter = { _data: resumeToken }  
        const changeStream = post.watch([], {
            resumeAfter: resumeToken
        })

        changeStream.on('change', async (dataChanged: any) => {
            if (dataChanged && dataChanged.operationType) {
                eventEmitter.emit('change', dataChanged)
                await client.set('RESUME_TOKEN', dataChanged._id._data)
            }
        }).once('error', err => {
            console.log(err)
        })

        return eventEmitter
    }
}