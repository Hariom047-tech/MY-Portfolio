/**
 * Google Apps Script Web App for the portfolio contact form.
 *
 * It receives a POST from the website and appends one row to the sheet,
 * matching the columns: customer_name | customer_phone | call_time | status | customer_gmail
 *
 * SETUP (one time):
 *  1. Open your Google Sheet ("Customer call details").
 *  2. Menu: Extensions -> Apps Script.
 *  3. Delete any default code, paste THIS whole file, then Save.
 *  4. Click "Deploy" -> "New deployment".
 *  5. Type = "Web app".
 *       - Description: contact form
 *       - Execute as: Me
 *       - Who has access: Anyone
 *  6. Click "Deploy", authorize when asked, then copy the Web app URL.
 *     (It looks like https://script.google.com/macros/s/XXXX/exec )
 *  7. Put that URL into the website env var REACT_APP_SHEET_WEBHOOK_URL
 *     (frontend/.env locally, and in Vercel project settings for production).
 *
 * If you change this code later, you must Deploy -> Manage deployments ->
 * edit the existing deployment -> "New version" (otherwise the URL serves old code).
 */

// Change this if your tab is not named "Sheet1".
var SHEET_NAME = "Sheet1";

function doPost(e) {
  try {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var sheet = ss.getSheetByName(SHEET_NAME) || ss.getSheets()[0];

    var data = {};
    if (e && e.postData && e.postData.contents) {
      data = JSON.parse(e.postData.contents);
    }

    var now = Utilities.formatDate(
      new Date(),
      ss.getSpreadsheetTimeZone() || "Asia/Kolkata",
      "HH:mm"
    );

    sheet.appendRow([
      data.customer_name || "",
      data.customer_phone || "",
      data.call_time || now,
      data.status || "pending",
      data.customer_gmail || "",
    ]);

    return ContentService
      .createTextOutput(JSON.stringify({ result: "success" }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ result: "error", message: String(err) }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

// Lets you open the /exec URL in a browser to confirm it is live.
function doGet() {
  return ContentService
    .createTextOutput(JSON.stringify({ status: "ok", message: "Contact webhook is live" }))
    .setMimeType(ContentService.MimeType.JSON);
}
