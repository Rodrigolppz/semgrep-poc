const express = require('express');
const app = express();

app.get('/xss', (req, res) => {
  const name = req.query.name;
  res.send(`Olá ${name}`); // possível XSS
});

app.get('/eval', (req, res) => {
  eval(req.query.code); // vulnerabilidade crítica
  res.send('Executado!');
});

app.listen(3000, () => console.log('Rodando em http://localhost:3000'));
