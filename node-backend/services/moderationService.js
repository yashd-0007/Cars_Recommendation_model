/**
 * Backend Content Moderation Service
 * Ensures user-submitted reviews are clean before being saved to the database.
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
 * Normalizes text for consistent checking.
 */
const normalizeText = (text) => {
  if (typeof text !== "string") return "";
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
 * Validates content for inappropriate language.
 * @param {string} text - The text to check.
 * @returns {boolean} - Returns true if inappropriate language is detected.
 */
const containsInappropriateLanguage = (text) => {
  if (!text) return false;
  
  const normalized = normalizeText(text);
  const words = normalized.split(" ");
  
  // 1. Direct word match
  const hasBannedWord = words.some(word => BANNED_WORDS.includes(word));
  if (hasBannedWord) return true;
  
  // 2. Substring match for joined words
  const joinedText = normalized.replace(/\s/g, "");
  const hasSubBannedWord = BANNED_WORDS.some(banned => {
    if (banned.length >= 5 && joinedText.includes(banned)) return true;
    return false;
  });
  
  return hasSubBannedWord;
};

const MODERATION_ERROR_MESSAGE = "Your review contains inappropriate language. Please revise it and try again.";

module.exports = {
  containsInappropriateLanguage,
  MODERATION_ERROR_MESSAGE
};
