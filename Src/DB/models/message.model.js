import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
    {
        content: {
            type: String,
            required: true,
            minlength: [2, "Message must be at least 2 characters long"],
            maxlength: [500, "Message must be at most 500 characters"],
        },
        receiverId: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: "User",
        }
    },
    { timestamps: true }
);

const MessageModel = mongoose.models.message || mongoose.model("Message", messageSchema);

export default MessageModel;


