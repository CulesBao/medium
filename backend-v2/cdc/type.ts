import { ObjectId } from "mongodb"

export type ChangePostCapture = {
    authorId: string,
    timeStamp: number,
    followers: ObjectId[]
    postId: ObjectId
}