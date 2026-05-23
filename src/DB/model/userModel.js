import mongoose from "mongoose";
import { GenderEnum, providerEnum, RoleEnum } from "../../common/Enum/index.js";
import { encrypt, generateHash } from "../../common/index.js";
import "./message.model.js";

const UserSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
        min: 2,
        max: 20
    },
    lastName: {
        type: String,
        required: true,
        min: 2,
        max: 20
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: String,
    phone: String,
        bio: String,

    age: String,
    role: {
        type: Number,
        enum: Object.values(RoleEnum),
        default: RoleEnum.User
    },
    provider: {
        type: Number,
        enum: Object.values(providerEnum),
        default: providerEnum.System
    },
    gender: {
        type: Number,
        enum: Object.values(GenderEnum),
        default: GenderEnum.Male
    },
    confirmEmail: Date,
    deletedAt: Date,
    changeCredentialTime: Date,
    profileImage: {
        public_id: String,
        secure_url: String
    },
    coverImage: [{
        public_id: String,
        secure_url: String
    }],
    changeCredentialsTime: Date,
    allowMessages: { type: Boolean, default: true }


}, {
    strict: true,
    strictQuery: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
    collection: 'User',
    timestamps: true
})


UserSchema.virtual("userName").set(function (value) {
    const [firstName, lastName] = value.split(" ")
    this.set({ firstName, lastName })
}).get(function () {
    return this.firstName + " " + this.lastName
})
UserSchema.virtual("Messages", {
    ref: "Message",          // اسم الموديل بتاع الرسائل عندك في الداتابيز
    localField: "_id",       // الحقل اللي هنربط بيه من جدول المستخدم (الـ ID بتاعه)
    foreignField: "receiverId" // الحقل المقابل ليه جوة جدول الرسائل
});

// UserSchema.pre("save", async function () {
//     if (!this.isModified("password")) return;
//     this.password = await generateHash({ plainText: this.password })

// })
// UserSchema.pre("save", async function () {
//     if (!this.isModified("phone")) return;
//     this.phone = await encrypt(this.phone)
// })






export const userModel = mongoose.model.User || mongoose.model('User', UserSchema)


