export const ContractRenewalMail = `
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
      background: linear-gradient(to right, #007bff 0, #0056b3 50%, #003366 100%);
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
      color: #007bff;
    }
  </style>
</head>

<body>
  <!--Subject: Contract Renewal at The Truth International-->
  <div class="container">
    <div class="header">
      <a>Contract Renewal at The Truth International</a>
    </div>
    <br />
    <strong>Dear {{fullName}},</strong>
    <p>
      We are pleased to inform you that your contract as <b>{{designation}}</b> at <b>The Truth International</b> has been renewed.
    </p>
    <p>
      <strong>Renewal Details:</strong><br />
      <strong>Department:</strong> {{department}}<br />
      <strong>Designation:</strong> {{designation}}<br />
      <strong>Contract Duration:</strong> {{contractDuration}}<br />
      <strong>Start Date:</strong> {{startDate}}<br />
      <strong>End Date:</strong> {{endDate}}<br />
      <strong>Location:</strong> 2nd Floor, Evacuee Trust Complex, - Aga Khan Road, F-5/1, Islamabad, Pakistan.<br />
      <strong>Salary:</strong> {{salary}}
    </p>
    <p>
      We appreciate your contributions to our organization and look forward to your continued success as part of our team. Please review the attached contract renewal documents for detailed terms and conditions.
    </p>
    <p>
      You can access your employee portal <a href="{{portalLink}}">here</a> to view more details and download the contract documents.
    </p>
    <p style="font-size: 0.9em">
      If you have any questions or need further information, feel free to reach out to the HR department.
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