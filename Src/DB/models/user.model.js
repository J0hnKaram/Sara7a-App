import mongoose from "mongoose";

export const genderEnum= {
    Male:"Male",
    Female:"Female"
}

export const providerEnum= {
    system:"System",
    google:"Google"
}

export const roleEnum= {
    USER:"USER",
    ADMIN:"ADMIN"
}


const userSchema = new mongoose.Schema({
    firstName:{
        type: String,
        required: true,
        trim: true,
        minLength: [2 , "First Name must be at least 2 charaters long"],
        maxLength: [20 , "First Name must be at most 20 charaters long"]

    },
    lastName:{
        type: String,
        required: true,
        trim: true,
        minLength: [2 , "Last Name must be at least 2 charaters long"],
        maxLength: [20 , "last Name must be at most 20 charaters long"]

    },
    email:{
        type: String,
        required: true,
        unique:true,
        trim: true,
        lowercase: true,
    },
    password:{
        type: String,
        required: function () {
            return providerEnum.google ? false : true;
        },
        trim: true,
        minLength: [8 , "Password must be at least 8 number long"],

    },
    gender:{
        type: String,
        enum:{
            values: Object.values(genderEnum),
            message: "(VALUE) is not a valid gender",
        },
        default: genderEnum.Male 
    },
    providers: {
        type: String,
        enum:{
            values: Object.values(providerEnum),
            message: "(VALUE) is not a valid provider",
        },
        default: providerEnum.system
    },
    role: {
        type: String,
        enum:{
            values: Object.values(roleEnum),
            message: "(VALUE) is not a valid role",
        },
        default: roleEnum.USER 
    },
    phone: String,
    profileImage: String,
    coverImage: [String],
    cloudprofileImage: { public_id: String, secure_url: String },
    cloudcoverImage: [{ public_id: String, secure_url: String }],
    confirmEmail: Date,
    confirmEmailOTP: String,
    confirmEmailOTPExpires: Date,
    forgetPasswordOTP: String,
    forgetPasswordOTPExpires: Date,
    freezeAt: Date,
    freezeBy: { type: mongoose.Schema.Types.ObjectId, ref: "User"  }, 
    restoredeAt: Date,
    restoredBy: { type: mongoose.Schema.Types.ObjectId, ref: "User"  }, 

},
    {
        timestamps: true,
        toJSON:{ virtuals: true },
        toObject:{ virtuals: true },
    }
)



userSchema.virtual("messages", {
    localField: "_id",
    foreignField: "receiverId",
    ref: "Message",
    
});


const UserModel = mongoose.models.User || mongoose.model("User" , userSchema)

export default UserModel