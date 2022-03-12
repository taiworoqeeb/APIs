import mongoose from "mongoose";


export interface UserDocument extends mongoose.Document{
    fullname: string;
    username: string;
    email: string;
    password: string;
    interests: [string];
    posts: [object];
    updatedAt: Date;
    createdAt: Date;
};


const UserSchema = new mongoose.Schema({
    fullname: {
        type: String,
    },
    username: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true,   
    },
    password: {
        type: String,
        required: true,
        min: 6,
        max: 20,
        select: false
    },
    interests: {
        type: [String],
        required: true
    },
    posts: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Posts'
    }]
},
{
    timestamps: true
});

const UserModel = mongoose.model<UserDocument>('Users', UserSchema);

export default UserModel;