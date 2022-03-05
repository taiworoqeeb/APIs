const Url = require('../models/Url');
const validUrl = require('valid-url');
const shortid = require('shortid');
require('dotenv').config

exports.GetUrl = async (req, res)=>{
    try{
        const url = await Url.findOne({ urlCode: req.params.code });
        if(url) {
            return res.redirect(url.longUrl);
        } else{
            return res.status(404).json('No url Found');
        }
    }catch(err){
        console.error(err);
        res.status(500).json('Server error');
    }
};

exports.createUrl = async (req, res) => {
    const { longUrl } = req.body;
    const baseUrl = process.env.BASEURL;

    if(!validUrl.isUri(baseUrl)){
        return res.status(401).json('invalid base url')
    }

    const urlCode = shortid.generate();

    if(validUrl.isUri(longUrl)){
        try{
            let url = await Url.findOne({ longUrl});
            if(url){
                res.status(200).json(url);
            } else{
                const shortUrl = baseUrl + '/' + urlCode;
                url = new Url({
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
        res.status(401).json('Invalid long Url')
    };
};