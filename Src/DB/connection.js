import mongoose from "mongoose"

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.DB_URL, 
            {
                serverSelectionTimeoutMS: 5000
            }
        )
        console.log("database connected successfuly");
        
    } catch (error) {
        console.log("mongoDB connection failed", error);
        
    }
};

export default connectDB

