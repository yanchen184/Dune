/**
 * Enhanced character shift encryption/decryption
 * Position-based shift: odd positions +1, even positions +2
 *
 * Example:
 * Position: 0  1  2  3  4  5  (0-indexed)
 * Shift:    +2 +1 +2 +1 +2 +1
 *
 * Shifts letters and numbers, special characters remain unchanged
 * A→C, B→C, Z→B, 0→2, 1→2, 9→1
 */

export function encryptKey(text: string): string {
  return text.split('').map((char, index) => {
    const code = char.charCodeAt(0);
    // Odd positions (1, 3, 5...) shift by +1, Even positions (0, 2, 4...) shift by +2
    const shift = index % 2 === 0 ? 2 : 1;

    // Uppercase letters A-Z
    if (code >= 65 && code <= 90) {
      return String.fromCharCode(((code - 65 + shift) % 26) + 65);
    }

    // Lowercase letters a-z
    if (code >= 97 && code <= 122) {
      return String.fromCharCode(((code - 97 + shift) % 26) + 97);
    }

    // Numbers 0-9
    if (code >= 48 && code <= 57) {
      return String.fromCharCode(((code - 48 + shift) % 10) + 48);
    }

    // Special characters (-, _, etc.) remain unchanged
    return char;
  }).join('');
}

export function decryptKey(text: string): string {
  return text.split('').map((char, index) => {
    const code = char.charCodeAt(0);
    // Reverse: odd positions -1, even positions -2
    const shift = index % 2 === 0 ? 2 : 1;

    // Uppercase letters A-Z
    if (code >= 65 && code <= 90) {
      return String.fromCharCode(((code - 65 - shift + 26) % 26) + 65);
    }

    // Lowercase letters a-z
    if (code >= 97 && code <= 122) {
      return String.fromCharCode(((code - 97 - shift + 26) % 26) + 97);
    }

    // Numbers 0-9
    if (code >= 48 && code <= 57) {
      return String.fromCharCode(((code - 48 - shift + 10) % 10) + 48);
    }

    // Special characters remain unchanged
    return char;
  }).join('');
}

// Test function (for development only)
export function testEncryption(original: string): void {
  const encrypted = encryptKey(original);
  const decrypted = decryptKey(encrypted);
  console.log('Original:', original);
  console.log('Encrypted:', encrypted);
  console.log('Decrypted:', decrypted);
  console.log('Match:', original === decrypted);
}
