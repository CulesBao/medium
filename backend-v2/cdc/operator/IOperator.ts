import { ChangePostCapture } from "../type";

export interface IOperator {
    run(data: any): Promise<ChangePostCapture>
}