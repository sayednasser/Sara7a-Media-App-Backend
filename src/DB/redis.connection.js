import { createClient } from "redis"
import { REDIS_URL } from "../../config/config.js";

export const redisClient = createClient({
  url:REDIS_URL
});
export const connectionRedis=async()=>{
   try{
    await redisClient.connect()
    console.log(`redis is connected successfully ✔😎`)
   }catch(error){
    console.log(`failed to  connect to redis ❌😒`,error)
   }
}