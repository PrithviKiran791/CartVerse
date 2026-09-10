/**
 * Review Moderation Utility
 * Performs automated screening on user-submitted reviews for profanity,
 * phishing / spam links, and bot solicitation patterns.
 */

// Curated list of offensive terms and common spam keywords
const PROFANITY_LIST = [
  'scam',
  'fake product',
  'fraud',
  'stolen',
  'cheat',
  'bastard',
  'asshole',
  'bullshit',
  'crap',
  'fuck',
  'shit',
  'bitch',
  'idiot',
  'scammer',
];

// Spam patterns: crypto, whatsapp invites, free money, telegram channels, suspicious URLs
const SPAM_PATTERNS = [
  /https?:\/\/[^\s]+/i, // Any external HTTP/HTTPS link in review text
  /www\.[^\s]+/i,
  /t\.me\/[^\s]+/i, // Telegram links
  /wa\.me\/[^\s]+/i, // WhatsApp links
  /\b(crypto|bitcoin|eth|investment|earn money|free gift card|telegram)\b/i,
  /\b(\+?91[\s-]?)?[6-9]\d{9}\b/, // Indian mobile numbers embedded for solicitations
];

/**
 * Screens review title and body for profanity or spam.
 * @param {string} title
 * @param {string} body
 * @returns {{ isFlagged: boolean, reason: string | null }}
 */
export const screenReviewContent = (title = '', body = '') => {
  const combinedText = `${title} ${body}`.toLowerCase();

  // 1. Check for spam patterns (URLs, contact solicitations)
  for (const pattern of SPAM_PATTERNS) {
    if (pattern.test(combinedText)) {
      return {
        isFlagged: true,
        reason: 'Automated spam or external link detected in review text',
      };
    }
  }

  // 2. Check for profanity terms
  for (const word of PROFANITY_LIST) {
    const wordRegex = new RegExp(`\\b${word}\\b`, 'i');
    if (wordRegex.test(combinedText)) {
      return {
        isFlagged: true,
        reason: `Potential policy-violating language detected (${word})`,
      };
    }
  }

  // 3. Bot repetition heuristic (e.g. "aaaaaa", "1111111")
  if (/(.)\1{7,}/.test(combinedText)) {
    return {
      isFlagged: true,
      reason: 'Repetitive character spam detected',
    };
  }

  return { isFlagged: false, reason: null };
};
