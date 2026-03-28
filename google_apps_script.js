// INSTRUCTIONS to connect your Google Sheet:
// 1. Open your Google Sheet: https://docs.google.com/spreadsheets/d/1NAZajNnyFnvnNcqzDAj387eH8bwInQZFkaysLTZc3xM/edit
// 2. Click on "Extensions" in the top menu, then select "Apps Script".
// 3. Delete any code in the editor and paste ALL the code below.
// 4. Click the "Save" icon (or File > Save).
// 5. Click the "Deploy" button on the top right, and select "New deployment".
// 6. Click the "gear" icon next to "Select type" and choose "Web app".
// 7. Under "Execute as", select "Me (<your email>)".
// 8. Under "Who has access", select "Anyone".
// 9. Click "Deploy". (You may need to "Authorize access" - click through the warnings since it's your own script).
// 10. Copy the generated "Web app URL".
// 11. Go back to script.js and paste this URL where it says 'YOUR_WEB_APP_URL_HERE' on line 58.

function doGet(e) {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  
  // Set up the Name and No of Vote columns if the sheet is completely empty
  if (sheet.getLastRow() === 0) {
    sheet.getRange("A1").setValue("Name");
    sheet.getRange("B1").setValue("No of Vote");
    sheet.getRange("A1:B1").setFontWeight("bold");
  }
  
  var candidateName = e.parameter.name;
  
  if (!candidateName) {
    return ContentService.createTextOutput("Missing candidate name.");
  }
  
  var data = sheet.getDataRange().getValues();
  var found = false;
  
  // Start searching from row index 1 (row 2 in sheet) to skip the header
  for (var i = 1; i < data.length; i++) {
    if (data[i][0] === candidateName) {
      // If the candidate name exists, increment their vote count
      var currentVotes = parseInt(data[i][1]) || 0;
      sheet.getRange(i + 1, 2).setValue(currentVotes + 1);
      found = true;
      break;
    }
  }
  
  if (!found) {
    // If candidate isn't in the sheet yet, append a new row for them with 1 vote
    sheet.appendRow([candidateName, 1]);
  }
  
  return ContentService.createTextOutput("Success");
}
