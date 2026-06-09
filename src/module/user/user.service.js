import { REFRESH_EXPIRES_IN } from "../../../config/config.js";
import {
    compareHash,
    createLoginCredentials,
    decodeToken,
    delateFile,
    NotFoundException,
    deleteFiles,
    delKey,
    generateHash,
    keys,
    logoutEnum,
    revokeTokenBaseKey,
    set,
    TokenTypeEnum,
    UnauthorizedError,
    uploadFile,
    uploadFiles,
    encrypt,
    decrypt
} from "../../common/index.js";
import cloudinary from "../../common/utils/multer/cloudinary.js";
import { messageModel } from "../../DB/model/message.model.js";
import { userModel } from "../../DB/model/userModel.js";

// 1. تعديل دالة صاحب الحساب لفلترة الرسائل المخفية تلقائياً للحفاظ على توافق الفرونت إند
// export const getProfileWithMessages = async (user) => {
//     const account = await userModel.findById(user._id)
//         .select("firstName lastName profileImage coverImage age phone bio")
//         .lean();

//     if (!account) {
//         throw NotFoundException({ message: "User not found" });
//     }

//     if (account.phone) {
//         account.phone = await decrypt(account.phone);
//     }

//     const messages = await messageModel.find({
//         receiverId: user._id
//     })
//         .sort({ createdAt: -1 })
//         .select("content attachments isRead isFavorite isPublic isHidden createdAt")
//         .lean();

//     return {
//         ...account,
//         Messages: messages
//     };
// };
export const getProfileWithMessages = async (user) => {
    console.log("STEP 1 - Start");

    const account = await userModel.findById(user._id)
        .select("firstName lastName profileImage coverImage age phone bio")
        .lean();

    console.log("STEP 2 - Account Loaded");

    if (!account) {
        console.log("STEP 2.1 - Account Not Found");
        throw NotFoundException({ message: "User not found" });
    }

    if (account.phone) {
        console.log("STEP 3 - Before Decrypt");

        account.phone = await decrypt(account.phone);

        console.log("STEP 4 - After Decrypt");
    }

    console.log("STEP 5 - Before Messages Query");

    const messages = await messageModel.find({
        receiverId: user._id
    })
        .sort({ createdAt: -1 })
        .select("content attachments isRead isFavorite isPublic isHidden createdAt")
        .lean();

    console.log("STEP 6 - Messages Loaded", messages.length);

    const result = {
        ...account,
        Messages: messages
    };

    console.log("STEP 7 - Before Return");

    return result;
};

export const toggleAllowMessages = async (user) => {
    user.allowMessages = !user.allowMessages;
    await user.save();
    return user.allowMessages;
};

export const rotateToken = async (user, issuer) => {
    return await createLoginCredentials(user, issuer);
};

export const shareProfile = async (userId, isOwner = false) => {
    console.log("Incoming userId:", userId, "isOwner:", isOwner);

    const account = await userModel.findById(userId)
        .select("userName profileImage coverImage age phone bio")
        .lean();

    if (!account) {
        throw NotFoundException({ message: "account not found" });
    }

    if (account.phone) {
        account.phone = await decrypt(account.phone);
    }

    const messageFilter = { receiverId: userId };

    if (!isOwner) {
        messageFilter.isPublic = true;
        messageFilter.isHidden = { $ne: true };
    }

    const messages = await messageModel.find(messageFilter)
        .sort({ createdAt: -1 })
        .limit(10)
        .select("content attachments createdAt isFavorite isPublic isHidden")
        .lean();

    return {
        ...account,
        messages
    };
};

export const toggleMessagePublic = async (messageId, user) => {
    const message = await messageModel.findOne({
        _id: messageId,
        receiverId: user._id
    });
    if (!message) {
        throw NotFoundException({ message: "message not found or unauthorized" });
    }
    message.isPublic = !message.isPublic;
    await message.save();
    return {
        messageId: message._id,
        isPublic: message.isPublic
    };
};


