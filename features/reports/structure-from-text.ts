import type { ExtractedReportDraft } from "@/features/reports/types";

type SectionRule = {
  id: string;
  heading: string;
  patterns: RegExp[];
};

const SECTION_RULES: SectionRule[] = [
  {
    id: "introduction",
    heading: "Introduction",
    patterns: [/^1\.\s*INTRODUCTION/i, /^INTRODUCTION\b/i],
  },
  {
    id: "objectives",
    heading: "Objectives",
    patterns: [
      /^2\.\s*OBJECTIVES/i,
      /^OBJECTIVES OF THE PROGRAMME/i,
      /^PROJECT OBJECTIVES/i,
      /^4\.\s*PROJECT OBJECTIVES/i,
    ],
  },
  {
    id: "participation",
    heading: "Participation and mobilisation",
    patterns: [
      /^3\.\s*PARTICIPATION/i,
      /^PARTICIPATION AND COMMUNITY MOBILISATION/i,
      /^5\.\s*COMMUNITIES REACHED/i,
      /^6\.\s*SCHOOLS VISITED/i,
    ],
  },
  {
    id: "activities",
    heading: "Programme activities and delivery",
    patterns: [
      /^4\.\s*PROGRAMME IMPLEMENTATION/i,
      /^PROGRAMME IMPLEMENTATION AND ACTIVITIES/i,
      /^7\.\s*ACTIVITIES UNDERTAKEN/i,
      /^ACTIVITIES UNDERTAKEN/i,
    ],
  },
  {
    id: "team",
    heading: "Organising team and contributors",
    patterns: [
      /^5\.\s*ORGANISING TEAM/i,
      /^ORGANISING TEAM AND OFFICIALS/i,
    ],
  },
  {
    id: "health-partners",
    heading: "Participating health professionals and teachers",
    patterns: [/^6\.\s*PARTICIPATING HEALTH/i],
  },
  {
    id: "outcomes",
    heading: "Outcomes and achievements",
    patterns: [
      /^7\.\s*KEY ACHIEVEMENTS/i,
      /^KEY ACHIEVEMENTS AND OUTCOMES/i,
      /^8\.\s*KEY FINDINGS/i,
      /^KEY FINDINGS/i,
    ],
  },
  {
    id: "challenges",
    heading: "Challenges",
    patterns: [/^8\.\s*CHALLENGES/i, /^CHALLENGES ENCOUNTERED/i],
  },
  {
    id: "recommendations",
    heading: "Recommendations",
    patterns: [
      /^9\.\s*RECOMMENDATIONS/i,
      /^RECOMMENDATIONS AND WAY FORWARD/i,
    ],
  },
  {
    id: "conclusion",
    heading: "Conclusion",
    patterns: [/^10\.\s*CONCLUSION/i, /^14\.\s*CONCLUSION/i, /^CONCLUSION\b/i],
  },
  {
    id: "preparation",
    heading: "Report preparation",
    patterns: [/^PREPARED BY/i, /^PREPARED BY\b/i],
  },
];

