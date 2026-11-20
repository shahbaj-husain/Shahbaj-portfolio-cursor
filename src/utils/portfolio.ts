import type { SkillCategory, SkillItem } from '../data/portfolioData';

/**
 * Computes the next clamped video playback timestamp during horizontal mouse scrubbing.
 */
export function clampScrubTime(
  currentTime: number,
  deltaX: number,
  viewportWidth: number,
  duration: number
): number {
  if (!Number.isFinite(duration) || duration <= 0 || viewportWidth <= 0) {
    return 0;
  }
  const safeCurrent = Number.isFinite(currentTime) ? currentTime : 0;
  const targetTime = safeCurrent + (deltaX / viewportWidth) * 0.8 * duration;
  return Math.max(0, Math.min(duration, targetTime));
}

/**
 * Maps a playback timestamp in [0, duration] to the nearest cached frame index.
 */
export function timeToFrameIndex(
  time: number,
  duration: number,
  frameCount: number
): number {
  if (!Number.isFinite(duration) || duration <= 0 || frameCount <= 1) {
    return 0;
  }
  const ratio = Math.max(0, Math.min(1, time / duration));
  return Math.round(ratio * (frameCount - 1));
}

export interface DrawRect {
  x: number;
  y: number;
  width: number;
  height: number;
}

/**
 * Computes destination rectangle matching CSS `object-cover` with configurable focal alignment.
 * alignX: 0 = left, 0.5 = center, 1 = right
 * alignY: 0 = top, 0.5 = center, 1 = bottom
 */
export function computeCoverDrawRect(
  sourceWidth: number,
  sourceHeight: number,
  destWidth: number,
  destHeight: number,
  alignX = 1,
  alignY = 1
): DrawRect {
  if (sourceWidth <= 0 || sourceHeight <= 0 || destWidth <= 0 || destHeight <= 0) {
    return { x: 0, y: 0, width: 0, height: 0 };
  }
  const scale = Math.max(destWidth / sourceWidth, destHeight / sourceHeight);
  const width = sourceWidth * scale;
  const height = sourceHeight * scale;
  const x = (destWidth - width) * alignX;
  const y = (destHeight - height) * alignY;
  return { x, y, width, height };
}

/**
 * Toggles an item inside an ordered multi-select array without mutating the input.
 */
export function toggleSelection<T extends string>(selected: readonly T[], item: T): T[] {
  if (selected.includes(item)) {
    return selected.filter((entry) => entry !== item);
  }
  return [...selected, item];
}

/**
 * Filters skills by category while preserving order.
 */
export function filterSkills(skills: readonly SkillItem[], category: SkillCategory): SkillItem[] {
  if (category === 'All') {
    return [...skills];
  }
  return skills.filter((skill) => skill.category === category);
}

/**
 * Formats selected topics into an introductory note for the contact message box.
 */
export function formatTopicPrompt(topics: readonly string[]): string {
  if (topics.length === 0) {
    return '';
  }
  return `Hi Shahbaj, I'd like to connect regarding: ${topics.join(', ')}.`;
}

export interface ContactFormInput {
  name: string;
  email: string;
  message: string;
}

export interface ContactValidationResult {
  valid: boolean;
  errors: Partial<Record<keyof ContactFormInput, string>>;
}

/**
 * Validates the portfolio contact form fields.
 */
export function validateContactForm(input: ContactFormInput): ContactValidationResult {
  const errors: Partial<Record<keyof ContactFormInput, string>> = {};
  const name = input.name.trim();
  const email = input.email.trim();
  const message = input.message.trim();

  if (name.length < 2) {
    errors.name = 'Please enter your name (at least 2 characters).';
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    errors.email = 'Please enter a valid email address.';
  }
  if (message.length < 10) {
    errors.message = 'Please enter a short message (at least 10 characters).';
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors,
  };
}
