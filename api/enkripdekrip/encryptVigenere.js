const alphabet = "abcdefghijklmnopqrstuvwxyz";
const regex = /^[a-zA-Z]+$/;

const encryptVigenere = (plaintext, key) => {
  if (regex.test(key)) {
    let ciphertext = "";
    let keyIndex = 0;

    for (let i = 0; i < plaintext.length; i++) {
      const char = plaintext.charAt(i);

      // Jika karakter adalah spasi, tambahkan spasi ke teks terenkripsi
      if (char=== ' '|| !regex.test(char)) {
        ciphertext += char;
      } else {
        // Ubah karakter kunci menjadi huruf kecil
        const lowercaseKey = key.charAt(keyIndex % key.length).toLowerCase();
        
        const newChar = alphabet[(alphabet.indexOf(char.toLowerCase()) + alphabet.indexOf(lowercaseKey)) % alphabet.length];
        
        // Jika karakter asli adalah huruf besar, ubah hasil enkripsi menjadi huruf besar juga
        if (char === char.toUpperCase()) {
          ciphertext += newChar.toUpperCase();
        } else {
          ciphertext += newChar;
        }
        
        keyIndex++;
      }
    }
    return ciphertext;
  } else {
    return "key harus huruf";
  }
};


module.exports = encryptVigenere;