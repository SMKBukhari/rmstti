export const MeetingInviteMail = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Meeting Invitation</title>
    <style>
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            background-color: #f4f4f4;
        }
        .container {
            background: white;
            padding: 30px;
            border-radius: 10px;
            box-shadow: 0 0 20px rgba(0,0,0,0.1);
        }
        .header {
            text-align: center;
            margin-bottom: 30px;
            padding-bottom: 20px;
            border-bottom: 2px solid #e9ecef;
        }
        .logo {
            max-width: 150px;
            margin-bottom: 20px;
        }
        h1 {
            color: #2c3e50;
            margin: 0;
            font-size: 28px;
        }
        .meeting-details {
            background: #f8f9fa;
            padding: 20px;
            border-radius: 8px;
            margin: 20px 0;
            border-left: 4px solid #007bff;
        }
        .detail-row {
            display: flex;
            margin-bottom: 10px;
            align-items: center;
        }
        .detail-label {
            font-weight: bold;
            min-width: 120px;
            color: #495057;
        }
        .detail-value {
            color: #212529;
        }
        .priority-high {
            color: #dc3545;
            font-weight: bold;
        }
        .priority-medium {
            color: #fd7e14;
            font-weight: bold;
        }
        .priority-low {
            color: #28a745;
            font-weight: bold;
        }
        .action-buttons {
            text-align: center;
            margin: 30px 0;
        }
        .btn {
            display: inline-block;
            padding: 12px 24px;
            margin: 0 10px;
            text-decoration: none;
            border-radius: 5px;
            font-weight: bold;
            text-transform: uppercase;
            letter-spacing: 1px;
        }
        .btn-accept {
            background-color: #28a745;
            color: white;
        }
        .btn-decline {
            background-color: #dc3545;
            color: white;
        }
        .btn-tentative {
            background-color: #ffc107;
            color: #212529;
        }
        .agenda {
            background: #e9ecef;
            padding: 15px;
            border-radius: 5px;
            margin: 15px 0;
        }
        .footer {
            text-align: center;
            margin-top: 30px;
            padding-top: 20px;
            border-top: 1px solid #e9ecef;
            color: #6c757d;
            font-size: 14px;
        }
        .calendar-icon {
            width: 20px;
            height: 20px;
            margin-right: 8px;
            vertical-align: middle;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>📅 Meeting Invitation</h1>
        </div>
        
        <p>Hello <strong>{{participantName}}</strong>,</p>
        
        <p>You have been invited to attend the following meeting:</p>
        
        <div class="meeting-details">
            <div class="detail-row">
                <span class="detail-label">📋 Title:</span>
                <span class="detail-value"><strong>{{meetingTitle}}</strong></span>
            </div>
            <div class="detail-row">
                <span class="detail-label">👤 Organizer:</span>
                <span class="detail-value">{{organizerName}}</span>
            </div>
            <div class="detail-row">
                <span class="detail-label">📅 Date:</span>
                <span class="detail-value">{{meetingDate}}</span>
            </div>
            <div class="detail-row">
                <span class="detail-label">🕐 Time:</span>
                <span class="detail-value">{{meetingTime}}</span>
            </div>
            <div class="detail-row">
                <span class="detail-label">⏱️ Duration:</span>
                <span class="detail-value">{{duration}} minutes</span>
            </div>
            {{#if location}}
            <div class="detail-row">
                <span class="detail-label">📍 Location:</span>
                <span class="detail-value">{{location}}</span>
            </div>
            {{/if}}
            {{#if meetingLink}}
            <div class="detail-row">
                <span class="detail-label">🔗 Meeting Link:</span>
                <span class="detail-value"><a href="{{meetingLink}}" target="_blank">Join Meeting</a></span>
            </div>
            {{/if}}
            <div class="detail-row">
                <span class="detail-label">🏷️ Type:</span>
                <span class="detail-value">{{meetingType}}</span>
            </div>
            <div class="detail-row">
                <span class="detail-label">⚡ Priority:</span>
                <span class="detail-value priority-{{priorityClass}}">{{priority}}</span>
            </div>
        </div>
        
        {{#if description}}
        <div>
            <h3>📝 Description:</h3>
            <p>{{description}}</p>
        </div>
        {{/if}}
        
        {{#if agenda}}
        <div>
            <h3>📋 Agenda:</h3>
            <div class="agenda">
                {{agenda}}
            </div>
        </div>
        {{/if}}
        
        <div class="action-buttons">
            <a href="{{acceptLink}}" class="btn btn-accept">✅ Accept</a>
            <a href="{{tentativeLink}}" class="btn btn-tentative">❓ Tentative</a>
            <a href="{{declineLink}}" class="btn btn-decline">❌ Decline</a>
        </div>
        
        <p><strong>Please respond by:</strong> {{responseDeadline}}</p>
        
        <div class="footer">
            <p>This is an automated message from the HR Management System.</p>
            <p>If you have any questions, please contact the meeting organizer.</p>
        </div>
    </div>
</body>
</html>
`;

export const MeetingReminderMail = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Meeting Reminder</title>
    <style>
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            background-color: #f4f4f4;
        }
        .container {
            background: white;
            padding: 30px;
            border-radius: 10px;
            box-shadow: 0 0 20px rgba(0,0,0,0.1);
        }
        .header {
            text-align: center;
            margin-bottom: 30px;
            padding-bottom: 20px;
            border-bottom: 2px solid #e9ecef;
        }
        .reminder-badge {
            background: #ff6b6b;
            color: white;
            padding: 8px 16px;
            border-radius: 20px;
            font-weight: bold;
            display: inline-block;
            margin-bottom: 20px;
        }
        h1 {
            color: #2c3e50;
            margin: 0;
            font-size: 28px;
        }
        .meeting-details {
            background: #fff3cd;
            padding: 20px;
            border-radius: 8px;
            margin: 20px 0;
            border-left: 4px solid #ffc107;
        }
        .countdown {
            text-align: center;
            font-size: 24px;
            font-weight: bold;
            color: #dc3545;
            margin: 20px 0;
            padding: 15px;
            background: #f8d7da;
            border-radius: 8px;
        }
        .join-button {
            text-align: center;
            margin: 30px 0;
        }
        .btn-join {
            display: inline-block;
            padding: 15px 30px;
            background-color: #007bff;
            color: white;
            text-decoration: none;
            border-radius: 5px;
            font-weight: bold;
            font-size: 18px;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <div class="reminder-badge">⏰ REMINDER</div>
            <h1>Meeting Starting Soon!</h1>
        </div>
        
        <p>Hello <strong>{{participantName}}</strong>,</p>
        
        <div class="countdown">
            🚨 Meeting starts in {{timeUntilMeeting}}
        </div>
        
        <div class="meeting-details">
            <h3>📋 {{meetingTitle}}</h3>
            <p><strong>📅 Date:</strong> {{meetingDate}}</p>
            <p><strong>🕐 Time:</strong> {{meetingTime}}</p>
            <p><strong>👤 Organizer:</strong> {{organizerName}}</p>
            {{#if location}}
            <p><strong>📍 Location:</strong> {{location}}</p>
            {{/if}}
        </div>
        
        {{#if meetingLink}}
        <div class="join-button">
            <a href="{{meetingLink}}" class="btn-join">🔗 Join Meeting Now</a>
        </div>
        {{/if}}
        
        <p>Please make sure you're prepared and ready to join on time.</p>
        
        <div class="footer">
            <p>This is an automated reminder from the HR Management System.</p>
        </div>
    </div>
</body>
</html>
`;

export const MeetingCancelledMail = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Meeting Cancelled</title>
    <style>
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            background-color: #f4f4f4;
        }
        .container {
            background: white;
            padding: 30px;
            border-radius: 10px;
            box-shadow: 0 0 20px rgba(0,0,0,0.1);
        }
        .header {
            text-align: center;
            margin-bottom: 30px;
            padding-bottom: 20px;
            border-bottom: 2px solid #e9ecef;
        }
        .cancelled-badge {
            background: #dc3545;
            color: white;
            padding: 8px 16px;
            border-radius: 20px;
            font-weight: bold;
            display: inline-block;
            margin-bottom: 20px;
        }
        h1 {
            color: #dc3545;
            margin: 0;
            font-size: 28px;
        }
        .meeting-details {
            background: #f8d7da;
            padding: 20px;
            border-radius: 8px;
            margin: 20px 0;
            border-left: 4px solid #dc3545;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <div class="cancelled-badge">❌ CANCELLED</div>
            <h1>Meeting Cancelled</h1>
        </div>
        
        <p>Hello <strong>{{participantName}}</strong>,</p>
        
        <p>The following meeting has been cancelled:</p>
        
        <div class="meeting-details">
            <h3>📋 {{meetingTitle}}</h3>
            <p><strong>📅 Date:</strong> {{meetingDate}}</p>
            <p><strong>🕐 Time:</strong> {{meetingTime}}</p>
            <p><strong>👤 Organizer:</strong> {{organizerName}}</p>
        </div>
        
        {{#if cancellationReason}}
        <div>
            <h3>📝 Reason for Cancellation:</h3>
            <p>{{cancellationReason}}</p>
        </div>
        {{/if}}
        
        <p>We apologize for any inconvenience this may cause.</p>
        
        <div class="footer">
            <p>This is an automated message from the HR Management System.</p>
        </div>
    </div>
</body>
</html>
`;
