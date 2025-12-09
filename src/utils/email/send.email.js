import nodemailer from "nodemailer"
export const sendemail=async( {to=[], cc=[],bcc=[],text="",html="",subject="BOOSTX",attachments=[]}={})=>{
    

const transporter = nodemailer.createTransport({
 service:"gmail", // true for port 465, false for other ports
  auth: {
    user:process.env.EMAIL,
    pass: process.env.EMAIL_PASS,
  },
});

// async..await is not allowed in global scope, must use a wrapper
async function main() {
  // send mail with defined transport object
  const info = await transporter.sendMail({
    from: `"BOOSTX👻" ${process.env.EMAIL}`, // sender address
    to, cc,bcc,text,html,subject,attachments // list of receivers
     // html body
  });

  console.log("Message sent: %s", info.messageId);
  // Message sent: <d786aa62-4e0a-070a-47ed-0b0666549519@ethereal.email>
}

main().catch(console.error);

}