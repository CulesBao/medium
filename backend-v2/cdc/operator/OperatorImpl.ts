import { Db, ObjectId } from "mongodb";
import { IOperator } from "./IOperator";
import { ChangePostCapture } from "../type";
import user from "../../internal/model/user";

export class OperatorImpl implements IOperator {
    db: Db
    collectionName: string
    collection
    constructor(collectionName: string, db: Db) {
        this.collectionName = collectionName
        this.db = db
        this.collection = this.db.collection(this.collectionName)
    }
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
        const postId = data.fullDocument._id
        return {
            authorId, 
            postId,
            followers,
            timeStamp,
        }
    }
    private isNewPost(data: any): boolean {
        const author = data.fullDocument.author
        const operationType = data.operationType
        return author && operationType == "insert"
    }
}