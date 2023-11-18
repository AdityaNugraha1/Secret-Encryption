const express = require('express');
const cors = require('cors');
const app = express();

// Konfigurasi CORS
const corsOptions = {
  origin: 'http://localhost', // Ganti dengan URL origin frontend Anda
  credentials: true // Tanda kutip menunjukkan ini adalah string
};

app.use(express.json());
app.use(cors(corsOptions)); // Gunakan CORS dengan opsi yang telah dikonfigurasi

// Routes
const userRoutes = require('./routes/userRoutes'); // Impor rute pengguna
app.use('/api/user', userRoutes); // Terapkan rute pengguna pada '/api/user'

const PORT = process.env.PORT || 9000;

// Import koneksi database
const connection = require('./db/connection');

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
