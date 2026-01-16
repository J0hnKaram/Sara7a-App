import crypto from "node:crypto";
import fs from "node:fs"

const ENCRPTION_SECERT_KEY = Buffer.from("12345678901234567890123456789012");
const IV_LENGTH = Number(process.env.IV_SECRET_LENGTH) || 16;
export const encrypt = (plaintext) => {
    const iv = crypto.randomBytes(IV_LENGTH);
    const cipher = crypto.createCipheriv(
        "aes-256-cbc",
        ENCRPTION_SECERT_KEY,
        iv
    );

    let encrypted = cipher.update(plaintext, "utf8", "hex");
    encrypted += cipher.final("hex");
    return iv.toString("hex") + ":" + encrypted;
};


export const decrypt = (decryptedData) => {
    const [ivHex, cipherText] = decryptedData.split(":")

    const iv = Buffer.from(ivHex, "hex")
    const decipher = crypto.createDecipheriv(
        "aes-256-cbc",
        ENCRPTION_SECERT_KEY,
        iv,
    );

    let decrypted = decipher.update(cipherText, "hex", "utf-8");
    decrypted += decipher.final("utf-8");
    return decrypted
};



if (fs.existsSync("public_key.pem") && fs.existsSync("private_key.pem")) {
    console.log("Key Already Exists");
} else {
    const {publicKey,privateKey} = crypto.generateKeyPairSync("rsa", {
      modulusLength: 2048,
      publicKeyEncoding: { type: "pkcs1", format: "pem" },
      privateKeyEncoding: { type: "pkcs1", format: "pem" },
    });


    fs.writeFileSync("public_key.pem", publicKey);
    fs.writeFileSync("private_key.pem", privateKey);
};


export const asymmetricEncrypt = (plainText) => {
    const BufferedText = Buffer.from(plainText, "utf-8");

    const encryptedData = crypto.publicEncrypt({
        key: fs.readFileSync("public_key.pem", "utf-8"),
        padding: crypto.constants.RSA_PKCS1_PADDING,
    },
        BufferedText
    );
    return encryptedData.toString("hex")
};


export const asymmetricDecrypt = (cipherText) => {
    const BufferedCipherText = Buffer.from(cipherText, "hex");

    const decryptedData = crypto.privateDecrypt({
        key: fs.readFileSync("private_key.pem", "utf-8"),
        padding: crypto.constants.RSA_PKCS1_PADDING,
    },
        BufferedCipherText
    );
    return decryptedData.toString("utf-8")
}