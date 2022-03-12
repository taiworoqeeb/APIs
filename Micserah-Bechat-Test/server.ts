import app from './app';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();


const DB = process.env.DATABASE as string;

const option : Object = {
    useNewUrlParser: true,
    useUnifiedTopology: true
}

mongoose.connect(DB, option)
.then(() => console.log("Database connected!"));



const port = process.env.PORT as string;
app.listen(port, ()=>{
    console.log(`listening to https://localhost:${port}`)
});
