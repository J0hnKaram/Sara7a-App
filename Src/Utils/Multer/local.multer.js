import multer from "multer";
import path from "node:path";
import fs from "node:fs";

export const fileTypes = {
    image: ["image/png", "image/jpeg", "image/jpg"],
    videos: ["video/mp4", "video/mj2", "video/webm"],
    audio: ["audio/mpeg", "audio/ogg", "audio/wav", "audio/webm"],
    document: ["application/pdf", "application/msword"]
}



export const localFileUpload = ({ customPath = "general" , validation= [] }) => {
    const basepath = `Upload/${customPath}/`;

    const storage = multer.diskStorage({
        destination: (req, file, cb) => {
            let userBasePath = basepath;
            if (req.user?._id) {
                userBasePath += `/${req.user._id}/`;
            }
            const fullPath = path.resolve(`./Src/${userBasePath}`);
            if (!fs.existsSync(fullPath)) {
                fs.mkdirSync(fullPath, { recursive: true });
            }
            cb(null, fullPath);
        },



        filename: (req, file, cb) => {
            const uniqueSuffix =
                Date.now() + '-' + Math.round(Math.random() * 1E9) + "-" + file.originalname;
            file.finalPath = `${basepath}/${uniqueSuffix}`;
            cb(null, uniqueSuffix)

        },
    });

    const fileFilter = (req, file, cb) => {
        if (validation.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new Error ("Invalid file type"), false);
        }
    }
    return multer({ fileFilter, storage });
};