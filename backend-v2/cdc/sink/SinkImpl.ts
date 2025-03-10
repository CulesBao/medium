import { ObjectId } from "mongodb";
import client from "../redisConnection";
import { ChangePostCapture } from "../type";
import { ISink } from "./ISink";

export class SinkImpl implements ISink {
    client: typeof client
    constructor(redis: typeof client) {
        this.client = redis
    }
    async save(data: ChangePostCapture): Promise<void> {
        const pipeline = client.multi()
        data.followers.forEach((id: ObjectId) => {
            pipeline.ZADD(`user:${id}:following-feeds`, {
                score: data.timeStamp,
                value: String(data.postId)
            })
        })
        await pipeline.exec()
    }
}