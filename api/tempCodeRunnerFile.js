const express = require('express');
const cors = require('cors');
const app = express();

// Middleware
app.use(express.json()); // Untuk mengurai JSON pada request body
app.use(cors()); // Mengaktifkan CORS untuk semua permintaan

// Routes
const userRoutes = require('./routes/userRoutes'); // Impor rute pengguna
app.use('/api/user', userRoutes); // Terapkan rute pengguna pada '/api/user'

// Set up port
const PORT = process.env.PORT || 9000;

// Import dan start koneksi database
const connection = require('./db/connection');
connection.connect(error => {
  if (error) {
    console.error('Error connecting to the database:', error);
    return;
  }

  console.log('Connected to the database successfully');
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
