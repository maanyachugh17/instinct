import PDFDocument from 'pdfkit';
import { createWriteStream } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const outPath = join(__dirname, '..', 'pitch-deck.pdf');

const ACCENT = '#D4654A';
const DARK = '#1A1412';
const MUTED = '#8A7B72';
const BG = '#FAF6F2';

const slides = [
  {
    type: 'cover',
    title: 'Instinct',
    subtitle: 'Skip to the good part.',
    footer: 'Seed round · Q2 2026',
  },
  {
    type: 'content',
    label: 'Problem',
    title: 'Dating apps stop at the match.',
    body: 'Users still swipe for hours, stare at blank message boxes, and negotiate time and place. Most matches never become dates.',
  },
  {
    type: 'content',
    label: 'Solution',
    title: 'AI runs the full funnel.',
    body: 'Instinct handles swipes, icebreakers, venue, and time. Users skip the homework and go straight to meeting someone real.',
  },
  {
    type: 'content',
    label: 'Product',
    title: 'Four steps to date night.',
    bullets: [
      'Learn & swipe: AI learns taste, then swipes in the background.',
      'Break the ice: suggested openers when there is a match.',
      'Get the plan: venue and time picked for both profiles.',
      'Show up: one notification. Put the phone away.',
    ],
  },
  {
    type: 'content',
    label: 'Market',
    title: 'Massive category, broken UX.',
    body: 'Online dating is a multi-billion dollar market dominated by apps that optimize engagement, not outcomes. Instinct optimizes for dates.',
  },
  {
    type: 'content',
    label: 'Business model',
    title: 'Premium subscription.',
    body: 'Freemium waitlist and onboarding. Paid tier unlocks full AI autopilot, unlimited date planning, and priority matching.',
  },
  {
    type: 'content',
    label: 'Traction',
    title: 'Early signal.',
    bullets: [
      'Live waitlist landing page with interactive product demo.',
      'Strong early interest from Gen Z daters tired of swipe fatigue.',
      'Building mobile app for iOS launch in 2026.',
    ],
  },
  {
    type: 'ask',
    label: 'The ask',
    title: 'Raising a seed round.',
    body: 'Building the first dating app where AI runs the entire funnel so users skip to the good part.',
    email: 'investors@instinct-steel.vercel.app',
  },
];

function drawBackground(doc) {
  doc.rect(0, 0, doc.page.width, doc.page.height).fill(BG);
}

function drawAccentBar(doc) {
  doc.rect(0, 0, doc.page.width, 6).fill(ACCENT);
}

function drawCover(doc, slide) {
  drawBackground(doc);
  drawAccentBar(doc);
  doc.fillColor(ACCENT).font('Helvetica-Bold').fontSize(14).text('INSTINCT', 56, 72);
  doc.fillColor(DARK).font('Helvetica-Bold').fontSize(52).text(slide.title, 56, 220, { width: 500 });
  doc.fillColor(ACCENT).font('Helvetica').fontSize(28).text(slide.subtitle, 56, 290, { width: 500 });
  doc.fillColor(MUTED).font('Helvetica').fontSize(13).text(slide.footer, 56, doc.page.height - 72);
}

function drawContent(doc, slide) {
  drawBackground(doc);
  drawAccentBar(doc);
  doc.fillColor(ACCENT).font('Helvetica-Bold').fontSize(11).text(slide.label.toUpperCase(), 56, 72);
  doc.fillColor(DARK).font('Helvetica-Bold').fontSize(34).text(slide.title, 56, 110, { width: 500, lineGap: 4 });
  doc.fillColor(DARK).font('Helvetica').fontSize(16).text(slide.body || '', 56, 220, { width: 500, lineGap: 8 });

  if (slide.bullets) {
    let y = 220;
    slide.bullets.forEach((item) => {
      doc.fillColor(ACCENT).font('Helvetica-Bold').fontSize(16).text('•', 56, y);
      doc.fillColor(DARK).font('Helvetica').fontSize(15).text(item, 76, y, { width: 480, lineGap: 6 });
      y = doc.y + 14;
    });
  }

  doc.fillColor(MUTED).font('Helvetica').fontSize(11).text('Instinct · Confidential', 56, doc.page.height - 48);
}

function drawAsk(doc, slide) {
  drawBackground(doc);
  drawAccentBar(doc);
  doc.fillColor(ACCENT).font('Helvetica-Bold').fontSize(11).text(slide.label.toUpperCase(), 56, 72);
  doc.fillColor(DARK).font('Helvetica-Bold').fontSize(38).text(slide.title, 56, 120, { width: 500 });
  doc.fillColor(DARK).font('Helvetica').fontSize(17).text(slide.body, 56, 210, { width: 500, lineGap: 8 });
  doc.fillColor(ACCENT).font('Helvetica-Bold').fontSize(20).text(slide.email, 56, 320);
  doc.fillColor(MUTED).font('Helvetica').fontSize(13).text('instinct-steel.vercel.app', 56, 360);
}

const doc = new PDFDocument({ size: 'LETTER', margin: 0 });
const stream = createWriteStream(outPath);
doc.pipe(stream);

slides.forEach((slide, index) => {
  if (index > 0) doc.addPage();
  if (slide.type === 'cover') drawCover(doc, slide);
  else if (slide.type === 'ask') drawAsk(doc, slide);
  else drawContent(doc, slide);
});

doc.end();

stream.on('finish', () => {
  console.log(`Wrote ${outPath}`);
});
