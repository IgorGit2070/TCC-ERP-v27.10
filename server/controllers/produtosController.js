const db = require('../models/db');

exports.getProdutos = (req, res) => {
  const id = req.query.id; // Pega o id da query string

  // Se um id for fornecido, filtra os resultados
  let query = 'SELECT * FROM produtos';
  if (id) {
    query += ' WHERE id = ?'; // Adiciona a condição de filtro
  }

  db.query(query, [id], (err, results) => {
    if (err) return res.status(500).send(err);
    res.json(results);
  });
};

// exports.getProdutos = (req, res) => {
//   db.query('SELECT * FROM produtos', (err, results) => {
//     if (err) return res.status(500).send(err);
//     res.json(results);
//   });
// };

exports.createProduto = (req, res) => {
  const produto = req.body;
  db.query('INSERT INTO produtos SET ?', produto, (err, results) => {
    if (err) return res.status(500).send(err);
    res.status(201).json({ id: results.insertId, ...produto });
  });
};

exports.updateProduto = (req, res) => {
  const { id } = req.params;
  const produto = req.body;
  db.query('UPDATE produtos SET ? WHERE id = ?', [produto, id], (err) => {
    if (err) return res.status(500).send(err);
    res.sendStatus(204);
  });
};

exports.deleteProduto = (req, res) => {
  const { id } = req.params;
  db.query('DELETE FROM produtos WHERE id = ?', [id], (err) => {
    if (err) return res.status(500).send(err);
    res.sendStatus(204);
  });
};