function cleanPdfText(raw: string): string {
  return raw
    .replace(/\r/g, "\n")
    .replace(/\f/g, "\n\n")
    .replace(/[ \t]+\n/g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .replace(/Girls['’]? Global Initiative\s*\|\s*.*Page\s*\d+/gi, "")
    .replace(/GIRLS['’]? GLOBAL INITIATIVE\s*\(GGI\)/gi, "Girls Global Initiative (GGI)")
    .replace(/^Girls Global Initiative \(GGI\)\s*$/gim, "")
    .replace(/^--?\s*\d+\s+of\s+\d+\s*--?$/gim, "")
    .replace(/[]/g, "•")
    .replace(/\u0000/g, "")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

/** Rejoin PDF hard-wraps while preserving true paragraph and list breaks. */
function reflowWrappedLines(text: string): string {
  const lines = text.split("\n").map((line) => line.trim());
  const out: string[] = [];
  let paragraph = "";

  const isListItem = (line: string) =>
    /^([•\-–]|\d+[.)])\s+/.test(line) || /^\*\*[^*]+\*\*:/.test(line);
  const isHeadingLike = (line: string) =>
    /^(\d+\.\s+)?[A-Z][A-Z0-9 ,&/'’-]{8,}$/.test(line);

  const flush = () => {
    if (paragraph) {
      out.push(paragraph.replace(/\s+/g, " ").trim());
      paragraph = "";
    }
  };

  for (const line of lines) {
    if (!line) {
      flush();
      if (out[out.length - 1] !== "") out.push("");
      continue;
    }
    if (isHeadingLike(line)) {
      // Section titles are complete lines — never merge following prose into them.
      flush();
      out.push(line);
      continue;
    }
    if (isListItem(line)) {
      flush();
      paragraph = line;
      continue;
    }
    // New prose after a finished list item should start a fresh paragraph.
    if (
      paragraph &&
      isListItem(paragraph) &&
      /[.!?]"?$/.test(paragraph) &&
      /^[A-Z“"]/.test(line)
    ) {
      flush();
      paragraph = line;
      continue;
    }
    if (!paragraph) {
      paragraph = line;
      continue;
    }
    paragraph = `${paragraph} ${line}`;
  }
  flush();
  return out.join("\n").replace(/\n{3,}/g, "\n\n").trim();
}

function inferTitle(text: string): string {
  const breast = text.match(
    /BREAST CANCER AWARENESS AND SCREENING PROGRAMME/i,
  );
  if (breast) {
    return 'Know Your Body, Protect Your Future — Breast Cancer Awareness and Screening Programme';
  }
  const pages = text.match(/PAGES OF HOPE[:\s]+RURAL GIRLS['’]? EDUCATION/i);
  if (pages) {
    return "Pages of Hope: Rural girls' education — programme report";
  }
  const firstLines = text
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line.length > 8 && line.length < 120)
    .slice(0, 12);
  return firstLines[2] ?? firstLines[0] ?? "Programme report";
}

function inferPublishedOn(text: string): string {
  const date =
    text.match(
      /Date\s+((?:Monday|Tuesday|Wednesday|Thursday|Friday|Saturday|Sunday),?\s+\d{1,2}(?:st|nd|rd|th)?\s+[A-Za-z]+\s+\d{4})/i,
    ) ??
    text.match(
      /(\d{1,2}(?:st|nd|rd|th)?\s+[A-Za-z]+\s+\d{4})/,
    ) ??
    text.match(/Reporting Period:\s*([A-Za-z]+\s+\d{4})/i);
  return date?.[1]?.replace(/\s+/g, " ").trim() ?? "";
}

function inferSummary(text: string, title: string): string {
  const intro =
    text.match(
      /1\.\s*INTRODUCTION\s+([\s\S]{80,900}?)(?=\s*2\.\s*OBJECTIVES|\s*OBJECTIVES OF)/i,
    ) ??
    text.match(
      /1\.\s*EXECUTIVE SUMMARY\s+([\s\S]{80,900}?)(?=\s*2\.\s*BACKGROUND|\s*2\.\s)/i,
    );
  if (intro?.[1]) {
    return intro[1].replace(/\s+/g, " ").trim().slice(0, 420);
  }
  return `${title}. Full programme details are presented in the sections below.`;
}

function splitSections(text: string): Array<{ heading: string; body: string }> {
  const lines = text.split("\n");
  const markers: Array<{ index: number; heading: string }> = [];

  for (let i = 0; i < lines.length; i += 1) {
    const line = lines[i].trim();
    if (!line) continue;
    for (const rule of SECTION_RULES) {
      if (rule.patterns.some((pattern) => pattern.test(line))) {
        markers.push({ index: i, heading: rule.heading });
        break;
      }
    }
  }

  // Deduplicate consecutive same headings.
  const unique: Array<{ index: number; heading: string }> = [];
  for (const marker of markers) {
    const prev = unique[unique.length - 1];
    if (prev && prev.heading === marker.heading) continue;
    unique.push(marker);
  }

  if (unique.length === 0) {
    return [
      {
        heading: "Programme overview",
        body: text.replace(/\s+/g, " ").trim(),
      },
    ];
  }

  const sections: Array<{ heading: string; body: string }> = [];
  for (let i = 0; i < unique.length; i += 1) {
    const start = unique[i].index + 1;
    const end = i + 1 < unique.length ? unique[i + 1].index : lines.length;
    const body = lines
      .slice(start, end)
      .join("\n")
      .replace(/\n{3,}/g, "\n\n")
      .trim();
    if (body) sections.push({ heading: unique[i].heading, body });
  }
  return sections;
}

function formatSectionBody(body: string): string {
  const cleaned = reflowWrappedLines(
    body.replace(/[•�]/g, "•").replace(/\n{3,}/g, "\n\n").trim(),
  );

  const lines = cleaned.split("\n").map((line) => line.trim()).filter(Boolean);
  const listLines = lines.filter((line) => /^([•\-–]|\d+[.)])\s+/.test(line));
  if (lines.length >= 3 && listLines.length >= Math.ceil(lines.length * 0.7)) {
    return lines
      .map((line) => {
        if (/^([•\-–]|\d+[.)])\s+/.test(line)) {
          return `• ${line.replace(/^([•\-–]|\d+[.)])\s+/, "")}`;
        }
        return line;
      })
      .join("\n");
  }

  // Mixed content: keep list items as bullets; reflow prose paragraphs.
  const blocks: string[] = [];
  let prose: string[] = [];
  const flushProse = () => {
    if (!prose.length) return;
    blocks.push(prose.join(" ").replace(/\s+/g, " ").trim());
    prose = [];
  };
  for (const line of lines) {
    if (/^([•\-–]|\d+[.)])\s+/.test(line)) {
      flushProse();
      blocks.push(`• ${line.replace(/^([•\-–]|\d+[.)])\s+/, "")}`);
      continue;
    }
    prose.push(line);
  }
  flushProse();
  return blocks.join("\n\n");
}

function captureFact(text: string, label: RegExp): string | null {
  const match = text.match(label);
  if (!match?.[1]) return null;
  return match[1]
    .replace(/\s+/g, " ")
    .replace(
      /\s+(?:Venue|Time|Target participants|Actual student|Other participants|Schools Visited|Girls Reached)\b.*$/i,
      "",
    )
    .trim();
}

function buildFactsBlock(text: string): string | null {
  const facts: string[] = [];
  const date = captureFact(
    text,
    /Date\s+((?:Monday|Tuesday|Wednesday|Thursday|Friday|Saturday|Sunday)?[^\n]*?\d{4})/i,
  );
  const venue = captureFact(text, /Venue\s+([^\n]+?)(?=\s+Time\b|\n)/i);
  const time = captureFact(
    text,
    /Time\s+([^\n]+?)(?=\s+Target participants\b|\n)/i,
  );
  const target = captureFact(
    text,
    /Target participants\s+(\d+[^\n]*?)(?=\s+Actual student\b|\n)/i,
  );
  const actual = captureFact(
    text,
    /Actual student\s+attendance\s+(\d+[^\n]*?)(?=\s+Other participants\b|\n)/i,
  );
  const other = captureFact(
    text,
    /Other participants\s+([^\n]+?)(?=\s+\d+\.\s|\n\n|$)/i,
  );
  const schools = text.match(/Schools Visited:\s*(\d+)/i)?.[1]?.trim();
  const girls = text.match(/Girls Reached:\s*([^\n]+)/i)?.[1]?.trim();

  if (date) facts.push(`• **Date**: ${date}`);
  if (venue) facts.push(`• **Venue**: ${venue}`);
  if (time) facts.push(`• **Time**: ${time}`);
  if (target) facts.push(`• **Target participants**: ${target}`);
  if (actual) facts.push(`• **Actual attendance**: ${actual}`);
  if (other) facts.push(`• **Other participants**: ${other}`);
  if (schools) facts.push(`• **Schools visited**: ${schools}`);
  if (girls) facts.push(`• **Girls reached**: ${girls}`);

  return facts.length ? facts.join("\n") : null;
}

/**
 * Shape raw PDF text into GGI report markdown without inventing facts.
 */
export function structureReportFromText(
  rawText: string,
  options?: { pageCount?: number },
): ExtractedReportDraft {
  const cleaned = reflowWrappedLines(cleanPdfText(rawText));
  const title = inferTitle(cleaned);
  const publishedOn = inferPublishedOn(cleaned);
  const summary = inferSummary(cleaned, title);
  const facts = buildFactsBlock(cleaned);
  const sections = splitSections(cleaned);

  const parts: string[] = [];
  if (facts) {
    parts.push("## Programme overview");
    parts.push(facts);
  }

  const usedHeadings = new Set<string>();
  for (const section of sections) {
    if (usedHeadings.has(section.heading)) continue;
    usedHeadings.add(section.heading);
    let body = formatSectionBody(section.body);
    if (!body) continue;
    if (section.heading === "Report preparation") {
      body = body
        .replace(
          /\s*(Organisation|Programme|Theme|Date):\s*/gi,
          "\n• **$1**: ",
        )
        .replace(
          /^(Miss |Mr\. |Mrs\. |Ms\. )([^\n]+?)(\s+President|\s+Deputy|\s+Outreach)/i,
          "• **Prepared by**: $1$2\n• **Role**: $3",
        )
        .replace(/^\n+/, "")
        .trim();
    }
    parts.push(`## ${section.heading}`);
    parts.push(body);
  }

  const body = parts.join("\n\n").trim();
  const uncertainFlags: string[] = [];
  if (!publishedOn) {
    uncertainFlags.push("Programme date could not be confidently detected.");
  }
  if (sections.length < 3) {
    uncertainFlags.push(
      "Few section headings were detected — review the body carefully against every PDF page.",
    );
  }
  if (cleaned.length < 800) {
    uncertainFlags.push(
      "Extracted text is unusually short. The PDF may be scanned; OCR may be required.",
    );
  }

  return {
    title,
    summary,
    publishedOn,
    body,
    extractionNotes: uncertainFlags.join(" "),
    extractedRaw: cleaned,
    pageCount: options?.pageCount ?? 0,
    uncertain: uncertainFlags.length > 0,
  };
}
