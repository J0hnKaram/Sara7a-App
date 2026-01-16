import multer from "multer";


export const cloudFileUploadMulter = ({ validation= [] }) => {

    const storage = multer.diskStorage({});

    const fileFilter = (req, file, cb) => {
        if (validation.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new Error ("Invalid file type"), false);
        }
    }
    return multer({ fileFilter, storage });
};