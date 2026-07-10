/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

// Regenerates the downloadable Word doc (public/downloads/Personal_Training_Foundations.docx)
// directly from src/data/chaptersData.ts — the exact same source of truth that drives the
// live website. This guarantees the download is a true, byte-for-byte-accurate reflection of
// whatever the site currently says, rather than a hand-maintained copy that drifts out of sync.
//
// Run with: npx tsx scripts/generate-docx.ts

import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  ImageRun,
  HeadingLevel,
  AlignmentType,
  LevelFormat,
  BorderStyle,
  PageBreak,
  TableOfContents,
  ShadingType,
} from 'docx';
import { readFileSync, writeFileSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import sizeOf from 'image-size';
import { chapters, type ContentBlock, type ChapterSection } from '../src/data/chaptersData';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');
const PUBLIC = join(ROOT, 'public');
const OUT_PATH = join(PUBLIC, 'downloads', 'Personal_Training_Foundations.docx');

const AUTHOR = 'KC Jugran';
const TITLE = 'Personal Training Foundations';
const SUBTITLE = 'A Practical Manual for Coaches, Trainers & Fitness Enthusiasts';

const CONTENT_WIDTH_DXA = 9360; // US Letter, 1" margins
const MAX_IMG_WIDTH_PT = 400; // ~4.17in — regular figure
const MAX_IMG_WIDTH_SMALL_PT = 260; // ~2.7in — "small" figure

// ---------------------------------------------------------------------------
// Inline markup: **bold**, *italic*, ==highlight== -> TextRun[]
// ---------------------------------------------------------------------------
const INLINE_MARKUP = /\*\*(.+?)\*\*|\*(.+?)\*|==(.+?)==/g;

function markupToRuns(text: string): TextRun[] {
  const runs: TextRun[] = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;
  INLINE_MARKUP.lastIndex = 0;
  while ((match = INLINE_MARKUP.exec(text)) !== null) {
    if (match.index > lastIndex) {
      runs.push(new TextRun({ text: text.slice(lastIndex, match.index) }));
    }
    if (match[1] !== undefined) {
      runs.push(new TextRun({ text: match[1], bold: true }));
    } else if (match[2] !== undefined) {
      runs.push(new TextRun({ text: match[2], italics: true }));
    } else if (match[3] !== undefined) {
      runs.push(
        new TextRun({
          text: match[3],
          shading: { type: ShadingType.CLEAR, fill: 'F2D98A' },
        })
      );
    }
    lastIndex = INLINE_MARKUP.lastIndex;
  }
  if (lastIndex < text.length) {
    runs.push(new TextRun({ text: text.slice(lastIndex) }));
  }
  return runs;
}

function imageExtFromSrc(src: string): 'png' | 'jpg' {
  return src.toLowerCase().endsWith('.png') ? 'png' : 'jpg';
}

function loadImageDims(absPath: string): { width: number; height: number } | null {
  try {
    const buf = readFileSync(absPath);
    const dims = sizeOf(buf);
    if (!dims.width || !dims.height) return null;
    return { width: dims.width, height: dims.height };
  } catch {
    return null;
  }
}

function figureToParagraphs(block: ContentBlock): Paragraph[] {
  if (!block.src) return [];
  const absPath = join(PUBLIC, block.src.replace(/^\//, ''));
  if (!existsSync(absPath)) {
    console.warn(`  ! missing image, skipping: ${block.src}`);
    return [];
  }
  const dims = loadImageDims(absPath);
  if (!dims) {
    console.warn(`  ! could not read dimensions, skipping: ${block.src}`);
    return [];
  }
  const maxWidth = block.small ? MAX_IMG_WIDTH_SMALL_PT : MAX_IMG_WIDTH_PT;
  const scale = Math.min(1, maxWidth / dims.width);
  const width = Math.round(dims.width * scale);
  const height = Math.round(dims.height * scale);

  const paragraphs: Paragraph[] = [
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { before: 120, after: block.caption ? 40 : 120 },
      children: [
        new ImageRun({
          type: imageExtFromSrc(block.src),
          data: readFileSync(absPath),
          transformation: { width, height },
          altText: {
            title: block.caption || 'Figure',
            description: block.caption || 'Figure',
            name: block.caption || 'Figure',
          },
        }),
      ],
    }),
  ];
  if (block.caption) {
    paragraphs.push(
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { after: 200 },
        children: [new TextRun({ text: block.caption, italics: true, size: 18, color: '5C5C5C' })],
      })
    );
  }
  return paragraphs;
}

function blockToParagraphs(block: ContentBlock): Paragraph[] {
  if (block.type === 'paragraph' && block.text) {
    const runs: TextRun[] = [];
    if (block.label) {
      runs.push(new TextRun({ text: `${block.label} — `, bold: true }));
    }
    runs.push(...markupToRuns(block.text));
    return [new Paragraph({ spacing: { after: 200 }, children: runs })];
  }
  if (block.type === 'list' && block.items) {
    return block.items.map(
      (item) =>
        new Paragraph({
          numbering: { reference: 'book-bullets', level: 0 },
          spacing: { after: 100 },
          children: markupToRuns(item),
        })
    );
  }
  if (block.type === 'figure') {
    return figureToParagraphs(block);
  }
  // 'video-only' blocks have no print representation — the demo video only makes sense
  // as a link on the live site, so they're intentionally omitted from the book download.
  return [];
}

