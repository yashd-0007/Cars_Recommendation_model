/**
 * Content Moderation Utility for DreamDrive
 * This utility helps detect inappropriate language in user-submitted content.
 */

const BANNED_WORDS = [
  // English
  "abuse", "asshole", "bitch", "bastard", "cock", "cunt", "damn", "dick", "fucker", "fucking", 
  "fuck", "hell", "motherfucker", "nigger", "piss", "prick", "pussy", "shit", "slut", "whore",
  "idiot", "stupid", "garbage", "trash", "hate", "kill", "die", "death", "ugly", "disgusting",
  "ass",
  
  // Hindi & Marathi Transliterated
  "madarchod", "bhenchod", "behenchod", "bhencod", "chutiya", "gandu", "bhadwa", "harami", "kamina", 
  "kamine", "randi", "bhosdike", "bhosdi", "lavde", "zavadya", "gand", "lund", "chut", "madharchod",
  "mc", "bc", "bsdk", "maderchod", "choot", "raand", "zavad", "zhavadya", "bulli"
];

/**
 * Normalizes text by handling leetspeak, removing punctuation, converting to lowercase, and handling common bypasses.
 */
const normalizeText = (text: string): string => {
  return text
    .toLowerCase()
    // Handle common leetspeak
    .replace(/@/g, "a")
    .replace(/0/g, "o")
    .replace(/1/g, "i")
    .replace(/3/g, "e")
    .replace(/5/g, "s")
    // Remove punctuation
    .replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, "") 
    // Normalize spaces
    .replace(/\s+/g, " ") 
    .trim();
};

/**
 * Checks if a string contains inappropriate language.
 * Returns true if inappropriate language is detected.
 */
export const containsInappropriateLanguage = (text: string): boolean => {
  if (!text) return false;
  
  const normalized = normalizeText(text);
  const words = normalized.split(" ");
  
  // 1. Direct word match
  const hasBannedWord = words.some(word => BANNED_WORDS.includes(word));
  if (hasBannedWord) return true;
  
  // 2. Substring match for more aggressive detection (avoids catching words broken by spaces)
  const joinedText = normalized.replace(/\s/g, "");
  const hasSubBannedWord = BANNED_WORDS.some(banned => {
    // Only check longer words for substrings to avoid false positives (e.g. "gand" inside "propaganda")
    if (banned.length >= 5 && joinedText.includes(banned)) return true;
    return false;
  });
  
  if (hasSubBannedWord) return true;

  return false;
};

export const MODERATION_ERROR_MESSAGE = "Your review contains language that doesn't follow our community guidelines. Please keep your review respectful and suitable for all users.";
