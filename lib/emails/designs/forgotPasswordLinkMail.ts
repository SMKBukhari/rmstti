export const ForgotPasswordMail = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title></title>
  <style>
    body {
      margin: 0;
      padding: 0;
      font-family: "Helvetica Neue", Helvetica, Arial, sans-serif;
      color: #333;
      background-color: #fff;
    }

    .container {
      margin: 0 auto;
      width: 100%;
      max-width: 600px;
      padding: 0 0px;
      padding-bottom: 10px;
      border-radius: 5px;
      line-height: 1.8;
    }

    .header {
      border-bottom: 1px solid #eee;
    }

    .header a {
      font-size: 1.4em;
      color: #000;
      text-decoration: none;
      font-weight: 600;
    }

    .content {
      min-width: 700px;
      overflow: auto;
      line-height: 2;
    }

    .reset-link {
      background: linear-gradient(to right, #00bc69 0, #00bc88 50%, #00bca8 100%);
      margin: 20px 0;
      padding: 10px 20px;
      color: #fff;
      text-decoration: none;
      border-radius: 4px;
      display: inline-block;
    }

    .footer {
      color: #aaa;
      font-size: 0.8em;
      line-height: 1;
      font-weight: 300;
    }

    .email-info {
      color: #666666;
      font-weight: 400;
      font-size: 13px;
      line-height: 18px;
      padding-bottom: 6px;
    }

    .email-info a {
      text-decoration: none;
      color: #00bc69;
    }
  </style>
</head>

<body>
  <!--Subject: Reset Your Password for [App Name]-->
  <div class="container">
    <div class="header">
      <a>Password Reset Request</a>
    </div>
    <br />
    <strong>Dear {{fullName}},</strong>
    <p>
      We received a request to reset the password for your account on 
      <b>The Truth International</b>. If you made this request, click the button below to reset your password.
    </p>
    <a class="reset-link" href="{{resetLink}}" target="_blank">Reset Your Password</a>
    <p style="font-size: 0.9em">
      <strong>Please note:</strong> This link will expire in 10 minutes. 
      <br />
      If you did not request a password reset, you can safely ignore this email. Your account will remain secure.
    </p>

    <br />
    Best regards,  
    <strong>The Truth International</strong>

    <hr style="border: none; border-top: 0.5px solid #131111" />
    <div class="footer">
      <p>This email can't receive replies.</p>
      <p>
        For more information about The Truth International (TTI) and your account, visit
        <strong>
            <a href="https://thetruthinternational.com">thetruthinternational.com</a>
        </strong>
      </p>
    </div>
  </div>
  <div style="text-align: center">
    <div class="email-info">
      <a href="/">The Truth International</a> | Office # 205 D,
      2nd Floor, Evacuee Trust Complex, - Aga Khan Road, F-5/1, Islamabad, Pakistan.
    </div>
    <div class="email-info">
      &copy; 2024 The Truth International. All rights
      reserved.
    </div>
  </div>
</body>
</html>
`;
