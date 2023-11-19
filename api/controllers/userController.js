const connection = require('../db/connection'); // Pastikan Anda menghubungkan ke database Anda
const md5 = require('../enkripdekrip/md5');
const encryptVigenere = require('../enkripdekrip/encryptVigenere');
const decryptVigenere = require('../enkripdekrip/decryptVigenere');
const xor_encrypt = require('../enkripdekrip/xor_encrypt');
const xor_decrypt = require('../enkripdekrip/xor_decrypt');
//const encodeMessage = require('../enkripdekrip/stegano');
//const decodeMessage = require('../enkripdekrip/stegano');
//const steganoenkripsi = require('../enkripdekrip/steganoenkrip'); // 
const Jimp = require('jimp');
const path = require('path');
const fs = require('fs');

// Fungsi untuk registrasi pengguna
exports.register = async (req, res) => {
  try {
    const { username, password, email } = req.body;

    // Memeriksa panjang karakter username, password, dan email
    if (!(username && password && email)) {
      return res.status(400).json({ message: "Semua Input Diperlukan" });
    }
    
    if (username.length > 30 || password.length > 30 || email.length > 30) {
      return res.status(400).json({ message: "Panjang Karakter Input Tidak Boleh Lebih Dari 30 Karakter" });
    }

    // Cek apakah pengguna sudah terdaftar
    connection.query('SELECT * FROM user WHERE username = ? OR email = ?', [username, email], (error, users) => {
      if (error) {
        console.error('Error during the query:', error);
        return res.status(500).json({ message: "Kesalahan Server" });
      }

      if (users.length > 0) {
        return res.status(409).json({ message: "Pengguna Sudah Serdaftar" });
      }
      const encryptedUser = md5(username);
      const encryptedData = md5(password);

      // Simpan pengguna baru (tanpa meng-hash kata sandi)
      const insertUserQuery = 'INSERT INTO user (username, password, email) VALUES (?, ?, ?)';
      connection.query(insertUserQuery, [encryptedUser, encryptedData, email], (error, results) => {
        if (error) {
          console.error('Error during the query:', error);
          return res.status(500).json({ message: "Kesalahan Server" });
        }

        res.status(201).json({ message: "Pengguna Berhasil Didaftarkan" });
      });
    });
  } catch (error) {
    console.error('Error:', error);
    return res.status(500).json({ message: "Kesalahan Server" });
  }
};

// Fungsi untuk login pengguna
exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;

    // Memeriksa panjang karakter username dan password
    if (!(username && password)) {
      return res.status(400).json({ message: "Semua Input Diperlukan" });
    }
    
    if (username.length > 30 || password.length > 30) {
      return res.status(400).json({ message: "Panjang Karakter Username Atau Password Tidak Boleh Lebih Dari 30 Karakter" });
    }
    const encryptedUser = md5(username);
    const encryptedPassword = md5(password);
    const selectUserQuery = 'SELECT * FROM user WHERE username = ? and password = ?';

    connection.query(selectUserQuery, [encryptedUser, encryptedPassword], (error, users) => {
      if (error) {
        console.error('Error during the query:', error);
        return res.status(500).json({ message: "Kesalahan server" });
      }

      if (users.length === 0) {
        return res.status(400).json({ message: "Username Atau Password Salah"});
      }

      const user = users[0];
      
      if (user.username !== encryptedUser && user.password !== encryptedPassword) {
        return res.status(400).json({ message: "Username Atau Password Salah"});
      }

      if (user.username == encryptedUser && user.password == encryptedPassword) {
        return res.status(200).json({ message: 'Login Successful' , id: user.id });
      }
    });
  } catch (error) {
    console.error('Error:', error);
    return res.status(500).json({ message: "Kesalahan Server" });
  }
};

// Fungsi untuk superenkripsi
exports.superenkripsi = async (req, res) => {
  try {
    const { sessionId, plaintext } = req.body;

    if (!plaintext) {
      return res.status(400).json({ message: "Semua Input Diperlukan" });
    }

    if (plaintext.length > 500) {
      return res.status(400).json({ message: "Panjang Plaintext tidak boleh lebih dari 500 karakter" });
    }

    const key = "adit";
    let akhir = encryptVigenere(plaintext, key);
    let hasilEnkripsi = xor_encrypt(akhir, key);

    const insertUserQuery = 'INSERT INTO enkripsi (idusername, type, value) VALUES (?, ?, ?)';
    connection.query(insertUserQuery, [sessionId, "Text Encryption", hasilEnkripsi], (error, results) => {
      if (error) {
        console.error('Error during the query:', error);
        return res.status(500).json({ message: "Kesalahan Server" });
      }

      // Only send the response here, after the DB operation is complete
      res.status(201).json({ hasilEnkripsi, message: "Berhasil" });
    });
  } catch (error) {
    console.error('Error:', error);
    return res.status(500).json({ message: "Kesalahan Server" });
  }
};

