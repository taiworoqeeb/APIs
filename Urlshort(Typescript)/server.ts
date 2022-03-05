import { app } from './app';
import dotenv from 'dotenv';
import mongoose from 'mongoose';

dotenv.config();

const DB = process.env.DATABASE ?? '';

const option : Object = {
    useNewUrlParser: true,
    useUnifiedTopology: true
}

mongoose.connect(DB, option)
.then(() => console.log("Database connected!"));


const PORT = process.env.PORT ?? '';

app.listen(PORT, () => {
    console.log(`listening to http://localhost:${PORT}`);
})