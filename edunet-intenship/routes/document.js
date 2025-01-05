const express = require('express');
const router = express.Router();

let documentContent = '';

router.get('/', (req, res) => {
  res.json({ content: documentContent });
});

router.post('/', (req, res) => {
  const { content } = req.body;
  documentContent = content;
  res.json({ message: 'Document saved successfully!' });
});

module.exports = router;
