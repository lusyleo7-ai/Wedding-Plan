# Iqbal & Lusyana — Digital Wedding Invitation

A mobile-first, single-page wedding invitation with a live RSVP form backed by
Google Sheets, a real-time wishes wall, a countdown, Google Maps and Google
Calendar integration.

No build step, no framework, no dependencies. Plain HTML + CSS + JavaScript, so
it loads fast on any phone and will still work in five years.

---

## 1. Files

Everything sits in one flat folder — no subfolders — so uploading to GitHub is a
single "select all".

```
index.html      the page structure
style.css       all styling (burgundy · gold · ivory)
config.js   ★   EVERYTHING YOU EDIT LIVES HERE
main.js         runtime — you shouldn't need to touch this
*.webp          background images (~440 KB total)
song.mp3        ← add your background music with this name
Code.gs         the Google Apps Script backend (not served; just stored here)
README.md       this file
```

**★ `config.js` is the only file you need for day-to-day changes.**
Names, parents, dates, times, venue, bank details, gift address, wording — all
of it is in that one file, commented line by line.

---

## 2. Google Sheets + Apps Script setup (~5 minutes)

You have to do this part yourself — it needs your Google login, which I can't use.

### Step 1 — Create the sheet

1. Go to <https://sheets.new>
2. Name it something like **Wedding RSVP — Iqbal & Lusyana**

### Step 2 — Add the script

1. In that sheet: **Extensions → Apps Script**
2. Delete whatever is in `Code.gs`
3. Open `Code.gs` from this project, copy **the whole file**, paste it in
4. Click the 💾 save icon

### Step 3 — Authorise it

1. In the function dropdown at the top, pick **`setup`**
2. Click **Run**
3. Google will warn you: **Review permissions → choose your account →
   Advanced → Go to (project name) (unsafe) → Allow**
   *(This warning is normal for your own private scripts.)*
4. A tab named **RSVP** appears in your sheet, with formatted headers. 

### Step 4 — Deploy it as a web app

1. **Deploy → New deployment**
2. Click the ⚙️ gear next to "Select type" → **Web app**
3. Set:
   - **Description:** `RSVP v1`
   - **Execute as:** **Me**
   - **Who has access:** **Anyone** ← *must be "Anyone", not "Anyone with Google account"*
4. **Deploy** → copy the **Web app URL**. It looks like:
   ```
   https://script.google.com/macros/s/AKfycbx................/exec
   ```

### Step 5 — Connect it to the site

Open `config.js` and paste that URL:

```js
rsvpEndpoint: "https://script.google.com/macros/s/AKfycbx..../exec",
```

Save, commit, push. Done — RSVPs now land in your sheet in real time, and every
message appears on the wishes wall within ~20 seconds.

> **Until `rsvpEndpoint` is filled in, the form runs in DEMO mode:** it looks and
> behaves normally but saves nothing, and says so after submitting.

### ⚠️ If you ever edit `Code.gs`

You must redeploy, or the live URL keeps running the old code:

**Deploy → Manage deployments → ✏️ (pencil) → Version: *New version* → Deploy**

The URL stays the same.

---

## 3. Google Sheets structure

Tab name: **`RSVP`**

| Col | Header | Type | Notes |
|-----|--------|------|-------|
| A | `Timestamp` | date/time | Set by the server, formatted `yyyy-mm-dd hh:mm:ss` |
| B | `Name` | text | Max 100 chars |
| C | `Attendance` | text | `Attending` or `Not Attending` |
| D | `Guests` | number | 0–20; forced to 0 when Not Attending |
| E | `Message` | text | Max 500 chars; blank rows are skipped on the wishes wall |
| F | `Device` | text | Browser/user-agent, for troubleshooting |
| G | `Source` | text | The page URL, so you can see which invite link was used |

One row per submission, appended in order. Nothing is ever overwritten.

**Useful formulas** — paste into any empty cell on a second tab:

```
=COUNTIF(RSVP!C:C,"Attending")            → number of positive replies
=SUMIF(RSVP!C:C,"Attending",RSVP!D:D)     → total headcount
=COUNTIF(RSVP!C:C,"Not Attending")        → number of regrets
=COUNTA(RSVP!B:B)-1                       → total replies
```

**Export:** File → Download → `.xlsx` / `.csv`.

**Live counts without opening the sheet:** visit
`<your web app URL>?action=stats` in a browser.

---

## 4. Deploying to GitHub Pages

### Option A — GitHub website (no tools needed)

1. Go to <https://github.com/new>, name the repo **`Wedding-Plan`**, set it
   **Public**, click **Create repository**
2. On the empty repo page click **uploading an existing file**
3. Click **choose your files**, select **all** the files (Ctrl+A), click **Open**
4. Click **Commit changes**
5. **Settings → Pages →** Source: **Deploy from a branch** → Branch: **`main`**,
   folder: **`/ (root)`** → **Save**
6. Wait ~1 minute. Your site is at:
   ```
   https://lusyleo7-ai.github.io/Wedding-Plan/
   ```

### Option B — Command line

```bash
cd "path/to/this/folder"
git init
git add -A
git commit -m "Wedding invitation"
git branch -M main
git remote add origin https://github.com/lusyleo7-ai/Wedding-Plan.git
git push -u origin main
```

Then do step 5 above (Settings → Pages).

### Custom domain (optional)

Buy a domain, then in **Settings → Pages → Custom domain** enter e.g.
`iqbal-lusyana.com`, and at your registrar add these DNS records:

