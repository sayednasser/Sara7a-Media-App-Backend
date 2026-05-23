import mongoose from "mongoose";
import { DB_URL } from "../../config/config.js";

export const connectionDB=async()=>{
    try {
       await mongoose.connect(DB_URL)
        console.log(`DB is connected successfully ✔😎`);
        
    } catch (error) {
        console.log(` failed to connected to DB ❌😒`,error);        
    }
}  