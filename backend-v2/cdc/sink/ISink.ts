import { ChangePostCapture } from "../type";

export interface ISink {
    save(data: ChangePostCapture): Promise<void>
}