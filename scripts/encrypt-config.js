/**
 * Encryption tool for OpenAI API Key
 * Usage: node scripts/encrypt-config.js "your-api-key-here"
 */

function encryptKey(text) {
  return text.split('').map((char, index) => {
    const code = char.charCodeAt(0);
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

    // Special characters remain unchanged
    return char;
  }).join('');
}

function decryptKey(text) {
  return text.split('').map((char, index) => {
    const code = char.charCodeAt(0);
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

// Main execution
const apiKey = process.argv[2];

if (!apiKey) {
  console.error('❌ Error: Please provide an API key to encrypt');
  console.log('Usage: node scripts/encrypt-config.js "sk-proj-..."');
  process.exit(1);
}

const encrypted = encryptKey(apiKey);
const decrypted = decryptKey(encrypted);

console.log('\n🔐 Encryption Results:');
console.log('─'.repeat(80));
console.log('Original API Key:', apiKey);
console.log('Encrypted:', encrypted);
console.log('Decrypted (verification):', decrypted);
console.log('─'.repeat(80));

if (apiKey === decrypted) {
  console.log('✅ Encryption/Decryption successful!\n');
  console.log('📋 Copy this encrypted key to src/lib/config.ts:');
  console.log(`encryptedOpenAIKey: '${encrypted}',\n`);
} else {
  console.log('❌ Error: Encryption/Decryption mismatch!\n');
  process.exit(1);
}
