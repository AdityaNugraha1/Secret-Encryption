const mysql = require('mysql');

const dbConfig = {
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'kriptocoba'
};

const connection = mysql.createConnection(dbConfig);

connection.connect((err) => {
  if (err) {
    console.error('Error connecting to database:', err);
    return;
  }
  console.log('Connected to database');
});

module.exports = connection;
