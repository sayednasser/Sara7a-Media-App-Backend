import{v2 as cloudinary}from'cloudinary';
import { Api_key, Api_secret, Cloud_name } from '../../../../config/config.js';


cloudinary.config({
    cloud_name: Cloud_name,
    api_key: Api_key,
    api_secret: Api_secret,
    secure:true
})
export default cloudinary