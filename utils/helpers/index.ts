import CryptoJs from "crypto-js"

export const isFalsyValue = (value: any): boolean => {
  return (
    value === undefined ||
    value === null ||
    (Array.isArray(value) && value.length === 0) ||
    (typeof value === "object" && Object.keys(value).length === 0) ||
    (typeof value === "string" && value.trim().length === 0)
  );
};


export const decryptPassword = (password: string, key: string) => {
  console.log("password", password)
  const bytes = CryptoJs.AES.decrypt(password, key)
  const x = bytes.toString(CryptoJs.enc.Utf8)
  return JSON.parse(bytes.toString(CryptoJs.enc.Utf8))
}