```
A     @    185.199.108.153
A     @    185.199.109.153
A     @    185.199.110.153
A     @    185.199.111.153
CNAME www  lusyleo7-ai.github.io
```

Tick **Enforce HTTPS** once the certificate is issued (a few minutes).

---

## 5. Personalised links for each guest

Add `?to=` and the guest's name to the URL. The cover shows **"Dear <name>"** and
their name is pre-filled in the RSVP form:

```
https://lusyleo7-ai.github.io/Wedding-Plan/?to=Ade%20Fitriyani
https://lusyleo7-ai.github.io/Wedding-Plan/?to=Keluarga%20Bapak%20Rudi
```

Use `%20` for a space (or just type a space — most chat apps handle it).
`?guest=` and `?kepada=` work too.

**Tip:** put your guest list in a spreadsheet and build the links with a formula:

```
="https://lusyleo7-ai.github.io/Wedding-Plan/?to="&ENCODEURL(A2)
```

---

## 6. Adding your own media

### Pre-wedding photos

1. Resize to roughly **1000 px wide**, save as `.webp` or `.jpg` (aim for under 150 KB each)
2. Add them to the repository — e.g. `groom.webp`, `bride.webp`
3. In `config.js`:
   ```js
   groomPhoto: "groom.webp",
   bridePhoto: "bride.webp",
   ```
   Leave them `""` and an elegant gold monogram shows instead.

The portrait frames are arch-shaped and **190 × 250** — a vertical (portrait)
crop looks best.

### Background music

1. Add an `.mp3` to the repository named `song.mp3` (**keep it under ~3 MB** — mobile data)
2. That's it. The floating music button appears automatically, fades the track in
   when a guest opens the invitation, and fades out when they switch tabs.
3. If the file is missing, the button hides itself — nothing breaks.

> Your `Song.txt` was a **Spotify playlist link**, not an audio file. Spotify
> can't be used as autoplay background music on a website, so the playlist is
> linked from the closing section instead ("Listen to our playlist"), and the
> music button waits for a real MP3.

### Changing the background photos

Replace any of these keeping the same filename and the site picks it up:

| File | Used for |
|------|----------|
| `hero-aisle.webp` | the opening cover |
| `arch.webp` | behind the countdown |
| `velvet.webp` | behind the RSVP form |
| `stationery.webp` | behind the closing section |
| `rings.webp` | spare (not currently placed) |

---

## 7. Common edits — quick reference

All in `config.js`:

| I want to… | Change |
|---|---|
| Fix a parent's name | `couple.groomFather` / `groomMother` / `brideFather` / `brideMother` |
| Change the wedding date | `weddingDate` **and** each event's `start` / `end` **and** `dateLabel` |
| Change ceremony times | `events[].timeLabel` (what guests read) and `events[].start`/`end` (the calendar link) |
| Add a third event | Copy an object in the `events` array; `icon` can be `ring`, `glass` or `heart` |
| Set the venue name/address | `venue.name`, `venue.addressLine` |
| Move the map pin | `venue.lat` / `venue.lng` — get them by right-clicking the spot in Google Maps and clicking the coordinates to copy |
| Add a second bank account | Add another object to `gift.banks` |
| Reword anything on the page | The `text` block at the bottom |
| Add Instagram links | `couple.groomInstagram` / `brideInstagram` (just the handle) |

After editing: save → commit → push. GitHub Pages redeploys in under a minute.
Hard-refresh on your phone (or open in a private tab) if you still see the old version.

---

## 8. Single-file version (optional)

`build-single-file.py` (in the zip Claude sent) produces `invitation-single-file.html` — the whole
invitation, images and all, in one file you can email or open offline. The Google
Maps embed won't render from a local file, but everything else works. The hosted
`index.html` is the real deliverable; this is just a convenience.

---

## 9. Troubleshooting

| Symptom | Cause / fix |
|---|---|
| Form says "Something went wrong" | `rsvpEndpoint` is wrong, or the deployment's access isn't set to **Anyone**. Re-check Step 4. |
| RSVPs save but wishes never appear | You edited `Code.gs` and didn't redeploy a **new version**. |
| Only *some* wishes show | Rows with an empty **Message** are intentionally skipped. |
| Wishes wall is slow to update | It polls every 20 s. Lower `wishesRefreshMs` in config (minimum 8000). |
| Music button never appears | No `song.mp3` in the repository, or the file is corrupt. |
| Music doesn't start on iPhone | iOS only allows audio after a tap — it starts when the guest taps **Open Invitation**. That's expected. |
| Countdown shows the wrong time | The `+07:00` offset in `weddingDate` must match the wedding's timezone (WIB `+07:00`, WITA `+08:00`, WIT `+09:00`). |
| Site shows an old version | Browser cache. Hard-refresh, or open in a private tab. |
| 404 after pushing | Settings → Pages, confirm branch `main` and folder `/ (root)`. |

---

## 10. Before you send it out — checklist

- [ ] Groom's parents' real names in `config.js` (currently the placeholders "Bapak" / "Ibu")
- [ ] Venue **name** and **full address** (currently a placeholder)
- [ ] Akad and Resepsi times confirmed
- [ ] Bank **name** filled in next to the account number
- [ ] `rsvpEndpoint` connected and tested with a real submission
- [ ] Real pre-wedding photos added
- [ ] Background music added
- [ ] Opened on one iPhone and one Android
- [ ] A personalised `?to=` link tested
- [ ] "Add to Calendar" and "Open in Google Maps" both tested on a phone
