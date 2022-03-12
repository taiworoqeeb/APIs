import mongoose from "mongoose";


export interface PostDocument extends mongoose.Document{
    title: string;
    user: object;
    description: string;
};

const PostSchema = new mongoose.Schema({
    title: {
        type: String
    },
    description: {
        type: String,
        required: true,
        unique: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Users'
    },
   
},
{
    timestamps: true
});

const PostModel = mongoose.model<PostDocument>('Posts', PostSchema);

export default PostModel;