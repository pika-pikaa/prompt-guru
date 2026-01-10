/**
 * Markdown Parser Service
 *
 * Parses markdown files to extract structured data including:
 * - TL;DR sections with rules, avoid lists, and checklists
 * - Sections by headers (##, ###)
 * - Code blocks and examples
 */

import { marked } from 'marked';
import fs from 'fs/promises';
import path from 'path';

// ============================================================================
// Types
// ============================================================================

export interface ParsedSection {
  title: string;
  level: number;
  content: string;
  subsections: ParsedSection[];
}

export interface TLDRSection {
  rules: string[];
  avoid: string[];
  quickStart: string;
}

export interface ParsedMarkdown {
  title: string;
  tldr: TLDRSection | null;
  sections: ParsedSection[];
  checklist: string[];
  rawContent: string;
}

export interface ExtractedRules {
  rules: string[];
  avoid: string[];
  checklist: string[];
  tips: string[];
  quickStart: string;
}

// ============================================================================
// Service Error
// ============================================================================

export class MarkdownParserError extends Error {
  constructor(
    message: string,
    public code: string,
    public statusCode: number = 400
  ) {
    super(message);
    this.name = 'MarkdownParserError';
  }
}

// ============================================================================
// Helper Functions
// ============================================================================

/**
 * Extracts bullet points from a markdown section
 */
