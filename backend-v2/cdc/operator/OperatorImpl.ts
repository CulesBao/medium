import { ObjectId } from "mongodb";
import { IOperator } from "./IOperator";
import { ChangePostCapture } from "../type";
import user from "../../internal/model/user";
import { PostEntity } from "../../executable/command-ingress/features/post/types";
import { UserEntity } from "../../executable/command-ingress/features/user/types";

export class OperatorImpl implements IOperator {
    async run(data: any): Promise<ChangePostCapture> {
        if (!this.isNewPost(data))
            return
        const authorId = data.fullDocument.author
        const author = await user
            .findOne({
                _id: authorId
            })
        if (!author)
            return
        const followers = author.followers.map((followerId: ObjectId) => {
            return followerId
        })
        const timeStamp = new Date(data.fullDocument.createdAt).getTime()
        const document = data.fullDocument as PostEntity
        document.author = author as UserEntity
        return {
            followers,
            timeStamp,
            post: document
        }
    }
    private isNewPost(data: any): boolean {
        const author = data.fullDocument?.author
        const operationType = data.operationType
        return author && operationType == "insert"
    }
}