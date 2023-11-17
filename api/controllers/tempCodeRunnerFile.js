
// Fungsi untuk login pengguna
exports.login = async (req, res) => {
  const { username, password } = req.body;

  try {
    if (!(username && password)) {
      return res.status(400).json({ message: "Semua input diperlukan" });
    }

    // Cek pengguna dan cocokkan password
    const selectUserQuery = 'SELECT * FROM user WHERE username = ?';
    const userResults = await connection.query(selectUserQuery, [username]);

    if (userResults.length === 0) {
      return res.status(400).json({ message: "Kredensial salah" });
    }

    const user = userResults[0];
    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return res.status(400).json({ message: "Kredensial salah" });
    }

    // Buat token dan kirimkan sebagai respons
    const token = jwt.sign({ user_id: user.id, username }, process.env.JWT_SECRET, { expiresIn: '2h' });
    res.status(200).json({ message: "Login berhasil", token });
  } catch (error) {
    console.error('Terjadi kesalahan:', error);
    res.status(500).json({ message: "Kesalahan server" });
  }
};