function sectionToParagraphs(section: ChapterSection): Paragraph[] {
  const paragraphs: Paragraph[] = [];
  if (section.title) {
    paragraphs.push(
      new Paragraph({
        heading: section.headingLevel === 'h2' ? HeadingLevel.HEADING_2 : HeadingLevel.HEADING_3,
        spacing: { before: 240, after: 120 },
        children: [new TextRun(section.title)],
      })
    );
  }
  for (const block of section.content) {
    paragraphs.push(...blockToParagraphs(block));
  }
  return paragraphs;
}

// ---------------------------------------------------------------------------
// Build the document
// ---------------------------------------------------------------------------
console.log('Building docx from chaptersData.ts...');

const bodyChildren: Paragraph[] = [];

// Cover page
bodyChildren.push(
  new Paragraph({
    alignment: AlignmentType.CENTER,
    spacing: { before: 2400, after: 120 },
    children: [new TextRun({ text: 'FIRST EDITION · 2025', size: 20, color: '4A5D4E', bold: true })],
  }),
  new Paragraph({
    alignment: AlignmentType.CENTER,
    spacing: { before: 240, after: 240 },
    children: [new TextRun({ text: TITLE, size: 56, bold: true, italics: true })],
  }),
  new Paragraph({
    alignment: AlignmentType.CENTER,
    spacing: { after: 480 },
    children: [new TextRun({ text: SUBTITLE, size: 28, color: '5C5C5C' })],
  }),
  new Paragraph({
    alignment: AlignmentType.CENTER,
    spacing: { after: 80 },
    children: [new TextRun({ text: 'AUTHOR', size: 18, bold: true })],
  }),
  new Paragraph({
    alignment: AlignmentType.CENTER,
    spacing: { after: 240 },
    children: [new TextRun({ text: AUTHOR, size: 24 })],
  }),
  new Paragraph({
    alignment: AlignmentType.CENTER,
    spacing: { after: 80 },
    children: [new TextRun({ text: 'FOCUS', size: 18, bold: true })],
  }),
  new Paragraph({
    alignment: AlignmentType.CENTER,
    spacing: { after: 480 },
    children: [new TextRun({ text: 'Holistic Lifestyle Coaching', size: 24 })],
  }),
  new Paragraph({ children: [new PageBreak()] }),
  new Paragraph({
    heading: HeadingLevel.HEADING_1,
    children: [new TextRun('Table of Contents')],
  }),
  new TableOfContents('Table of Contents', { hyperlink: true, headingStyleRange: '1-2' }) as unknown as Paragraph,
  new Paragraph({ children: [new PageBreak()] })
);

for (const ch of chapters) {
  bodyChildren.push(
    new Paragraph({
      heading: HeadingLevel.HEADING_1,
      pageBreakBefore: ch.id !== chapters[0].id,
      children: [new TextRun(ch.id === 'appendix' ? `Appendix: ${ch.title}` : `Chapter ${ch.number}: ${ch.title}`)],
    }),
    new Paragraph({
      spacing: { after: 120 },
      children: [new TextRun({ text: ch.subtitle, italics: true, color: '5C5C5C' })],
    }),
    new Paragraph({
      border: {
        left: { style: BorderStyle.SINGLE, size: 24, color: '4A5D4E', space: 8 },
      },
      shading: { type: ShadingType.CLEAR, fill: 'F2EFE9' },
      spacing: { before: 120, after: 240 },
      indent: { left: 100 },
      children: [new TextRun({ text: ch.summary, italics: true })],
    })
  );
  for (const section of ch.sections) {
    bodyChildren.push(...sectionToParagraphs(section));
  }
  console.log(`  chapter ${ch.number} (${ch.id}): ${ch.sections.length} sections`);
}

const doc = new Document({
  numbering: {
    config: [
      {
        reference: 'book-bullets',
        levels: [
          {
            level: 0,
            format: LevelFormat.BULLET,
            text: '•',
            alignment: AlignmentType.LEFT,
            style: { paragraph: { indent: { left: 720, hanging: 360 } } },
          },
        ],
      },
    ],
  },
  styles: {
    default: { document: { run: { font: 'Georgia', size: 22 } } },
    paragraphStyles: [
      {
        id: 'Heading1',
        name: 'Heading 1',
        basedOn: 'Normal',
        next: 'Normal',
        quickFormat: true,
        run: { size: 36, bold: true, font: 'Georgia', color: '1A1A1A', italics: true },
        paragraph: { spacing: { before: 240, after: 240 }, outlineLevel: 0 },
      },
      {
        id: 'Heading2',
        name: 'Heading 2',
        basedOn: 'Normal',
        next: 'Normal',
        quickFormat: true,
        run: { size: 28, bold: true, font: 'Georgia', color: '1A1A1A' },
        paragraph: { spacing: { before: 200, after: 160 }, outlineLevel: 1 },
      },
      {
        id: 'Heading3',
        name: 'Heading 3',
        basedOn: 'Normal',
        next: 'Normal',
        quickFormat: true,
        run: { size: 24, bold: true, font: 'Georgia', color: '2C2C2C' },
        paragraph: { spacing: { before: 160, after: 120 }, outlineLevel: 2 },
      },
    ],
  },
  sections: [
    {
      properties: {
        page: {
          size: { width: 12240, height: 15840 },
          margin: { top: 1440, right: 1440, bottom: 1440, left: 1440 },
        },
      },
      children: bodyChildren,
    },
  ],
});

const buffer = await Packer.toBuffer(doc);
writeFileSync(OUT_PATH, buffer);
console.log(`\nWrote ${OUT_PATH} (${(buffer.length / 1024 / 1024).toFixed(1)} MB)`);
