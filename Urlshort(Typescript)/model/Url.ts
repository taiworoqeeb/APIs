import mongoose from 'mongoose';

export interface Urldocument extends mongoose.Document{
    urlCode: string;
    longUrl: string;
    shortUrl: string;
    date: Date;
}

const urlSchema = new mongoose.Schema({
    urlCode: String,
    longUrl: String,
    shortUrl: String,
    date: {type: String, default: Date.now }
})


const urlModel = mongoose.model<Urldocument>('Url', urlSchema);

export default urlModel ;