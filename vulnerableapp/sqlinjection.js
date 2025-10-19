// ATENÇÃO: arquivo intencionalmente inseguro — só para testes/POC
const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const app = express();

// db em memória só para POC
const db = new sqlite3.Database(':memory:');

db.serialize(() => {
  db.run('CREATE TABLE users (id INTEGER PRIMARY KEY, username TEXT, password TEXT)');
  db.run(`INSERT INTO users (username, password) VALUES ('alice','password1'), ('bob','password2')`);
});

// Endpoint vulnerável: concatena input diretamente na query (SQL injection)
app.get('/vuln-login', (req, res) => {
  const username = req.query.username || '';
  const password = req.query.password || '';

  // VULNERÁVEL: string concatenation com input do usuário
  const unsafeSql = `SELECT id, username FROM users WHERE username = '${username}' AND password = '${password}' LIMIT 1;`;

  db.get(unsafeSql, (err, row) => {
    if (err) {
      return res.status(500).send('Erro no banco');
    }
    if (!row) {
      return res.status(401).send('Credenciais inválidas');
    }
    res.send(`Bem-vindo ${row.username} (id=${row.id})`);
  });
});

app.listen(3000, () => console.log('Servidor POC rodando em http://localhost:3000'));
