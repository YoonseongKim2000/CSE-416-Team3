import CryptoJS from "crypto-js"

export function generateHash(salt: string, password: string): string {
    const passhash = CryptoJS.SHA256(password + CryptoJS.SHA256(salt)).toString(CryptoJS.enc.Hex);
    return passhash;
}