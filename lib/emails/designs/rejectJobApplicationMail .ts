export const ApplicationRejectedMail = `
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
      background: linear-gradient(to right, #dc3545 0, #c82333 50%, #a71d2a 100%);
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
      color: #dc3545;
    }
  </style>
</head>

<body>
  <!--Subject: Application Status Update-->
  <div class="container">
    <div class="header">
      <a>Application Status Update</a>
    </div>
    <br />
    <strong>Dear {{fullName}},</strong>
    <p>
      Thank you for applying for a position at <b>The Truth International</b>. We appreciate the time and effort you put into your application.
    </p>
    <p>
      After careful consideration, we regret to inform you that your application has not been successful at this time.
    </p>
    <p>
      This decision was not an easy one, as we received many strong applications. However, we encourage you to continue pursuing opportunities that align with your skills and aspirations.
    </p>
    <p style="font-size: 0.9em">
      Thank you once again for your interest in joining The Truth International. We wish you all the best.
    </p>

    <hr style="border: none; border-top: 0.5px solid #131111" />
    <div class="footer">
      <p>This email can't receive replies.</p>
      <p>
        For more information about The Truth International (TTI), visit
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
