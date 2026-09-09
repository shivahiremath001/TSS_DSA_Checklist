// ============================================================
//  DSA Tracker – Google Apps Script Backend
//  Deploy as Web App: Execute as "Me", Access "Anyone"
// ============================================================

var SPREADSHEET_ID = SpreadsheetApp.getActiveSpreadsheet().getId();
var USERS_SHEET    = "Users";
var LB_SHEET       = "Leaderboard";
var PROBLEMS_SHEET = "Problems";
var PENDING_SHEET  = "PendingUsers";   // Temporary OTP store

// Total number of problems tracked
var TOTAL_PROBLEMS = 150;
// Column index (1-based) where Q1 starts in Users sheet (col J = 10)
var Q_START_COL    = 10;

// OTP expiry: 5 minutes in milliseconds
var OTP_EXPIRY_MS  = 5 * 60 * 1000;

// Column (1-based) that stores last password-reset timestamp (epoch ms)
// Sits after Q1-Q150 (cols J=10 to col 159), so col 160
var LAST_RESET_COL = 160;

// -------------------------------------------------------
// Entry point – handles every POST from the frontend
// Content-Type: text/plain bypasses CORS preflight
// -------------------------------------------------------
function doPost(e) {
  var output = ContentService.createTextOutput();
  output.setMimeType(ContentService.MimeType.JSON);

  try {
    var request = JSON.parse(e.postData.contents);
    var action  = request.action;
    var result;

    switch (action) {
      case "register":       result = register(request);       break;
      case "login":          result = login(request);          break;
      case "updateProgress": result = updateProgress(request); break;
      case "getLeaderboard": result = getLeaderboard();        break;
      case "resetPassword":  result = resetPassword(request);  break;
      case "changePassword": result = changePassword(request); break;
      case "sendOtp":        result = sendOtp(request);        break;
      case "verifyOtp":      result = verifyOtp(request);      break;
      default:
        result = { success: false, message: "Unknown action: " + action };
    }

    output.setContent(JSON.stringify(result));
  } catch (err) {
    output.setContent(JSON.stringify({ success: false, message: err.toString() }));
  }

  return output;
}

// Also allow GET for quick health-check from browser
function doGet(e) {
  return ContentService
    .createTextOutput(JSON.stringify({ status: "DSA Tracker API is live" }))
    .setMimeType(ContentService.MimeType.JSON);
}

// ============================================================
//  HELPERS
// ============================================================

function getSheet(name) {
  return SpreadsheetApp.getActiveSpreadsheet().getSheetByName(name);
}

/** Returns the row index (1-based) for a user by USN, or -1 if not found. */
function findUserRow(sheet, usn) {
  var data = sheet.getDataRange().getValues();
  for (var i = 1; i < data.length; i++) {   // skip header row (i=0)
    if (String(data[i][3]).toUpperCase() === String(usn).toUpperCase()) {
      return i + 1;   // 1-based sheet row
    }
  }
  return -1;
}

/** Reads all column values for a given row (1-based). */
function getUserRow(sheet, rowIndex) {
  return sheet.getRange(rowIndex, 1, 1, sheet.getLastColumn()).getValues()[0];
}

