import { ObjectId } from "mongodb"
import { PostEntity } from "../executable/command-ingress/features/post/types"

export type ChangePostCapture = {
    timeStamp: number,
    followers: ObjectId[]
    post: PostEntity
}