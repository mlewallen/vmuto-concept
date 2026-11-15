/* ------------------------------------------------------------------
   BRAND + CONTENT CONFIG — the single source of truth for the site
   and the member app. Change anything here and both update.
   Nothing brand-level lives in index.html, styles.css or main.js.

   Anything marked "placeholder" is concept copy to confirm with the client.
------------------------------------------------------------------- */
window.BRAND = {
  name: "Liberty Fitness",
  shortName: "Liberty",
  tagline: "Train on your terms.",
  subline:
    "A privately owned training gym in Lewiston, New York. Open to members at every hour, coached by someone who knows your name.",
  location: "Lewiston, New York",
  region: "Buffalo–Niagara",
  status: "Opening date to be announced",

  coach: {
    name: "Vinny Muto",
    proof: "Retired professional hockey player",
    line: "One coach. Your name on the program.",
    // placeholder bio — confirm with the client
    bio: [
      "Vinny spent his playing career learning what it takes to train hard, recover properly and show up again tomorrow. He coaches the same way: a plan for one person, built around how they actually live.",
      "Every client starts with an assessment and gets a written program. He coaches every session himself, in person in Lewiston or by video from wherever you train.",
    ],
    credentials: ["Former pro hockey player", "Strength & conditioning coach", "In person + remote"],
  },

  theme: "modern", // modern | midnight | classic | auto (modern in light mode, midnight in dark mode)
  showBrandPanel: true, // false hides the Brand controls

  // Scrolling strip above the nav. Empty array hides it.
  ticker: ["24/7 member access", "Private coaching", "Lewiston, New York", "Founding memberships opening"],

  // Each theme sets color, type and shape. inv* is the dark "feature" panel (hero, tiles).
  themes: {
    modern: {
      label: "Modern — white, black, electric blue",
      colors: {
        bg: "#FFFFFF", surface: "#F3F3F1", ink: "#0A0A0A", muted: "#5A5E63",
        line: "#E3E3DF", accent: "#1F4BFF", accentInk: "#FFFFFF", invBg: "#0A0A0A", invInk: "#FFFFFF",
      },
      display: "Inter Tight", body: "Inter",
      displayWeight: 800, displayCase: "uppercase", displayTracking: "-0.03em",
      radius: "20px", buttonRadius: "999px", dark: false,
    },
    midnight: {
      label: "Midnight — black, white, bright blue",
      colors: {
        bg: "#0A0A0B", surface: "#161618", ink: "#F5F5F5", muted: "#A3A3AA",
        line: "#2A2A2F", accent: "#5A85FF", accentInk: "#0A0A0B", invBg: "#161618", invInk: "#FFFFFF",
      },
      display: "Inter Tight", body: "Inter",
      displayWeight: 800, displayCase: "uppercase", displayTracking: "-0.03em",
      radius: "20px", buttonRadius: "999px", dark: true,
    },
    classic: {
      label: "Classic — ink, bone, serif, blue",
      colors: {
        bg: "#0E0F11", surface: "#17191C", ink: "#EFEAE0", muted: "#A29E94",
        line: "#2B2E33", accent: "#7C9DFF", accentInk: "#0E0F11", invBg: "#17191C", invInk: "#EFEAE0",
      },
      display: "Bodoni Moda", body: "Inter",
      displayWeight: 500, displayCase: "none", displayTracking: "-0.01em",
      radius: "4px", buttonRadius: "4px", dark: true,
    },
  },

  fonts: {
    display: {
      "Inter Tight": { weights: "600;700;800;900", stack: "'Inter Tight', 'Helvetica Neue', Arial, sans-serif" },
      "Barlow Condensed": { weights: "600;700;800", stack: "'Barlow Condensed', 'Arial Narrow', sans-serif" },
      "Anton": { weights: "400", stack: "Anton, Impact, 'Arial Narrow', sans-serif" },
      "Manrope": { weights: "600;700;800", stack: "Manrope, system-ui, sans-serif" },
      "Bodoni Moda": { weights: "400;500;700", stack: "'Bodoni Moda', Didot, 'Times New Roman', serif" },
      "Playfair Display": { weights: "400;500;700", stack: "'Playfair Display', Georgia, serif" },
      "Bebas Neue": { weights: "400", stack: "'Bebas Neue', Impact, 'Arial Narrow', sans-serif" },
      "Archivo": { weights: "400;600;800", stack: "Archivo, 'Helvetica Neue', Arial, sans-serif" },
    },
    body: {
      "Inter": { weights: "400;500;600;700", stack: "Inter, system-ui, -apple-system, 'Segoe UI', sans-serif" },
      "Manrope": { weights: "400;500;700", stack: "Manrope, system-ui, sans-serif" },
      "DM Sans": { weights: "400;500;700", stack: "'DM Sans', system-ui, sans-serif" },
      "IBM Plex Sans": { weights: "400;500;600", stack: "'IBM Plex Sans', system-ui, sans-serif" },
      "Archivo": { weights: "400;500;600", stack: "Archivo, system-ui, sans-serif" },
    },
  },

  // The gym — placeholder list, confirm the equipment once the build-out is final.
  gym: {
    features: [
      { icon: "key", title: "Your key. Your hours.", text: "Entry by phone, around the clock. No front desk to wait on, no closing time to beat." },
      { icon: "user", title: "Owner-run.", text: "The person who built it is the person coaching in it." },
      { icon: "shield", title: "Kept personal.", text: "Every entry is logged and the floor is on camera. The owner knows who's training." },
    ],
    equipment: ["Squat racks & platforms", "Dumbbells to heavy", "Selectorized machines", "Turf lane for sleds", "Conditioning bikes & rowers", "Mobility & recovery corner"],
  },

  howItWorks: [
    { title: "Join", text: "Pick a plan online. Founding members lock in their rate." },
    { title: "Get the app", text: "Your membership lives on your phone, and so does your key." },
    { title: "Hold to enter", text: "Hold the button by the door. It knows your plan and your bookings." },
  ],

  coachingSteps: [
    { title: "Assess", text: "A first session to see how you move, what you've done and what you want." },
    { title: "Program", text: "A written plan for you, in the app, updated as you progress." },
    { title: "Train", text: "Sessions with Vinny in person or by video, plus the work you do on your own." },
  ],

  // access: "always" | "session" (around a booked session) | "none" (remote)
  // price: null renders "Pricing to be set". Use a string when known, e.g. "$89 / month".
  tiers: [
    {
      id: "access", name: "Access", access: "always", coaching: false, price: null,
      blurb: "The gym, at any hour.",
      features: ["24/7 entry with your phone", "Full use of the floor", "Membership terms to be set"],
    },
    {
      id: "coached", name: "Coached", featured: true, access: "always", coaching: "in-person", price: null,
      blurb: "The gym at any hour, plus sessions with your coach.",
      features: ["24/7 entry with your phone", "In-person training sessions", "A program written for you"],
    },
    {
      id: "private", name: "Private Training", access: "session", coaching: "in-person", price: null,
      blurb: "Sessions only. The door opens for your appointment.",
      features: ["Entry around your booked session", "In-person training sessions", "A program written for you"],
    },
    {
      id: "remote", name: "Remote", access: "none", coaching: "video", price: null,
      blurb: "Coaching by video, wherever you train.",
      features: ["Video training sessions", "A program written for you", "No door access"],
    },
  ],

  // Rows for the plan comparison. Values per tier id: true, false, or a short string.
  compare: [
    { label: "Door access", values: { access: "24/7", coached: "24/7", private: "Around sessions", remote: false } },
    { label: "Use of the floor", values: { access: true, coached: true, private: "With sessions", remote: false } },
    { label: "Coaching sessions", values: { access: false, coached: "In person", private: "In person", remote: "Video" } },
    { label: "Written program", values: { access: false, coached: true, private: true, remote: true } },
    { label: "Program in the app", values: { access: false, coached: true, private: true, remote: true } },
  ],

  // placeholder — confirm the founding offer with the client
  founding: {
    title: "Founding members",
    perks: ["Your founding rate, locked in", "First pick of training times", "A free assessment with Vinny", "Early access before the doors open"],
  },

  faq: [
    { q: "When do you open?", a: "The gym is in build-out now. Founding members hear the date first, along with their move-in details." },
    { q: "How does 24/7 entry work?", a: "Your phone is your key. Open the app at the door and hold the button. Entry follows your plan: Access and Coached open the door at any hour, Private Training opens it around your booked sessions." },
    { q: "Is anyone there at night?", a: "Not staff. Every entry is tied to a member, and the floor is on camera. The owner knows who's training." },
    { q: "I've never had a coach. Is that okay?", a: "Yes. Every client starts with an assessment, and the program starts where you are, not where someone else is." },
    { q: "Can I train with Vinny if I don't live nearby?", a: "Yes. Remote clients get the same written program and sessions by video, all in the app." },
    { q: "What does it cost?", a: "Pricing is being set. Founding members lock in their rate, so join the list to hear it first." },
  ],

  // Shown in Visit + footer. Leave null until real.
  contact: { email: null, phone: null, address: null, instagram: "https://www.instagram.com/v_muto_training/" },
  hours: { members: "24 / 7", staffed: "Staffed hours to be set" },

  // ---- Member app demo data ----
  sessionWindow: { before: 15, after: 75 }, // minutes either side of a booked session the door opens on a "session" plan
  sessionSlots: ["06:00", "07:30", "09:00", "12:00", "16:30", "18:00"], // placeholder schedule
  capacity: 30, // used for the "how busy" meter

  // Program shown in the app's Program tab. Placeholder training.
  program: {
    name: "Block 1 · Foundations",
    week: 2, weeks: 6,
    days: [
      { day: "Mon", title: "Lower strength", items: [
        { name: "Back squat", sets: "4 × 6", note: "Leave 2 reps in reserve" },
        { name: "Romanian deadlift", sets: "3 × 8" },
        { name: "Split squat", sets: "3 × 10 / side" },
        { name: "Sled push", sets: "6 × 20 m" },
      ]},
      { day: "Tue", title: "Conditioning", items: [
        { name: "Bike intervals", sets: "10 × 30 s on / 60 s off" },
        { name: "Farmer carry", sets: "4 × 40 m" },
        { name: "Dead bug", sets: "3 × 10" },
      ]},
      { day: "Wed", title: "Rest or mobility", items: [
        { name: "Mobility flow", sets: "20 min", note: "Video in the app" },
      ]},
      { day: "Thu", title: "Upper strength", items: [
        { name: "Bench press", sets: "4 × 6" },
        { name: "Chest-supported row", sets: "4 × 8" },
        { name: "Half-kneeling press", sets: "3 × 8 / side" },
        { name: "Chin-up", sets: "3 × max" },
      ]},
      { day: "Fri", title: "Power + speed", items: [
        { name: "Trap bar jump", sets: "5 × 3" },
        { name: "Med ball throw", sets: "4 × 5" },
        { name: "Sprint", sets: "6 × 15 m" },
      ]},
      { day: "Sat", title: "Long conditioning", items: [
        { name: "Row or bike", sets: "30–40 min easy" },
      ]},
      { day: "Sun", title: "Rest", items: [] },
    ],
  },

  credit: "Concept by Pacecar",
};
