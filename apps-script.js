// BODA DANIELA & ALFONSO — Form Responses
// Paste this entire file into Google Apps Script (Extensions → Apps Script)
// Then deploy as a Web App.

function getOrCreateSheet(ss, name) {
  var sheet = ss.getSheetByName(name);
  if (!sheet) {
    sheet = ss.insertSheet(name);
  }
  return sheet;
}

function doPost(e) {
  try {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var data = JSON.parse(e.postData.contents);
    var timestamp = new Date().toLocaleString('es-MX', { timeZone: 'America/Mexico_City' });

    if (data.formType === 'transportation') {
      var sheet = getOrCreateSheet(ss, 'Transportation');
      sheet.appendRow([
        timestamp,
        data.transportChoice,
        data.name,
        data.guestName || ''
      ]);
    } else if (data.formType === 'rsvp') {
      var sheet = getOrCreateSheet(ss, 'RSVP');
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

// Run this once manually to set up headers and sheet tabs
function setupHeaders() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();

  var rsvp = getOrCreateSheet(ss, 'RSVP');
  rsvp.getRange('A1:F1').setValues([[
    'Timestamp', 'Attendance', 'Name', 'Guest Name', 'Email', 'Phone'
  ]]);
  rsvp.getRange('A1:F1').setFontWeight('bold');

  var transport = getOrCreateSheet(ss, 'Transportation');
  transport.getRange('A1:D1').setValues([[
    'Timestamp', 'Transportation Choice', 'Name', 'Guest Name'
  ]]);
  transport.getRange('A1:D1').setFontWeight('bold');

  SpreadsheetApp.getUi().alert('Setup complete! Both sheets are ready.');
}
