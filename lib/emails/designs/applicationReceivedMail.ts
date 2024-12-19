export const ApplicationReceivedMail = `
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

    .message {
      background: linear-gradient(to right, #00bc69 0, #00bc88 50%, #00bca8 100%);
      margin: 0 auto;
      width: max-content;
      padding: 0 10px;
      color: #fff;
      border-radius: 4px;
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
  <!--Subject: Application Received for Your Job Submission-->
  <div class="container">
    <div class="header">
      <a>Thank You for Your Application</a>
    </div>
    <br />
    <strong>Dear {{fullName}},</strong>
    <p>
      Thank you for applying to <b>The Truth International</b>. We have successfully received your application for the position.
      <br />
      Our team will review your application, and we will get back to you soon. 
      <br />
      We appreciate your interest in joining our team!
    </p>
    <p style="font-size: 0.9em">
      If you have any questions, please feel free to reach out to us at any time.
    </p>

    <hr style="border: none; border-top: 0.5px solid #131111" />
    <div class="footer">
      <p>This email can't receive replies.</p>
      <p>
        For more information about The Truth International (TTI) and your application, visit
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
