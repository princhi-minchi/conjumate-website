/**
 * Google Apps Script for ConjuMate Waitlist
 * 
 * INSTRUCTIONS:
 * 1. Open a new Google Sheet.
 * 2. Go to Extensions > Apps Script.
 * 3. Delete the default code and paste this in.
 * 4. Save and click "Deploy" > "New Deployment".
 * 5. Select "Web App".
 * 6. Set "Execute as" to "Me".
 * 7. Set "Who has access" to "Anyone".
 * 8. Deploy and copy the Web App URL.
 * 9. Paste the URL into the SCRIPT_URL variable in your App.jsx file.
 */

function doPost(e) {
  try {
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    const contents = e.postData.contents;
    
    if (!contents) throw new Error("No data provided");
    
    const data = JSON.parse(contents);
    const email = data.email?.trim();
    
    // 1. Basic Email Validation (Server-side)
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
      throw new Error("Invalid email format");
    }

    // 2. Honeypot Check (Must match the name used in Vite/React)
    if (data.hp_field) {
       // Silently succeed to not alert bots, but don't save.
       return ContentService.createTextOutput(JSON.stringify({ status: 'success', note: 'Bot rejected' }))
        .setMimeType(ContentService.MimeType.JSON);
    }
    
    // 3. Append Row: Email, Timestamp, User-agent, Consent, Consent Timestamp
    sheet.appendRow([
      email, 
      new Date().toISOString(), 
      data.userAgent || "Unknown",
      data.consent || false,
      data.consentTimestamp || ""
    ]);
    
    return ContentService.createTextOutput(JSON.stringify({ status: 'success' }))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({ status: 'error', message: "Submission failed" }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

// Handle preflight OPTIONS request for CORS (if needed, though 'no-cors' in fetch bypasses this)
function doOptions(e) {
  return ContentService.createTextOutput("")
    .setMimeType(ContentService.MimeType.TEXT);
}
