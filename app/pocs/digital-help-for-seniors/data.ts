export type GuideTask = {
  id: string;
  title: string;
  shortTitle: string;
  category: string;
  intro: string;
  finishTitle: string;
  finishNote: string;
  illustration: "paynow" | "calendar" | "qr";
  steps: {
    id: string;
    title: string;
    body: string;
    cue: string;
  }[];
};

export const guideTasks: GuideTask[] = [
  {
    id: "pay-bill",
    title: "Pay a bill with PayNow",
    shortTitle: "Pay a bill",
    category: "Payments",
    intro: "Follow one clear screen at a time to pay a bill safely.",
    finishTitle: "Payment complete",
    finishNote: "Check the amount once more, then keep your receipt or screenshot.",
    illustration: "paynow",
    steps: [
      {
        id: "open-bank-app",
        title: "Open your bank app",
        body: "Tap the bank app you normally use. Wait until you see your home screen.",
        cue: "Look for your bank logo on the phone screen.",
      },
      {
        id: "choose-scan-pay",
        title: "Choose Scan or PayNow",
        body: "Tap the button for Scan, PayNow, or Pay. Use the one your app shows.",
        cue: "The button is usually near the bottom or in the middle of the screen.",
      },
      {
        id: "scan-code",
        title: "Point your camera at the bill code",
        body: "Hold your phone still and let the square code fit inside the camera box.",
        cue: "Move the phone slowly until the code becomes clear.",
      },
      {
        id: "check-and-pay",
        title: "Check the amount, then tap Pay",
        body: "Read the amount once. If it looks right, tap the pay button and wait for the confirmation.",
        cue: "If anything looks wrong, stop here and ask someone you trust.",
      },
    ],
  },
  {
    id: "clinic-appointment",
    title: "Open your clinic appointment",
    shortTitle: "Open appointment",
    category: "Appointments",
    intro: "See the next steps for finding your appointment details on your phone.",
    finishTitle: "Appointment found",
    finishNote: "Keep this screen open or take a screenshot so you can show it later.",
    illustration: "calendar",
    steps: [
      {
        id: "open-message",
        title: "Open the message or health app",
        body: "Tap the message with your appointment link, or open the health app you usually use.",
        cue: "Look for the most recent message from the clinic or hospital.",
      },
      {
        id: "tap-appointment",
        title: "Tap the appointment line",
        body: "Find the date you need and tap it once to open the details.",
        cue: "The date is usually the easiest thing to recognise first.",
      },
      {
        id: "check-time-place",
        title: "Read the time and place",
        body: "Check the time, location, and queue number if one is shown.",
        cue: "Say the details out loud once to help remember them.",
      },
      {
        id: "save-screen",
        title: "Keep it ready for later",
        body: "Leave the page open, or save a screenshot so you can show it at the counter.",
        cue: "Ask for help only after you reach this screen, not before.",
      },
    ],
  },
  {
    id: "scan-qr",
    title: "Scan a QR code",
    shortTitle: "Scan a QR code",
    category: "Daily tasks",
    intro: "Use your phone camera to scan a QR code without guessing what to press.",
    finishTitle: "Code opened",
    finishNote: "If a page opens, read the top line first before tapping anything else.",
    illustration: "qr",
    steps: [
      {
        id: "open-camera",
        title: "Open your camera",
        body: "Tap the camera app and hold your phone upright.",
        cue: "The camera icon looks like a small camera lens.",
      },
      {
        id: "frame-code",
        title: "Place the QR code in the middle",
        body: "Keep the full code inside the screen. Stay still for a moment.",
        cue: "You do not need to press the shutter button.",
      },
      {
        id: "tap-link",
        title: "Tap the link that appears",
        body: "When a banner or small box appears, tap it once to open the page.",
        cue: "If nothing appears, move the phone a little closer and try again.",
      },
      {
        id: "read-first-line",
        title: "Read the top line before going on",
        body: "Make sure the page matches the place or service you expected.",
        cue: "If the page looks unfamiliar, close it and ask before continuing.",
      },
    ],
  },
];

export const STORAGE_KEY = "cfg-digital-help-for-seniors-v1";
