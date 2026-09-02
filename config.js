/* ============================================================
   WEDDING INVITATION — CONFIGURATION
   ------------------------------------------------------------
   ⚙️  THIS IS THE ONLY FILE YOU NEED TO EDIT for content changes.
   Everything on the site reads from this object.
   ============================================================ */

const CONFIG = {

  /* ---------- 1. COUPLE ---------- */
  couple: {
    // Short names shown big on the cover
    groomShort: "Iqbal",
    brideShort:  "Lusyana",

    // Full names
    groomFull: "M. Iqbal Septiady",
    brideFull: "Lusyana Leonita",

    // Monogram initials shown in the wax-seal / logo
    initials: "I & L",

    // Parents
    groomFather: "Bapak",                 // ← replace with groom's father's name
    groomMother: "Ibu",                   // ← replace with groom's mother's name
    brideFather: "Bapak Altriwandi",
    brideMother: "Ibu Nefrita Lilianti",

    // Birth order ("the son of" / "the eldest son of" etc.) — optional, leave "" to hide
    groomOrder: "The son of",
    brideOrder: "The daughter of",

    // Optional Instagram handles (leave "" to hide the icon)
    groomInstagram: "",
    brideInstagram: "",

    // Portraits. Drop your real pre-wedding photos into assets/img/
    // and put the filenames here. Leave "" to show the elegant monogram placeholder.
    groomPhoto: "",                       // e.g. "groom.webp"
    bridePhoto: "",                       // e.g. "bride.webp"
  },

  /* ---------- 2. DATE & TIME ----------
     Wedding day in ISO format with the timezone offset.
     Indonesia WIB = +07:00, WITA = +08:00, WIT = +09:00            */
  weddingDate: "2026-12-20T08:00:00+07:00",   // drives the countdown
  timezoneLabel: "WIB",

  /* ---------- 3. EVENTS ----------
     Add or remove events freely — the page renders whatever is here. */
  events: [
    {
      name: "Akad Nikah",
      subtitle: "The Solemnisation",
      dateLabel: "Sunday, 20 December 2026",
      timeLabel: "08.00 — 10.00 WIB",
      // Used for the Google Calendar link (ISO, with offset)
      start: "2026-12-20T08:00:00+07:00",
      end:   "2026-12-20T10:00:00+07:00",
      icon: "ring"
    },
    {
      name: "Resepsi",
      subtitle: "The Wedding Reception",
      dateLabel: "Sunday, 20 December 2026",
      timeLabel: "11.00 — 15.00 WIB",
      start: "2026-12-20T11:00:00+07:00",
      end:   "2026-12-20T15:00:00+07:00",
      icon: "glass"
    }
  ],

  /* ---------- 4. VENUE ---------- */
  venue: {
    name: "Wedding Venue",                       // ← replace with the venue name
    addressLine: "Bukittinggi, West Sumatra, Indonesia", // ← replace with full address
    // Coordinates taken from the Google Maps link you provided
    lat: -0.2725339,
    lng: 100.3904859,
    // Optional: paste any Google Maps share link here. If left "", a link is
    // generated automatically from lat/lng above.
    mapsUrlOverride: ""
  },

  /* ---------- 5. RSVP → GOOGLE SHEETS ----------
     Paste the Web App URL you get after deploying apps-script/Code.gs.
     It looks like: https://script.google.com/macros/s/AKfycb..../exec
     Until this is filled in, the form runs in DEMO mode (nothing is saved). */
  rsvpEndpoint: "",

  /* Refresh interval for the wishes wall, in milliseconds */
  wishesRefreshMs: 20000,

  /* ---------- 6. GIFT ---------- */
  gift: {
    heading: "Wanna give us some gifts?",
    intro: "Your presence is the greatest gift of all. But should you wish to share a token of love, we have provided the details below with all our gratitude.",
    banks: [
      {
        bankName: "Bank Account",              // ← e.g. "Bank Mandiri"
        accountNumber: "025601074426506",
        accountHolder: "Lusyana Leonita"       // ← replace if different
      }
      // add more objects here for extra accounts
    ],
    address: {
      label: "Send a gift to",
      recipient: "Lusyana Leonita",
      line: "Jl Lintas Timur Pos 1 PT RAPP, Kec. Pangkalan Kerinci, Kab. Pelalawan, Riau, 28300"
    }
  },

  /* ---------- 7. MUSIC ----------
     Put an .mp3 next to index.html and set the filename here.
     If the file is missing the music button hides itself automatically. */
  music: {
    file: "song.mp3",
    // Shown in the closing section as a "our playlist" link. Leave "" to hide.
    spotifyPlaylist: "https://open.spotify.com/playlist/3WCfNoDoyNpOF78LwA0bEi?si=245382fd504d4546"
  },

  /* ---------- 8. WORDS ---------- */
  text: {
    coverEyebrow: "The Wedding Of",
    openingGreeting: "Bismillahirrahmanirrahim",
    openingLine: "Assalamu'alaikum Warahmatullahi Wabarakatuh",
    invitationNote: "With hearts full of gratitude to Allah SWT, we joyfully invite you to share in the celebration of our wedding day.",
    quote: "“And among His signs is that He created for you mates from among yourselves, that you may dwell in tranquility with them, and He has put love and mercy between your hearts.”",
    quoteSource: "QS. Ar-Rum : 21",
    closing: "It would be an honour and a blessing to have you with us on our special day. Thank you for every prayer and kind wish.",
    closingSign: "Wassalamu'alaikum Warahmatullahi Wabarakatuh",
    footer: "With love"
  }
};
