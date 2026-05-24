
import { BadRequestError, NotFoundException, uploadFiles, deleteFiles } from "../../common/index.js";
import { messageModel } from "../../DB/model/message.model.js";
import { userModel } from "../../DB/model/userModel.js";
export const createMessage = async ({ content = undefined }, files, receiverId, user) => {
    const account = await userModel.findOne({ _id: receiverId, confirmEmail: { $exists: true } })
    if (!account) {
        throw NotFoundException({ message: "user not found" })
    }
    if (!account.allowMessages) {
        throw BadRequestError({ message: "This user is currently not receiving anonymous messages" });
    }
    let uploadedAttachments = [];
    if (files && files.length > 0) {
        uploadedAttachments = await uploadFiles({
            files,
            folder: `/sarah/messages/${receiverId}`
        });
    }
    const message = await messageModel.create(
        {
            content,
            attachments: uploadedAttachments,
            receiverId,
        }
    )
    if (!message) {
        throw BadRequestError({ message: "message not created" })
    }
    return message
}
export const getMessage = async (messageId, user) => {
    const message = await messageModel.findOne({ _id: messageId, receiverId: user._id }).select("-receiverId ")
    if (!message) {
        throw NotFoundException({ message: "message not found" })
    }
    if (!message.isRead) {
        message.isRead = true
        await message.save()
    }
    const messageObj = message.toObject()
    delete messageObj.receiverId
    return messageObj
}
export const listMessage = async (user) => {
    const messages = await messageModel.find({
        receiverId: user._id,
    })
    .select("content attachments isFavorite isPublic isHidden createdAt")
    .sort({ createdAt: -1 });


    return messages;
}
export const deleteMessage = async (messageId, user) => {
    const message = await messageModel.findOneAndDelete({ _id: messageId, receiverId: user._id })
    if (!message) { throw NotFoundException({ message: "message not found" }) }

    if (message.attachments && message.attachments.length > 0) {
        await deleteFiles(message.attachments.map(att => att.publicId))
    }
    await message.deleteOne()
    return "message Deleted successfully"
}
export const toggleFavoriteMessage = async (messageId, user) => {
    const message = await messageModel.findOne({ _id: messageId, receiverId: user._id });
    if (!message) {
        throw NotFoundException({ message: "Message not found" });
    }
    message.isFavorite = !message.isFavorite;
    await message.save();
    const statusMessage = message.isFavorite
        ? "Message added to favorites successfully"
        : "Message removed from favorites successfully";

    return {
        message: statusMessage,
        isFavorite: message.isFavorite
    };
}; 