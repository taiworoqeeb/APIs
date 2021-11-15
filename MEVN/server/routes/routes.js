const express =  require("express");
const router = express.Router();
const API = require("./../controllers/API");
const multer = require("multer");


let storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "./uploads");
    },
    filename: (req, file, cb) =>{
        cb(null, file.fieldname +"_"+ Date.now() +"_"+ file.originalname);
    },
}); 

let upload = multer({
    storage: storage
}).single("image");


router
.route("/")
.get(API.getAllPost)
.post(upload, API.createPost);

router
.route("/:id")
.get(API.getPost)
.patch(upload, API.updatePost)
.delete(API.deletePost);

module.exports = router;