import { EventEmitter } from "stream";
import { ISource } from "./ISource";
import client from "../redisConnection";
import post from "../../internal/model/post";

export class SourceImpl implements ISource {
    async get(): Promise<EventEmitter> {
        const eventEmitter = new EventEmitter();
        const resumeTokenString = await client.get("RESUME_TOKEN");
        let changeStream;
        let resumeToken;
        try {
            resumeToken = JSON.parse(resumeTokenString);
        } catch (error) {
            throw new Error("Invalid resume token format in Redis");
        }
        if (resumeToken === null) {
            changeStream = post.watch();
        } else {
        changeStream = post.watch([], { resumeAfter: resumeToken });
        }

        changeStream.on("change", async (dataChanged: any) => {
            if (dataChanged && dataChanged.operationType) {
                eventEmitter.emit("change", dataChanged);
                await client.set("RESUME_TOKEN", JSON.stringify(dataChanged._id));
            }
        }).once("error", (err) => {
            console.log(err);
        });

        return eventEmitter;
    }
}
