import bcrypt from "bcrypt";

export const hash = async ({plainText = "",saltRounds = Number(process.env.HASHING_SALT_ROUNDS)} = {}) => {
    return await bcrypt.hash(plainText, saltRounds);
};


export const compare = async({plainText = "", hash = ""} = {}) => {
    return await bcrypt.compare(plainText, hash);
}