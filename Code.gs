/****************************************************************
 * WEDDING RSVP  —  Google Apps Script backend
 * Iqbal & Lusyana
 * ---------------------------------------------------------------
 * WHAT THIS DOES
 *   • POST  → appends one new row to the "RSVP" sheet
 *   • GET ?action=wishes → returns the guest wishes as JSON
 *                          (supports &callback= for JSONP)
 *   • GET ?action=stats  → quick counts, handy for you
 *
 * SETUP (5 minutes) — see README.md for screenshots-level detail
 *   1. Open your Google Sheet → Extensions → Apps Script
 *   2. Delete everything in Code.gs and paste this whole file
 *   3. Save, then run `setup` once and approve the permissions
 *   4. Deploy → New deployment → Web app
 *        Execute as:      Me
 *        Who has access:  Anyone
 *   5. Copy the /exec URL into assets/js/config.js → rsvpEndpoint
 *
 * ⚠️  Every time you EDIT this file you must Deploy → Manage
 *     deployments → Edit (pencil) → Version: New version → Deploy.
 *     Otherwise the live URL keeps running the old code.
 ****************************************************************/

var SHEET_NAME = 'RSVP';
var HEADERS = ['Timestamp', 'Name', 'Attendance', 'Guests', 'Message', 'Device', 'Source'];

/* ---------------------------------------------------------------
   Run this ONCE from the editor to create/format the sheet.
   --------------------------------------------------------------- */
function setup() {
  var sh = getSheet_();
  SpreadsheetApp.getActiveSpreadsheet().toast('Sheet "' + SHEET_NAME + '" is ready.', 'Setup complete', 5);
  return sh.getName();
}

function getSheet_() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sh = ss.getSheetByName(SHEET_NAME);

  if (!sh) {
    sh = ss.insertSheet(SHEET_NAME);
  }

  if (sh.getLastRow() === 0) {
    sh.appendRow(HEADERS);
  }

  // Format the header row (idempotent — safe to run any time)
  var head = sh.getRange(1, 1, 1, HEADERS.length);
  head.setValues([HEADERS])
      .setFontWeight('bold')
      .setBackground('#3B0D1C')
      .setFontColor('#E4C77E')
      .setVerticalAlignment('middle');
  sh.setFrozenRows(1);
  sh.setRowHeight(1, 34);

  var widths = [170, 200, 130, 80, 420, 220, 260];
  for (var i = 0; i < widths.length; i++) sh.setColumnWidth(i + 1, widths[i]);

  sh.getRange('A:A').setNumberFormat('yyyy-mm-dd hh:mm:ss');
  sh.getRange('E:E').setWrap(true);

  return sh;
}

/* ---------------------------------------------------------------
   POST — save one RSVP
   --------------------------------------------------------------- */
function doPost(e) {
  var lock = LockService.getScriptLock();
  try {
    lock.waitLock(20000);

    var data = parseBody_(e);

    var name = clean_(data.name, 100);
    if (!name) return json_({ ok: false, error: 'Name is required' });

    var attendance = data.attendance === 'Attending' ? 'Attending' : 'Not Attending';
    var guests = Math.max(0, Math.min(20, parseInt(data.guests, 10) || 0));
    if (attendance === 'Not Attending') guests = 0;

    var message = clean_(data.message, 500);

    getSheet_().appendRow([
      new Date(),
      name,
      attendance,
      guests,
      message,
      clean_(data.userAgent, 200),
      clean_(data.page, 250)
    ]);

    try { notify_(name, attendance, guests, message); } catch (ignored) {}

    return json_({ ok: true, name: name, attendance: attendance, guests: guests });

  } catch (err) {
    return json_({ ok: false, error: String(err && err.message || err) });
  } finally {
    try { lock.releaseLock(); } catch (ignored) {}
  }
}

/* ---------------------------------------------------------------
   GET — read wishes (and a small stats endpoint)
   --------------------------------------------------------------- */
function doGet(e) {
  var p = (e && e.parameter) || {};
  var action = p.action || 'wishes';
  var cb = p.callback || '';

  try {
    if (action === 'stats') return json_(stats_(), cb);
    return json_({ ok: true, wishes: wishes_(parseInt(p.limit, 10) || 200) }, cb);
  } catch (err) {
    return json_({ ok: false, error: String(err && err.message || err), wishes: [] }, cb);
  }
}

function wishes_(limit) {
  var sh = getSheet_();
  var last = sh.getLastRow();
  if (last < 2) return [];

  var rows = sh.getRange(2, 1, last - 1, HEADERS.length).getValues();
  var out = [];

  for (var i = rows.length - 1; i >= 0 && out.length < limit; i--) {
    var r = rows[i];
    var msg = String(r[4] == null ? '' : r[4]).trim();
    if (!msg) continue;                       // only rows that left a message
    out.push({
      name: String(r[1] || 'Guest'),
      attendance: String(r[2] || ''),
      guests: Number(r[3] || 0),
      message: msg,
      timestamp: r[0] instanceof Date ? r[0].toISOString() : String(r[0])
    });
  }
  return out;                                 // newest first
}

function stats_() {
  var sh = getSheet_();
  var last = sh.getLastRow();
  var s = { ok: true, total: 0, attending: 0, notAttending: 0, headcount: 0, wishes: 0 };
  if (last < 2) return s;

  var rows = sh.getRange(2, 1, last - 1, HEADERS.length).getValues();
  rows.forEach(function (r) {
    s.total++;
    if (String(r[2]) === 'Attending') { s.attending++; s.headcount += Number(r[3] || 0); }
    else s.notAttending++;
    if (String(r[4] || '').trim()) s.wishes++;
  });
  return s;
}

/* ---------------------------------------------------------------
   Helpers
   --------------------------------------------------------------- */
function parseBody_(e) {
  if (!e) return {};

  // Preferred path: JSON sent as text/plain (no CORS preflight)
  if (e.postData && e.postData.contents) {
    try { return JSON.parse(e.postData.contents); } catch (ignored) {}
  }
  // Fallbacks: classic form posts / query string
  if (e.parameter && Object.keys(e.parameter).length) return e.parameter;
  return {};
}

function clean_(v, max) {
  return String(v == null ? '' : v)
    .replace(/[\u0000-\u001F\u007F]/g, '')   // strip control characters
    .trim()
    .slice(0, max || 200);
}

function json_(obj, callback) {
  var body = JSON.stringify(obj);
  if (callback && /^[A-Za-z_$][\w$]*$/.test(callback)) {
    return ContentService
      .createTextOutput(callback + '(' + body + ');')
      .setMimeType(ContentService.MimeType.JAVASCRIPT);
  }
  return ContentService
    .createTextOutput(body)
    .setMimeType(ContentService.MimeType.JSON);
}

/* ---------------------------------------------------------------
   OPTIONAL — email yourself whenever an RSVP arrives.
   Just put your address in NOTIFY_EMAIL below and redeploy
   (Deploy → Manage deployments → Edit → New version → Deploy).
   Leave it as '' and no email is sent.
   --------------------------------------------------------------- */
var NOTIFY_EMAIL = '';   // e.g. 'lusyleo7@gmail.com'

function notify_(name, attendance, guests, message) {
  if (!NOTIFY_EMAIL) return;
  MailApp.sendEmail({
    to: NOTIFY_EMAIL,
    subject: 'New RSVP — ' + name + ' (' + attendance + ')',
    body: name + ' replied "' + attendance + '" for ' + guests + ' guest(s).\n\n' +
          (message ? 'Message:\n' + message : '(no message)')
  });
}
