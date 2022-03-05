import { Request, Response } from 'express';
import urlModel, {Urldocument} from '../model/Url';
import validUrl from 'valid-url';
import shortid from 'shortid';
import dotenv from 'dotenv';

dotenv.config();

const GetUrl = async (req: Request, res: Response) => {
    try{
        const url = await urlModel.findOne({ urlCode: req.params.code })
        if(url){
            return res.redirect(url.longUrl);
        } else{
            return res.status(404).json('No url Found');
        }
    }catch(err){
        console.error(err);
        res.status(500).json('Server error');
    }
};

const createUrl = async (req: Request, res: Response) => {
    var longUrl: Urldocument["longUrl"]  = req.body.longUrl;
    let baseUrl = process.env.BURL ?? '';

    if(!validUrl.isUri(baseUrl)){
        return res.status(401).json('invalid base url')
    }

    const urlCode = shortid.generate();
    
    if(validUrl.isUri(longUrl)){
        try{
            let url = await urlModel.findOne({ longUrl });
            if(url){
                res.status(200).json(url);
            } else{
                const shortUrl = baseUrl + '/' + urlCode;
                url = new urlModel({
                    longUrl,
                    shortUrl,
                    urlCode,
                    date: new Date()
                });

                await url.save();
                res.status(200).json(url);
            }
        }catch(err){
            console.error(err);
            res.status(500).json('Server error')
        };
    } else{
        res.status(501).json('Invalid long Url')
    };
};

export {GetUrl, createUrl};