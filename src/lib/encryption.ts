/**
 * Simple character shift encryption/decryption
 * Shifts letters by +1: A→B, Z→A, a→b, z→a
 * Shifts numbers by +1: 0→1, 9→0
 * Special characters remain unchanged
 */

export function encryptKey(text: string): string {
  return text.split('').map(char => {
    const code = char.charCodeAt(0);

    // Uppercase letters A-Z
    if (code >= 65 && code <= 90) {
      return code === 90 ? 'A' : String.fromCharCode(code + 1);
    }

    // Lowercase letters a-z
    if (code >= 97 && code <= 122) {
      return code === 122 ? 'a' : String.fromCharCode(code + 1);
    }

    // Numbers 0-9
    if (code >= 48 && code <= 57) {
      return code === 57 ? '0' : String.fromCharCode(code + 1);
    }

    // Special characters (-, _, etc.) remain unchanged
    return char;
  }).join('');
}

export function decryptKey(text: string): string {
  return text.split('').map(char => {
    const code = char.charCodeAt(0);

    // Uppercase letters A-Z (reverse: B→A, A→Z)
    if (code >= 65 && code <= 90) {
      return code === 65 ? 'Z' : String.fromCharCode(code - 1);
    }

    // Lowercase letters a-z (reverse: b→a, a→z)
    if (code >= 97 && code <= 122) {
      return code === 97 ? 'z' : String.fromCharCode(code - 1);
    }

    // Numbers 0-9 (reverse: 1→0, 0→9)
    if (code >= 48 && code <= 57) {
      return code === 48 ? '9' : String.fromCharCode(code - 1);
    }

    // Special characters remain unchanged
    return char;
  }).join('');
}

// Example usage:
// const encrypted = encryptKey('sk-proj-abc123');
// const decrypted = decryptKey(encrypted);
