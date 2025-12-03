/**
 * Configuration Encryption Tool
 * 使用字符位移算法（+1）加密配置
 *
 * 使用方式：
 * node scripts/encrypt-config.js "your-text-here"
 */

function encryptKey(text) {
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

    // Special characters remain unchanged
    return char;
  }).join('');
}

function decryptKey(text) {
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

// Main execution
const args = process.argv.slice(2);

if (args.length === 0) {
  console.log('\n🔐 Configuration Encryption Tool\n');
  console.log('使用方式：');
  console.log('  node scripts/encrypt-config.js "your-text-here"\n');
  console.log('範例：');
  console.log('  node scripts/encrypt-config.js "AIzaSyABCDEF123456"\n');
  console.log('加密 Firebase 配置範例：');
  console.log('  node scripts/encrypt-config.js "AIzaSyABCDEF123456"');
  console.log('  node scripts/encrypt-config.js "your-project.firebaseapp.com"');
  console.log('  node scripts/encrypt-config.js "your-project-id"\n');
  process.exit(1);
}

const input = args[0];
const encrypted = encryptKey(input);
const decrypted = decryptKey(encrypted);

console.log('\n✅ 加密結果：\n');
console.log('原始文字:', input);
console.log('加密後  :', encrypted);
console.log('驗證解密:', decrypted);
console.log('解密正確:', input === decrypted ? '✅' : '❌');
console.log('');
