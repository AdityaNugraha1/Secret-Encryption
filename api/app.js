const express = require('express');
const multer = require('multer');
const mysql = require('mysql');
const app = express();

// Setup multer untuk pengunggahan file
const upload = multer({ dest: './assets' });

// Konfigurasi koneksi ke database MySQL
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root', // Ganti dengan username MySQL Anda
  password: '', // Ganti dengan password MySQL Anda
  database: 'kriptocoba' // Ganti dengan nama database Anda
});

// Membuka koneksi ke database
connection.connect(error => {
  if (error) throw error;
  console.log("Berhasil terhubung ke database");
});

// Endpoint untuk mengunggah gambar
app.post('/upload', upload.single('image'), (req, res) => {
  const file = req.file;
  const idusername = '1'; // Ini hanya contoh, sesuaikan dengan kebutuhan Anda
  const type = "kontol";
  const value = file.path;

  // Query untuk memasukkan data ke database
  connection.query('INSERT INTO enkripsi (idusername, type, value) VALUES (?, ?, ?)', [idusername, type, value], (error, results, fields) => {
    if (error) {
        console.error('Error saat menyimpan data ke database:', error);
        return res.status(500).send('Error saat menyimpan data ke database');
      }
      res.status(200).send('Gambar berhasil diunggah dan disimpan ke database');
    });
  });
// Menjalankan server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server berjalan pada port ${PORT}`);
});
