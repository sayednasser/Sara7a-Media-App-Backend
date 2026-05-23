
import multer from "multer";
import { fileFilter } from "./multer.validation.js";

export const uploadFileCloud = ({ validation = [], size = 5 } = {}) => {
    const storage = multer.memoryStorage();

    return multer({
        fileFilter: fileFilter(validation),
        storage,
        limits: { fileSize: size * 1024 * 1024 }
    })
}