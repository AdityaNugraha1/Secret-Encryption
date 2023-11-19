// session.js

// Fungsi untuk memeriksa sesi login
function checkLogin() {
  var isLoggedIn = sessionStorage.getItem('isLoggedIn');
  var username = sessionStorage.getItem('username');
  var id = sessionStorage.getItem('id');
  var loginTime = sessionStorage.getItem('loginTime');

  // Jika pengguna belum login atau sesi telah kadaluwarsa, arahkan ke halaman login
  if (!isLoggedIn || isSessionExpired(loginTime)) {
    window.location.href = 'index.html';
  } else {
    // Tampilkan modal sesi berhasil
   // showModal('Sesi berhasil', 'Selamat datang, ' + username + " " + id +'!');
  }
}
function getSessionId() {
  return sessionStorage.getItem('id'); // Assuming 'id' is where the session ID is stored.
}

// Fungsi untuk logout
function logout() {
  sessionStorage.removeItem('isLoggedIn');
  sessionStorage.removeItem('username');
  sessionStorage.removeItem('loginTime'); // Hapus waktu sesi saat logout
  window.location.href = 'index.html';
}

function isSessionExpired(loginTime) {
  // Waktu sesi kadaluwarsa dihitung dalam milidetik (2 jam = 2 * 60 * 60 * 1000 ms)
  var sessionTimeout = 2 * 60 * 60 * 1000;
  var currentTime = new Date().getTime();

  // Periksa apakah waktu sesi telah melewati batas waktu
  return (currentTime - loginTime) > sessionTimeout;
}