export const toggleMessageHide = async (messageId, user) => {
    const message = await messageModel.findOne({
        _id: messageId,
        receiverId: user._id
    });

    if (!message) {
        throw NotFoundException({ message: "message not found or unauthorized" });
    }

    message.isHidden = !message.isHidden;
    await message.save();

    return {
        messageId: message._id,
        isHidden: message.isHidden
    };
};

export const updatePassword = async (
    { oldPassword, newPassword },
    user,
    issuer
) => {
    const match = await compareHash({
        plainText: oldPassword,
        hashText: user.password
    });
    if (!match) {
        throw UnauthorizedError({
            message: "Invalid old password"
        });
    }
    if (oldPassword === newPassword) {
        throw BadRequestError({
            message: "New password must be different"
        });
    }
    user.password = await generateHash({
        plainText: newPassword
    });
    user.changeCredentialsTime = new Date();
    await user.save();
    await delKey(
        await keys(revokeTokenBaseKey(user._id))
    );
    return await createLoginCredentials(user, issuer);
};

export const updateProfile = async (inputs, user, issuer) => {
    const { email, firstName, lastName, userName, age, phone, bio } = inputs;
    const updateData = {};
    if (userName) {
        if (!user.userName || userName !== user.userName) {
            const existingUser = await userModel.findOne({ userName });
            if (existingUser) throw new Error("Username already exists");
        }
        updateData.userName = userName;
    }
    if (email) {
        if (!user.email || email !== user.email) {
            const existingUser = await userModel.findOne({ email });
            if (existingUser) throw new Error("Email already exists");
        }
        updateData.email = email;
    }
    if (phone !== undefined && phone !== "") {
        updateData.phone = await encrypt(phone);
    } else if (phone === "") {
        updateData.phone = "";
    }
    if (firstName !== undefined) {
        updateData.firstName = firstName.trim();
    }
    if (lastName !== undefined) {
        updateData.lastName = lastName.trim();
    }
    if (bio !== undefined) {
        updateData.bio = bio.trim();
    }
    if (age !== undefined) {
        updateData.age = age;
    }
    if (Object.keys(updateData).length === 0) {
        return user;
    }
    const updatedUser = await userModel.findByIdAndUpdate(
        user._id,
        { $set: updateData },
        { new: true, runValidators: true }
    );
    if (!updatedUser) {
        throw new Error("User not found");
    }
    const result = updatedUser.toObject();
    if (result.phone) {
        result.phone = await decrypt(result.phone);
    }
    return result;
};

export const imageProfile = async (file, user) => {
    if (user.profileImage?.public_id) {
        await delateFile(user.profileImage.public_id);
    }
    const { public_id, secure_url } = await uploadFile({ fileBuffer: file.buffer, folder: `/sarah/users/${user._id}/profileImage` });
    user.profileImage = { public_id, secure_url };
    await user.save();
    return user;
};

export const coverProfile = async (files, user) => {
    if (user.coverImage.length) {
        await deleteFiles(user.coverImage.map(({ public_id }) => public_id));
    }
    user.coverImage = await uploadFiles({ files, folder: `/sarah/users/${user._id}/coverImage` });
    await user.save();
    return user;
};

export const logout = async ({ flag }, user, { iat, jti }) => {
    let status = 200;
    switch (flag) {
        case logoutEnum.All:
            user.changeCredentialsTime = new Date(Date.now());
            await user.save();
            console.log(revokeTokenBaseKey(user._id));
            await delKey(await keys(revokeTokenBaseKey(user._id)));
            break;
        default:
            await set({
                key: revokeTokenBaseKey({ userId: user._id, jti }),
                value: jti,
                ttl: iat + REFRESH_EXPIRES_IN
            });
            console.log("Token saved with key:", revokeTokenBaseKey({ userId: user._id, jti }));
            status = 201;
            break;
    }
    return status;
};