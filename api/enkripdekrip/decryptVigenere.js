const alphabet = "abcdefghijklmnopqrstuvwxyz";
const regex = /^[a-zA-Z]+$/;

const decryptVigenere = (ciphertext, key) => {
  if (regex.test(key)) {
    let plaintext = "";
    let keyIndex = 0;

    for (let i = 0; i < ciphertext.length; i++) {
      const char = ciphertext.charAt(i);

      // Jika karakter adalah spasi, tambahkan spasi ke teks terdekripsi
      if (char=== ' '|| !regex.test(char)) {
        plaintext += char;
      } else {
        // Ubah karakter kunci menjadi huruf kecil
        const lowercaseKey = key.charAt(keyIndex % key.length).toLowerCase();
        
        const newCharIndex = (alphabet.indexOf(char.toLowerCase()) - alphabet.indexOf(lowercaseKey) + alphabet.length) % alphabet.length;
        const newChar = alphabet[newCharIndex];
        
        // Jika karakter dalam ciphertext adalah huruf besar, ubah hasil dekripsi menjadi huruf besar juga
        if (char === char.toUpperCase()) {
          plaintext += newChar.toUpperCase();
        } else {
          plaintext += newChar;
        }
        
        keyIndex++;
      }
    }
    return plaintext;
  } else {
    return "key harus huruf";
  }
};
  
module.exports = decryptVigenere;