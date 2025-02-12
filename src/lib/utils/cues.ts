import { Cue } from '@/types/cue';

interface ParsedCueNumber {
  prefix: string;  // The letter part (e.g., 'A', 'B', 'C')
  number: number;  // The numeric part (e.g., 101, 102)
}

/**
 * Parses a cue number string into its components.
 * Example: "A101" -> { prefix: "A", number: 101 }
 */
function parseCueNumber(cueNumber: string): ParsedCueNumber {
  // Extract the letter prefix and number
  const match = cueNumber.match(/^([A-Z])(\d+)$/i);
  
  if (!match) {
    throw new Error(`Invalid cue number format: ${cueNumber}`);
  }

  return {
    prefix: match[1].toUpperCase(),
    number: parseInt(match[2], 10)
  };
}

/**
 * Validates if a string matches the required cue number format (e.g., A101)
 */
export function isValidCueNumber(cueNumber: string): boolean {
  return /^[A-Z]\d{3,}$/i.test(cueNumber);
}

/**
 * Sorts cues based on their cue numbers.
 * Follows format: A101, A102, A103, B101, C101, etc.
 */
export function sortCues(cues: Cue[]): Cue[] {
  return [...cues].sort((a, b) => {
    try {
      const parsedA = parseCueNumber(a.cue_number);
      const parsedB = parseCueNumber(b.cue_number);

      // First compare prefixes
      if (parsedA.prefix !== parsedB.prefix) {
        return parsedA.prefix.localeCompare(parsedB.prefix);
      }

      // If prefixes are the same, compare numbers
      return parsedA.number - parsedB.number;
    } catch (error) {
      console.error('Error sorting cues:', error);
      return 0;
    }
  });
}

/**
 * Generates the next cue number in sequence.
 * If within same section (A101 -> A102)
 * If starting new section (A999 -> B101)
 */
export function generateNextCueNumber(cues: Cue[]): string {
  if (cues.length === 0) {
    return 'A101';
  }

  const sortedCues = sortCues(cues);
  const lastCue = sortedCues[sortedCues.length - 1];
  const { prefix, number } = parseCueNumber(lastCue.cue_number);

  // If number is 999, move to next prefix
  if (number >= 999) {
    const nextPrefix = String.fromCharCode(prefix.charCodeAt(0) + 1);
    return `${nextPrefix}101`;
  }

  // Otherwise increment the number
  return `${prefix}${number + 1}`;
}

/**
 * Gets the first available cue number for a specific prefix
 */
export function getFirstCueNumberForPrefix(prefix: string): string {
  return `${prefix.toUpperCase()}101`;
}

/**
 * Finds all cues with a specific prefix
 */
export function getCuesWithPrefix(cues: Cue[], prefix: string): Cue[] {
  return cues.filter(cue => {
    try {
      const parsed = parseCueNumber(cue.cue_number);
      return parsed.prefix === prefix.toUpperCase();
    } catch {
      return false;
    }
  });
}

/**
 * Gets the next available cue number for a specific prefix
 */
export function getNextCueNumberForPrefix(cues: Cue[], prefix: string): string {
  const prefixCues = getCuesWithPrefix(cues, prefix);
  
  if (prefixCues.length === 0) {
    return getFirstCueNumberForPrefix(prefix);
  }

  const sortedCues = sortCues(prefixCues);
  const lastCue = sortedCues[sortedCues.length - 1];
  const parsed = parseCueNumber(lastCue.cue_number);

  return `${prefix.toUpperCase()}${parsed.number + 1}`;
}

/**
 * Gets the last cue number used in a specific section
 */
export function getLastCueNumberForPrefix(cues: Cue[], prefix: string): string | null {
  const prefixCues = getCuesWithPrefix(cues, prefix);
  
  if (prefixCues.length === 0) {
    return null;
  }

  const sortedCues = sortCues(prefixCues);
  return sortedCues[sortedCues.length - 1].cue_number;
}