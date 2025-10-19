// ATENÇÃO: inseguro — uso apenas em ambiente de teste
import express from 'express';
import sqlite3 from 'sqlite3';

const app = express();
const sqlite = sqlite3.verbose();
const db = new sqlite.Database(':memory:');

db.serialize(() => {
  db.run('CREATE TABLE users (id INTEGER PRIMARY KEY, username TEXT, password TEXT)');
  db.run(`INSERT INTO users (username, password) VALUES ('alice','password1'), ('bob','password2')`);
});

app.get('/vuln-login', (req, res) => {
  const username = String(req.query.username || '');
  const password = String(req.query.password || '');

  // VULNERÁVEL: concatenação direta
  const unsafeSql = `SELECT id, username FROM users WHERE username = '${username}' AND password = '${password}' LIMIT 1;`;

  db.get(unsafeSql, (err, row) => {
    if (err) return res.status(500).send('Erro no banco');
    if (!row) return res.status(401).send('Credenciais inválidas');
    res.send(`Bem-vindo ${row.username} (id=${row.id})`);
  });
});

app.listen(3000, () => console.log('Servidor POC rodando em http://localhost:3000'));