/** Generates a random alphanumeric password of given length. */
function randomPassword(length) {
  var chars = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789";
  var pwd   = "";
  for (var i = 0; i < length; i++) {
    pwd += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return pwd;
}

/**
 * SHA-256 hash using GAS built-in Utilities.
 * Returns lowercase hex string — matches what the frontend sends.
 */
function sha256Hex(message) {
  var bytes  = Utilities.computeDigest(Utilities.DigestAlgorithm.SHA_256, message, Utilities.Charset.UTF_8);
  var hex    = "";
  for (var i = 0; i < bytes.length; i++) {
    var b = bytes[i];
    if (b < 0) b += 256;          // GAS returns signed bytes
    hex += (b < 16 ? "0" : "") + b.toString(16);
  }
  return hex;
}

/** Generates a 6-digit numeric OTP. */
function generateOtp() {
  return String(Math.floor(100000 + Math.random() * 900000));
}

/**
 * Finds a row in PendingUsers by USN (col A = index 0).
 * Returns 1-based row index or -1.
 */
function findPendingRow(sheet, usn) {
  var data = sheet.getDataRange().getValues();
  for (var i = 1; i < data.length; i++) {
    if (String(data[i][0]).toUpperCase() === String(usn).toUpperCase()) {
      return i + 1;
    }
  }
  return -1;
}

// ============================================================
//  ACTION: register  (legacy – kept for backwards compatibility)
//  Payload: firstName, lastName, usn, email, leetcodeUsername, password (SHA-256 hex)
// ============================================================
function register(req) {
  var sheet = getSheet(USERS_SHEET);

  // Check USN uniqueness
  if (findUserRow(sheet, req.usn) !== -1) {
    return { success: false, message: "USN already registered." };
  }

  // Check email uniqueness
  var data = sheet.getDataRange().getValues();
  for (var i = 1; i < data.length; i++) {
    if (String(data[i][4]).toLowerCase() === String(req.email).toLowerCase()) {
      return { success: false, message: "Email already registered." };
    }
  }

  var lastRow = sheet.getLastRow();
  var newRow  = lastRow + 1;
  var slNo    = lastRow; // header is row 1, so first user = sl 1

  // Build the row: A-I then Q1-Q150
  var rowData = [slNo, req.firstName, req.lastName, req.usn.toUpperCase(),
                 req.email, req.leetcodeUsername, req.password, 0, 0];

  // Append 150 zeros for Q1–Q150
  for (var q = 0; q < TOTAL_PROBLEMS; q++) {
    rowData.push(0);
  }

  sheet.appendRow(rowData);

  // Set formulas for Total Solved (col H=8) and Percentage (col I=9)
  var hCell = sheet.getRange(newRow, 8);
  var iCell = sheet.getRange(newRow, 9);
  hCell.setFormula("=COUNTIF(J" + newRow + ":FC" + newRow + ",1)");
  iCell.setFormula("=ROUND((H" + newRow + "/150)*100,1)");

  return { success: true, message: "Registration successful." };
}

// ============================================================
//  ACTION: sendOtp
//  Payload: firstName, lastName, usn, email, leetcodeUsername, password (SHA-256 hex)
//
//  1. Validates USN + email uniqueness in Users sheet
//  2. Generates OTP, stores in PendingUsers sheet
//  3. Sends OTP email via MailApp
// ============================================================
function sendOtp(req) {
  var usersSheet   = getSheet(USERS_SHEET);
  var pendingSheet = getSheet(PENDING_SHEET);

  if (!pendingSheet) {
    return { success: false, message: "PendingUsers sheet not found. Please create it." };
  }

  // ── Validate uniqueness in confirmed Users ───────────────────
  if (findUserRow(usersSheet, req.usn) !== -1) {
    return { success: false, message: "USN already registered." };
  }
  var usersData = usersSheet.getDataRange().getValues();
  for (var i = 1; i < usersData.length; i++) {
    if (String(usersData[i][4]).toLowerCase() === String(req.email).toLowerCase()) {
      return { success: false, message: "Email already registered." };
    }
  }

  // ── Generate OTP and expiry ───────────────────────────────────
  var otp    = generateOtp();
  var expiry = new Date().getTime() + OTP_EXPIRY_MS;

  // ── Upsert into PendingUsers ──────────────────────────────────
  // Columns: USN | Email | FirstName | LastName | LeetcodeUsername | PasswordHash | OTP | ExpiryTimestamp
  var existingRow = findPendingRow(pendingSheet, req.usn);
  var rowData = [
    req.usn.toUpperCase(),
    req.email,
    req.firstName,
    req.lastName,
    req.leetcodeUsername,
    req.password,
    otp,
    expiry
  ];

  if (existingRow !== -1) {
    // Overwrite existing pending entry (resend OTP)
    pendingSheet.getRange(existingRow, 1, 1, rowData.length).setValues([rowData]);
  } else {
    pendingSheet.appendRow(rowData);
  }

  // ── Send OTP email ───────────────────────────────────────────
  MailApp.sendEmail({
    to:      req.email,
    subject: "TSS DSA Tracker — Email Verification Code",
    body:
      "Hey " + req.firstName + ",\n\n" +
      "Your verification code for TSS DSA Tracker is:\n\n" +
      "    " + otp + "\n\n" +
      "This code expires in 5 minutes.\n\n" +
      "If you didn't request this, ignore this email.\n\n" +
      "— TSS CS Club"
  });

  return { success: true, message: "OTP sent to " + req.email };
}

// ============================================================
//  ACTION: verifyOtp
//  Payload: usn, otp
//
//  1. Finds row in PendingUsers by USN
//  2. Validates OTP and checks expiry
//  3. Creates account in Users sheet
//  4. Deletes row from PendingUsers
// ============================================================
function verifyOtp(req) {
  var pendingSheet = getSheet(PENDING_SHEET);
  var usersSheet   = getSheet(USERS_SHEET);

  if (!pendingSheet) {
    return { success: false, message: "PendingUsers sheet not found." };
  }

  var rowIdx = findPendingRow(pendingSheet, req.usn);
  if (rowIdx === -1) {
    return { success: false, message: "No pending registration found. Please restart." };
  }

  var row    = pendingSheet.getRange(rowIdx, 1, 1, 8).getValues()[0];
  var storedOtp    = String(row[6]);
  var expiryTs     = Number(row[7]);

  // ── Validate OTP ─────────────────────────────────────────────
  if (String(req.otp).trim() !== storedOtp) {
    return { success: false, message: "Incorrect OTP. Please try again." };
  }

  // ── Check expiry ─────────────────────────────────────────────
  if (new Date().getTime() > expiryTs) {
    // Clean up expired pending row
    pendingSheet.deleteRow(rowIdx);
    return { success: false, message: "OTP expired. Please request a new one." };
  }

  // ── All good — create the user account ───────────────────────
  var usn              = String(row[0]);
  var email            = String(row[1]);
  var firstName        = String(row[2]);
  var lastName         = String(row[3]);
  var leetcodeUsername = String(row[4]);
  var passwordHash     = String(row[5]);

  // Double-check uniqueness (edge case: two parallel registrations)
  if (findUserRow(usersSheet, usn) !== -1) {
    pendingSheet.deleteRow(rowIdx);
    return { success: false, message: "USN already registered." };
  }

  var lastRow  = usersSheet.getLastRow();
  var newRow   = lastRow + 1;
  var slNo     = lastRow;

  var userData = [slNo, firstName, lastName, usn, email, leetcodeUsername, passwordHash, 0, 0];
  for (var q = 0; q < TOTAL_PROBLEMS; q++) {
    userData.push(0);
  }
  usersSheet.appendRow(userData);

  // Set formulas
  usersSheet.getRange(newRow, 8).setFormula("=COUNTIF(J" + newRow + ":FC" + newRow + ",1)");
  usersSheet.getRange(newRow, 9).setFormula("=ROUND((H" + newRow + "/150)*100,1)");

  // ── Remove from PendingUsers ──────────────────────────────────
  pendingSheet.deleteRow(rowIdx);

  return { success: true, message: "Account created successfully!" };
}

// ============================================================
//  ACTION: login
//  Payload: usn, password (SHA-256 hex)
// ============================================================
function login(req) {
  var sheet   = getSheet(USERS_SHEET);
  var rowIdx  = findUserRow(sheet, req.usn);

  if (rowIdx === -1) {
    return { success: false, message: "USN not found." };
  }

  var row = getUserRow(sheet, rowIdx);
  // Col G (index 6) = password hash
  if (row[6] !== req.password) {
    return { success: false, message: "Incorrect password." };
  }

  // Build solved array (Q1-Q150 = columns index 9..158)
  var solvedArray = [];
  for (var q = 0; q < TOTAL_PROBLEMS; q++) {
    solvedArray.push(row[Q_START_COL - 1 + q] === 1 ? 1 : 0);
  }

  return {
    success: true,
    user: {
      slNo:             row[0],
      firstName:        row[1],
      lastName:         row[2],
      usn:              row[3],
      email:            row[4],
      leetcodeUsername: row[5],
      totalSolved:      row[7],
      percentage:       row[8]
    },
    solvedArray: solvedArray
  };
}

// ============================================================
//  ACTION: updateProgress
//  Payload: usn, password, qNumber (1-150), status (0 or 1)
// ============================================================
function updateProgress(req) {
  var sheet  = getSheet(USERS_SHEET);
  var rowIdx = findUserRow(sheet, req.usn);

  if (rowIdx === -1) {
    return { success: false, message: "USN not found." };
  }

  var row = getUserRow(sheet, rowIdx);
  if (row[6] !== req.password) {
    return { success: false, message: "Authentication failed." };
  }

  // Column offset: Q1 is in column J (index 10, 1-based)
  var colIndex = Q_START_COL + (req.qNumber - 1);   // 1-based
  sheet.getRange(rowIdx, colIndex).setValue(req.status === 1 ? 1 : 0);

  // Force formula recalc by reading the totalSolved cell
  SpreadsheetApp.flush();
  var totalSolved = sheet.getRange(rowIdx, 8).getValue();

  return { success: true, totalSolved: totalSolved };
}

// ============================================================
//  ACTION: getLeaderboard
//  Returns top-20 rows from the Leaderboard tab
// ============================================================
function getLeaderboard() {
  var sheet = getSheet(LB_SHEET);
  var data  = sheet.getDataRange().getValues();

  // Row 0 = headers, rows 1.. = data (already sorted by SORT formula)
  var rows = [];
  var limit = Math.min(data.length - 1, 20);

  for (var i = 1; i <= limit; i++) {
    var r = data[i];
    if (!r[0] && !r[2]) continue; // skip empty rows
    rows.push({
      rank:             i,
      firstName:        r[0],
      lastName:         r[1],
      usn:              r[2],
      leetcodeUsername: r[3],
      totalSolved:      r[4],
      percentage:       r[5]
    });
  }

  return { success: true, leaderboard: rows };
}

// ============================================================
//  ACTION: resetPassword
//  Payload: usn, email
//
//  Rate-limited: 1 reset per calendar day (UTC) per user.
//  Temp password is SHA-256 hashed before storing so the
//  existing login flow works without any frontend changes.
// ============================================================
function resetPassword(req) {
  var sheet  = getSheet(USERS_SHEET);
  var rowIdx = findUserRow(sheet, req.usn);

  if (rowIdx === -1) {
    return { success: false, message: "USN not found." };
  }

  var row = getUserRow(sheet, rowIdx);
  if (String(row[4]).toLowerCase() !== String(req.email).toLowerCase()) {
    return { success: false, message: "Email does not match our records." };
  }

  // ── Rate-limit check: 1 reset per day ────────────────────────
  var lastResetTs = sheet.getRange(rowIdx, LAST_RESET_COL).getValue();
  if (lastResetTs) {
    var lastDate = new Date(Number(lastResetTs));
    var now      = new Date();
    // Compare calendar date in UTC
    var sameDay  =
      lastDate.getUTCFullYear() === now.getUTCFullYear() &&
      lastDate.getUTCMonth()    === now.getUTCMonth()    &&
      lastDate.getUTCDate()     === now.getUTCDate();
    if (sameDay) {
      return { success: false, message: "You can only reset your password once per day. Please try again tomorrow." };
    }
  }

  // ── Generate temp password and hash it ───────────────────────
  var tempPwd    = randomPassword(8);
  var hashedPwd  = sha256Hex(tempPwd);

  // Store the hash (matches what login expects)
  sheet.getRange(rowIdx, 7).setValue(hashedPwd);

  // Record the reset timestamp for rate-limiting
  sheet.getRange(rowIdx, LAST_RESET_COL).setValue(new Date().getTime());

  MailApp.sendEmail({
    to:      req.email,
    subject: "DSA Tracker – Password Reset",
    body:    "Hello " + row[1] + ",\n\n" +
             "Your DSA Tracker password has been reset.\n\n" +
             "Temporary Password: " + tempPwd + "\n\n" +
             "Please log in and change your password immediately via Account Settings.\n\n" +
             "— TSS CS Club"
  });

  return { success: true, message: "A temporary password has been sent to your email." };
}

// ============================================================
//  ACTION: changePassword
//  Payload: usn, oldPassword (SHA-256 hex), newPassword (SHA-256 hex)
// ============================================================
function changePassword(req) {
  var sheet  = getSheet(USERS_SHEET);
  var rowIdx = findUserRow(sheet, req.usn);

  if (rowIdx === -1) {
    return { success: false, message: "USN not found." };
  }

  var row = getUserRow(sheet, rowIdx);
  if (row[6] !== req.oldPassword) {
    return { success: false, message: "Current password is incorrect." };
  }

  sheet.getRange(rowIdx, 7).setValue(req.newPassword);
  return { success: true, message: "Password changed successfully." };
}