exports.superdekripsi = async (req, res) => {
  try {
    const { sessionId, plaintext } = req.body;

    // Memeriksa panjang karakter text dan key
    if (!plaintext) {
      return res.status(400).json({ message: "Semua Input Diperlukan" });
    }

    if (plaintext.length > 500) {
      return res.status(400).json({ message: "Panjang Plaintext tidak boleh lebih dari 500 karakter" });
    }

    const key = "adit";
    // Decrypt the text using XOR and Vigenere
    let akhir = xor_decrypt(plaintext, key);
    let hasildekripsi = decryptVigenere(akhir, key);

    // Prepare the query to insert the decryption result
    const insertDecryptionResultQuery = 'INSERT INTO enkripsi (idusername, type, value) VALUES (?, ?, ?)';
    connection.query(insertDecryptionResultQuery, [sessionId, "Text Decryption", hasildekripsi], (error, results) => {
      if (error) {
        console.error('Error during the query:', error);
        return res.status(500).json({ message: "Kesalahan Server" });
      }

      // Send the response after the DB operation is complete
      res.status(201).json({ hasildekripsi, message: "Dekripsi Berhasil" });
    });
  } catch (error) {
    console.error('Error:', error);
    return res.status(500).json({ message: "Kesalahan Server" });
  }
};

exports.history = async (req, res) => {
  const { sessionId } = req.body;

  // Ensure that the SQL query is parameterized correctly
  const gethistory = 'SELECT * FROM enkripsi WHERE idusername = ?'; // Added the comparison operator

  connection.query(gethistory, [sessionId], (error, results) => {
    if (error) {
      console.error('Error during the query:', error);
      return res.status(500).json({ message: "Kesalahan Server" });
    }

    // Send the results back in the response
    res.status(200).json(results); // Changed the status code to 200 and sent back the results
  });
};

exports.masukgambar = async (req, res) => {
  try {
    const { sessionId } = req.body;  // atau cara lain sesuai dengan bagaimana Anda mendapatkan sessionId
    const image = req.file ? req.file.filename : null;

    if (!sessionId || !image) {
      return res.status(400).json({ message: "Semua Input Diperlukan" });
    }

    // Pastikan path ke direktori assets ada
    const assetsDir = path.join(__dirname, '../assets');
    if (!fs.existsSync(assetsDir)) {
      fs.mkdirSync(assetsDir, { recursive: true });
    }

    // Gunakan path lengkap untuk file yang diunggah
    const uploadedImagePath = path.join(__dirname, '../assets', image);
    const img = await Jimp.read(uploadedImagePath);
    img.invert();
    img.rotate(180) // Memutar gambar 180 derajat
       .flip(false, true) // Membalik gambar secara vertikal
       .color([
          { apply: 'hue', params: [90] }, // Mengubah hue
          { apply: 'lighten', params: [10] } // Mencerahkan gambar
       ]);
    const encryptedImagePath = path.join(__dirname, '../assets', 'encrypted-' + image);
    await img.writeAsync(encryptedImagePath);

    const insertgambar = 'INSERT INTO enkripsi (idusername, type, value) VALUES (?, ?, ?)';
    connection.query(insertgambar, [sessionId, "Image Encryption", encryptedImagePath], (error, results) => {
      if (error) {
        console.error('Error during the query:', error);
        return res.status(500).json({ message: "Kesalahan Server" });
      }
      const encryptedImageURL = `http://localhost:9000/assets/encrypted-${image}`;
      res.status(201).json({message: "Image uploaded and entry created successfully.", imageUrl: encryptedImageURL });
    });
  } catch (error) {
    console.error('Error:', error);
    return res.status(500).json({ message: "Kesalahan Server" });
  }
};

