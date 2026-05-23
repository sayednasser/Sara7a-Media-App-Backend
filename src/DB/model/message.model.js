import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
    content: { type: String, required: function () { return !this.attachments || this.attachments.length === 0 } },
    senderId: { type: mongoose.Types.ObjectId, ref: "User" },
    receiverId: { type: mongoose.Types.ObjectId, required: true, ref: "User" },
    attachments: [{ public_id: String, secure_url: String }],
    isFavorite: {
        type: Boolean,
        default: false
    },
    isPublic: { type: Boolean, default: true },



}, {
    collection: "message",
    strict: true,
    strictQuery: true,
    toJSON: true,
    toObject: true,
    timestamps: true
})

messageSchema.pre(/^find/, function (next) {
    this.find({ isHidden: { $ne: true } });
    next();
});
export const messageModel = mongoose.models.Message || mongoose.model('Message', messageSchema)