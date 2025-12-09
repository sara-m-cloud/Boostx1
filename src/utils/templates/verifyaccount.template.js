export const confirmEmailTemplate = ({ code } = {}) => {
  return `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html dir="ltr" xmlns="http://www.w3.org/1999/xhtml" xmlns:o="urn:schemas-microsoft-com:office:office" lang="en">
<head>
  <meta charset="UTF-8">
  <meta content="width=device-width, initial-scale=1" name="viewport">
  <meta name="x-apple-disable-message-reformatting">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta content="telephone=no" name="format-detection">
  <title>Confirm Your Email</title>
  <style type="text/css">
    body { margin:0; padding:0; font-family: Arial, Helvetica, sans-serif; background-color:#FAFAFA;}
    .container { max-width:600px; margin:0 auto; background:#fff; padding:20px; border-radius:8px;}
    .otp { 
  font-size:24px; 
  font-weight:bold; 
  color:#5C68E2; 
  background:#f1f1f1; 
  padding:10px 20px; 
  border-radius:6px; 
  letter-spacing:4px; 
  margin:20px auto;
  width:180px;
  text-align:center; 
  display:block;
}

    h1 { color:#333; font-size:36px; text-align:center;}
    p { color:#333; font-size:16px; line-height:24px; text-align:center; }
    

  </style>
</head>
<body>
  <div class="container">
    <h1>Confirm Your Email</h1>
    <p>You’ve received this message because your email address has been registered with our site. Please use the OTP below to verify your email address and confirm your account.</p>
    
    <div class="otp ">${code}</div>

    <p>If you did not register with us, please disregard this email.</p>
  </div>
</body>
</html>`;
};
export const resetPasswordTemplate = ({code}={}) => {
  return `
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html dir="ltr" xmlns="http://www.w3.org/1999/xhtml" xmlns:o="urn:schemas-microsoft-com:office:office" lang="en">
<head>
  <meta charset="UTF-8">
  <meta content="width=device-width, initial-scale=1" name="viewport">
  <meta name="x-apple-disable-message-reformatting">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta content="telephone=no" name="format-detection">
  <title>Reset Your Password</title>
  <style type="text/css">
    body { margin:0; padding:0; font-family: Arial, Helvetica, sans-serif; background-color:#FAFAFA;}
    .container { max-width:600px; margin:0 auto; background:#fff; padding:20px; border-radius:8px;}
    
    .otp { 
      font-size:24px; 
      font-weight:bold; 
      color:#5C68E2; 
      background:#f1f1f1; 
      padding:10px 20px; 
      border-radius:6px; 
      letter-spacing:4px; 
      margin:20px auto;
      width:180px;
      text-align:center;
      display:block;
    }

    h1 { color:#333; font-size:36px; text-align:center;}
    p { color:#333; font-size:16px; line-height:24px; text-align:center; }
  </style>
</head>
<body>
  <div class="container">
    <h1>Reset Your Password</h1>
    <p>We received a request to reset your password. Please use the code below to verify your request and create a new password for your account.</p>
    
    <div class="otp">${code}</div>

    <p>If you did not request a password reset, you can safely ignore this email.</p>
  </div>
</body>
</html>
  `;
};

