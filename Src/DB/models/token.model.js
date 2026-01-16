import mongoose from "mongoose";

const tokenSchema = new mongoose.Schema(
    {
        jwtId: {
            type: String,
            required: true,
            unique: true,
        },
        expiresIn: {
            type: Date,  
            required: true,
        },
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
          
        }

    },
    { timestamps: true }
);

const TokenModel = mongoose.models.Token || mongoose.model("Token", tokenSchema);

export default TokenModel;


