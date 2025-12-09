import { customAlphabet } from "nanoid";
import { EventEmitter } from "node:events";
import { generatehash } from "../security/hash.js";
import { sendemail } from "../email/send.email.js";
import { confirmEmailTemplate, resetPasswordTemplate } from "../templates/verifyaccount.template.js";
import { db } from "../../db/db.connection.js";
const {User}=db
export const emailevent= new EventEmitter()
export const emailsubject={
    confirmemail:"confirm-email",
    resetpassword:"reset-password"
}

export const sendcode=async({data={},subject=emailsubject.confirmemail}={})=>{
    const {email}=data;
    const otp=customAlphabet("0123456789",4)();
    const hashotp=generatehash({plaintext:otp})
   
    
    let updatedata={}
    switch (subject) {
        case emailsubject.confirmemail:
            updatedata={confirmEmailOTP:hashotp}
            break;
            case emailsubject.resetpassword:
                updatedata={confirmpassswordOTP:hashotp}
                break;
        default:
            break;
    }
await User.update(updatedata, {
  where: { email: email }
});
const html = subject === emailsubject.confirmemail
  ? confirmEmailTemplate({code:otp})
  : resetPasswordTemplate({code:otp});


     await sendemail({to:email,html,subject})
    //  console.log(email);
}
emailevent.on("sendconfirmemail",async(data)=>{
 await sendcode({data,subject :emailsubject.confirmemail})
})
emailevent.on("forgotpassword",async(data)=>{
 await sendcode({data,subject:emailsubject.resetpassword})

})