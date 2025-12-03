

import bcrypt from "bcrypt"
export const generatehash=({plaintext="",salt=process.env.SALTROUND}={})=>{
const hashed=bcrypt.hashSync(plaintext,parseInt(salt))
return hashed
}
export const comparehash=({plaintext="",hashvalue}={})=>{
    const hashed=bcrypt.compareSync(plaintext,hashvalue)
    return hashed
    }
