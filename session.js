// session.js

// Fungsi untuk memeriksa sesi login
function checkLogin() {
  var isLoggedIn = sessionStorage.getItem('isLoggedIn');

  // Jika pengguna belum login, arahkan ke halaman login
  if (!isLoggedIn) {
    window.location.href = 'index.html';
  }
}

// Fungsi untuk logout
function logout() {
  sessionStorage.removeItem('isLoggedIn');
  window.location.href = 'index.html';
}
