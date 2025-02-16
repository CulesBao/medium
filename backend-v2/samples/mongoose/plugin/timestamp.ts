/* eslint-disable @typescript-eslint/no-explicit-any */
import { Schema } from 'mongoose';

export function timeStampPlugin(schema: Schema, _: any) {
    schema.pre('save', function (next, _) {
        console.log('Plugin loeaded')
        this.createdAt = new Date().toISOString()
        next()
    })
}