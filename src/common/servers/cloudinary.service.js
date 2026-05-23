import cloudinary from "../utils/multer/cloudinary.js"


export const uploadFile = ({ fileBuffer, folder }) => {
    return new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
            { folder: folder },
            (error, result) => {
                if (error) return reject(error);
                resolve(result);
            }
        );
        uploadStream.end(fileBuffer);
    });
}

export const delateFile = async (public_id) => {
    return await cloudinary.uploader.destroy(public_id)
}

export const uploadFiles = async ({ files = [], folder }) => {
    const attachment = []
    for (const file of files) {
        const { public_id, secure_url } = await uploadFile({ fileBuffer: file.buffer, folder })
        attachment.push({ public_id, secure_url })
    }
    return attachment
}
export const deleteFiles = async (public_ids) => {
    return await cloudinary.api.delete_resources(public_ids)
}