exports.dekripgambar = async (req, res) => {
  
  try {
    const { sessionId } = req.body;  // atau cara lain sesuai dengan bagaimana Anda mendapatkan sessionId
    const image = req.file ? req.file.filename : null;

    if (!sessionId || !image) {
      return res.status(400).json({ message: "Semua Input Diperlukan" });
    }

    // Pastikan path ke direktori assets ada
    const assetsDir = path.join(__dirname, '../assets');
    if (!fs.existsSync(assetsDir)) {
      fs.mkdirSync(assetsDir, { recursive: true });
    }

    // Gunakan path lengkap untuk file yang diunggah
    const uploadedImagePath = path.join(__dirname, '../assets', image);
    const img = await Jimp.read(uploadedImagePath);
    img.rotate(180) // Memutar kembali gambar 180 derajat
       .flip(false, true) // Membalik kembali gambar secara vertikal
       .color([
          { apply: 'hue', params: [-90] }, // Mengembalikan hue
          { apply: 'darken', params: [10] } // Menggelapkan gambar
       ]);
       img.invert();
    const dekripImagePath = path.join(__dirname, '../assets', 'decrypted-' + image);
    await img.writeAsync(dekripImagePath);

    const insertgambar = 'INSERT INTO enkripsi (idusername, type, value) VALUES (?, ?, ?)';
    connection.query(insertgambar, [sessionId, "Image Decryption", dekripImagePath], (error, results) => {
      if (error) {
        console.error('Error during the query:', error);
        return res.status(500).json({ message: "Kesalahan Server" });
      }
      const dekripImageurl = `http://localhost:9000/assets/decrypted-${image}`;
      res.status(201).json({message: "Image uploaded and entry created successfully.", imageUrl: dekripImageurl });
    });
  } catch (error) {
    console.error('Error:', error);
    return res.status(500).json({ message: "Kesalahan Server" });
  }
};

exports.sendToServer = async (req, res) => {
 
  try {
    const { sessionId } = req.body;  // atau cara lain sesuai dengan bagaimana Anda mendapatkan sessionId
    const imageLoader = req.file ? req.file.filename : null;

    if (!sessionId || !imageLoader) {
      return res.status(400).json({ message: "Semua Input Diperlukan" });
    }

    // Pastikan path ke direktori assets ada
    const assetsDir = path.join(__dirname, '../assets');
    if (!fs.existsSync(assetsDir)) {
      fs.mkdirSync(assetsDir, { recursive: true });
    }

    // Gunakan path lengkap untuk file yang diunggah
    const uploadedImagePath = path.join(__dirname, '../assets', imageLoader);
    const img = await Jimp.read(uploadedImagePath);
  
    const sendImagePath = path.join(__dirname, '../assets', 'decrypted-' + imageLoader);
    await img.writeAsync(sendImagePath);

    const insertgambar = 'INSERT INTO enkripsi (idusername, type, value) VALUES (?, ?, ?)';
    connection.query(insertgambar, [sessionId, "Secret", sendImagePath], (error, results) => {
      if (error) {
        console.error('Error during the query:', error);
        return res.status(500).json({ message: "Kesalahan Server" });
      }
      const sendImageUrl = `http://localhost:9000/assets/Secret-${imageLoader}`;
      res.status(201).json({message: "Image uploaded and entry created successfully.", imageUrl: sendImageUrl });
    });
  } catch (error) {
    console.error('Error:', error);
    return res.status(500).json({ message: "Kesalahan Server" });
  }
};


exports.sendToServer2 = async (req, res) => {
 
  try {
    const { sessionId } = req.body;  // atau cara lain sesuai dengan bagaimana Anda mendapatkan sessionId
    const imageLoader2 = req.file ? req.file.filename : null;

    if (!sessionId || !imageLoader2) {
      return res.status(400).json({ message: "Semua Input Diperlukan" });
    }

    // Pastikan path ke direktori assets ada
    const assetsDir = path.join(__dirname, '../assets');
    if (!fs.existsSync(assetsDir)) {
      fs.mkdirSync(assetsDir, { recursive: true });
    }

    // Gunakan path lengkap untuk file yang diunggah
    const uploadedImagePath = path.join(__dirname, '../assets', imageLoader2);
    const img = await Jimp.read(uploadedImagePath);
  
    const sendImagePath = path.join(__dirname, '../assets', 'decrypted-' + imageLoader2);
    await img.writeAsync(sendImagePath);

    const insertgambar = 'INSERT INTO enkripsi (idusername, type, value) VALUES (?, ?, ?)';
    connection.query(insertgambar, [sessionId, "Secret", sendImagePath], (error, results) => {
      if (error) {
        console.error('Error during the query:', error);
        return res.status(500).json({ message: "Kesalahan Server" });
      }
      const sendImageUrl = `http://localhost:9000/assets/Secret-${imageLoader2}`;
      res.status(201).json({message: "Image uploaded and entry created successfully.", imageUrl: sendImageUrl });
    });
  } catch (error) {
    console.error('Error:', error);
    return res.status(500).json({ message: "Kesalahan Server" });
  }
};