const extractBulletPoints = (content: string): string[] => {
  const lines = content.split('\n');
  const bullets: string[] = [];

  for (const line of lines) {
    const trimmed = line.trim();
    // Match numbered lists (1., 2., etc.) and bullet points (-, *, +)
    const match = trimmed.match(/^(?:\d+\.|[-*+])\s+(.+)$/);
    if (match) {
      // Clean up markdown formatting
      const cleanText = match[1]
        .replace(/\*\*([^*]+)\*\*/g, '$1') // Remove bold
        .replace(/\*([^*]+)\*/g, '$1') // Remove italic
        .replace(/`([^`]+)`/g, '$1') // Remove inline code
        .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1') // Convert links to text
        .trim();
      if (cleanText) {
        bullets.push(cleanText);
      }
    }
  }

  return bullets;
};

/**
 * Extracts a code block from markdown content
 */
const extractCodeBlock = (content: string): string => {
  const codeBlockRegex = /```[\w]*\n([\s\S]*?)```/g;
  const matches = content.match(codeBlockRegex);

  if (matches && matches.length > 0) {
    // Return the first code block content without the backticks
    return matches[0]
      .replace(/```[\w]*\n/, '')
      .replace(/```$/, '')
      .trim();
  }

  return '';
};

/**
 * Parses markdown content into sections by headers
 */
const parseSections = (content: string): ParsedSection[] => {
  const lines = content.split('\n');
  const sections: ParsedSection[] = [];
  let currentSection: ParsedSection | null = null;
  let currentContent: string[] = [];

  const flushSection = () => {
    if (currentSection) {
      currentSection.content = currentContent.join('\n').trim();
      sections.push(currentSection);
    }
    currentContent = [];
  };

  for (const line of lines) {
    const headerMatch = line.match(/^(#{1,6})\s+(.+)$/);

    if (headerMatch) {
      flushSection();
      const level = headerMatch[1].length;
      const title = headerMatch[2].trim();
      currentSection = {
        title,
        level,
        content: '',
        subsections: [],
      };
    } else {
      currentContent.push(line);
    }
  }

  flushSection();
  return sections;
};

/**
 * Finds a section by title (case-insensitive partial match)
 */
const findSection = (
  sections: ParsedSection[],
  titlePattern: string
): ParsedSection | null => {
  const pattern = titlePattern.toLowerCase();
  return (
    sections.find((s) => s.title.toLowerCase().includes(pattern)) || null
  );
};

// ============================================================================
// Main Service Functions
// ============================================================================

/**
 * Reads and parses a markdown file
 */
export const parseMarkdownFile = async (
  filePath: string
): Promise<ParsedMarkdown> => {
  try {
    const absolutePath = path.isAbsolute(filePath)
      ? filePath
      : path.resolve(process.cwd(), filePath);

    const rawContent = await fs.readFile(absolutePath, 'utf-8');
    return parseMarkdownContent(rawContent);
  } catch (error) {
    const err = error as Error & { code?: string };
    if (err.code === 'ENOENT') {
      throw new MarkdownParserError(
        `Markdown file not found: ${filePath}`,
        'FILE_NOT_FOUND',
        404
      );
    }
    throw new MarkdownParserError(
      `Failed to read markdown file: ${err.message}`,
      'READ_ERROR',
      500
    );
  }
};

/**
 * Parses markdown content string
 */
export const parseMarkdownContent = (content: string): ParsedMarkdown => {
  const sections = parseSections(content);

  // Extract title from first H1
  const titleSection = sections.find((s) => s.level === 1);
  const title = titleSection?.title || 'Untitled';

  // Extract TL;DR section
  const tldrSection = findSection(sections, 'TL;DR');
  let tldr: TLDRSection | null = null;

  if (tldrSection) {
    const tldrContent = tldrSection.content;

    // Find subsections within TL;DR
    const rulesMatch = tldrContent.match(
      /###\s*(?:REGU[ŁL]Y|RULES):?\s*([\s\S]*?)(?=###|$)/i
    );
    const avoidMatch = tldrContent.match(
      /###\s*(?:UNIKAJ|AVOID):?\s*([\s\S]*?)(?=###|$)/i
    );
    const quickStartMatch = tldrContent.match(
      /###\s*(?:SZYBKI START|QUICK START):?\s*([\s\S]*?)(?=###|$)/i
    );

    tldr = {
      rules: rulesMatch ? extractBulletPoints(rulesMatch[1]) : [],
      avoid: avoidMatch ? extractBulletPoints(avoidMatch[1]) : [],
      quickStart: quickStartMatch
        ? extractCodeBlock(quickStartMatch[1])
        : '',
    };
  }

  // Extract checklist
  const checklistSection = findSection(sections, 'checklist');
  const checklist = checklistSection
    ? extractBulletPoints(checklistSection.content).map((item) =>
        item.replace(/^\[[ x]\]\s*/i, '')
      )
    : [];

  return {
    title,
    tldr,
    sections,
    checklist,
    rawContent: content,
  };
};

/**
 * Extracts structured rules from a parsed markdown document
 * Specifically designed for model best-practices files
 */
export const extractRulesFromParsed = (
  parsed: ParsedMarkdown
): ExtractedRules => {
  const rules: string[] = parsed.tldr?.rules || [];
  const avoid: string[] = parsed.tldr?.avoid || [];
  const checklist: string[] = parsed.checklist;
  const tips: string[] = [];
  const quickStart: string = parsed.tldr?.quickStart || '';

  // Extract tips from various sections
  const tipsSection = findSection(parsed.sections, 'tip');
  if (tipsSection) {
    tips.push(...extractBulletPoints(tipsSection.content));
  }

  // Extract from "Zasady ogolne" or "General rules" sections
  const generalSection =
    findSection(parsed.sections, 'zasady ogolne') ||
    findSection(parsed.sections, 'zasady og') ||
    findSection(parsed.sections, 'general');

  if (generalSection) {
    const generalBullets = extractBulletPoints(generalSection.content);
    tips.push(...generalBullets.slice(0, 5)); // Take top 5 as tips
  }

  return {
    rules,
    avoid,
    checklist,
    tips,
    quickStart,
  };
};

/**
 * Extracts a specific section by header name
 */
export const extractSection = (
  parsed: ParsedMarkdown,
  sectionName: string
): ParsedSection | null => {
  return findSection(parsed.sections, sectionName);
};

/**
 * Gets all H2 sections from a parsed markdown
 */
export const getMainSections = (
  parsed: ParsedMarkdown
): ParsedSection[] => {
  return parsed.sections.filter((s) => s.level === 2);
};

/**
 * Converts parsed markdown to HTML
 */
export const toHtml = (content: string): string => {
  return marked(content) as string;
};

// ============================================================================
// Service Export
// ============================================================================

const markdownParserService = {
  parseMarkdownFile,
  parseMarkdownContent,
  extractRulesFromParsed,
  extractSection,
  getMainSections,
  toHtml,
  MarkdownParserError,
};

export default markdownParserService;
