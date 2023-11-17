const connection = require('../db/connection'); // Pastikan Anda menghubungkan ke database Anda
const md5 = require('../enkripdekrip/md5');
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

      const encryptedData = md5(password);

      // Simpan pengguna baru (tanpa meng-hash kata sandi)
      const insertUserQuery = 'INSERT INTO user (username, password, email) VALUES (?, ?, ?)';
      connection.query(insertUserQuery, [username, encryptedData, email], (error, results) => {
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

    const encryptedPassword = md5(password);
    const selectUserQuery = 'SELECT * FROM user WHERE username = ? and password = ?';

    connection.query(selectUserQuery, [username, encryptedPassword], (error, users) => {
      if (error) {
        console.error('Error during the query:', error);
        return res.status(500).json({ message: "Kesalahan server" });
      }

      if (users.length === 0) {
        return res.status(400).json({ message: "Username Atau Password Salah", username: username, encryptedPassword: encryptedPassword });
      }

      const user = users[0];
      
      if (user.password !== encryptedPassword) {
        return res.status(400).json({ message: "Username Atau Password Salah", username: username, encryptedPassword: encryptedPassword });
      }

      res.status(200).json({ message: "Login Berhasil" });
    });
  } catch (error) {
    console.error('Error:', error);
    return res.status(500).json({ message: "Kesalahan Server" });
  }
};

// Fungsi untuk mendapatkan semua pengguna
exports.getAllUsers = async (req, res) => {
  connection.query('SELECT * FROM user', (err, results, fields) => {
    if (err) throw err;
    res.json(results);
  });
};

// Fungsi untuk mendapatkan pengguna berdasarkan ID
exports.getUserById = async (req, res) => {
  const id = req.params.id;

  try {
    const selectUserByIdQuery = 'SELECT id, username, email FROM user WHERE id = ?';
    const user = await connection.query(selectUserByIdQuery, [id]);

    if (user.length === 0) {
      return res.status(404).json({ message: "Pengguna tidak ditemukan" });
    }

    res.status(200).json(user[0]);
  } catch (error) {
    console.error('Terjadi kesalahan:', error);
    res.status(500).json({ message: "Kesalahan server saat mengambil pengguna" });
  }
};

// Fungsi untuk mengupdate pengguna
exports.updateUser = async (req, res) => {
  const id = req.params.id;
  const { username, email } = req.body;

  try {
    const updateUserQuery = 'UPDATE user SET username = ?, email = ? WHERE id = ?';
    const updateResult = await connection.query(updateUserQuery, [username, email, id]);

    if (updateResult.affectedRows === 0) {
      return res.status(404).json({ message: "Pengguna tidak ditemukan" });
    }

    res.status(200).json({ message: "Pengguna berhasil diperbarui" });
  } catch (error) {
    console.error('Terjadi kesalahan:', error);
    res.status(500).json({ message: "Kesalahan server saat memperbarui pengguna" });
  }
};

// Fungsi untuk menghapus pengguna
exports.deleteUser = async (req, res) => {
  const id = req.params.id;

  try {
    const deleteUserQuery = 'DELETE FROM user WHERE id = ?';
    const deleteResult = await connection.query(deleteUserQuery, [id]);

    if (deleteResult.affectedRows === 0) {
      return res.status(404).json({ message: "Pengguna tidak ditemukan" });
    }

    res.status(200).json({ message: "Pengguna berhasil dihapus" });
  } catch (error) {
    console.error('Terjadi kesalahan:', error);
    res.status(500).json({ message: "Kesalahan server saat menghapus pengguna" });
  }
};
