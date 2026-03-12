// BODA DANIELA & ALFONSO — Form Responses
// Paste this entire file into Google Apps Script (Extensions → Apps Script)
// Then deploy as a Web App.

function doPost(e) {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const data = JSON.parse(e.postData.contents);
    const timestamp = new Date().toLocaleString('es-MX', { timeZone: 'America/Mexico_City' });

    if (data.formType === 'transportation') {
      const sheet = ss.getSheetByName('Transportation');
      sheet.appendRow([
        timestamp,
        data.transportChoice,
        data.name,
        data.guestName || ''
      ]);
    } else if (data.formType === 'rsvp') {
      const sheet = ss.getSheetByName('RSVP');
      sheet.appendRow([
        timestamp,
        data.attendance,
        data.name,
        data.guestName || '',
        data.email,
        data.phone || ''
      ]);
    }

    return ContentService
      .createTextOutput(JSON.stringify({ status: 'success' }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ status: 'error', message: err.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

// Adds column headers on first run — run this once manually after setup
function setupHeaders() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();

  const rsvp = ss.getSheetByName('RSVP');
  rsvp.getRange('A1:F1').setValues([[
    'Timestamp', 'Attendance', 'Name', 'Guest Name', 'Email', 'Phone'
  ]]);
  rsvp.getRange('A1:F1').setFontWeight('bold');

  const transport = ss.getSheetByName('Transportation');
  transport.getRange('A1:D1').setValues([[
    'Timestamp', 'Transportation Choice', 'Name', 'Guest Name'
  ]]);
  transport.getRange('A1:D1').setFontWeight('bold');
}
