const express = require('express');
const db = require('./db-config');

const app = express();
app.use(express.json());

app.get('/items', async (req, res) => {
  try {
    const items = await db('items').select('*');
    res.json(items);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch items' });
  }
});

app.get('/items/:id', async (req, res) => {
    try {
      const item = await db('items').where({ id: req.params.id }).first();
      if (item) {
        res.json(item);
      } else {
        res.status(404).json({ error: 'Item not found' });
      }
    } catch (err) {
      res.status(500).json({ error: 'Failed to fetch item' });
    }
  });

app.post('/items', async (req, res) => {
  try {
    const [id] = await db('items').insert(req.body);
    const newItem = await db('items').where({ id }).first();
    res.status(201).json(newItem);
  } catch (err) {
    res.status(500).json({ error: 'Failed to create item' });
  }
});

app.put('/items/:id', async (req, res) => {
  try {
    const count = await db('items').where({ id: req.params.id }).update(req.body);
    if (count) {
      const updatedItem = await db('items').where({ id: req.params.id }).first();
      res.json(updatedItem);
    } else {
      res.status(404).json({ error: 'Item not found' });
    }
  } catch (err) {
    res.status(500).json({ error: 'Failed to update item' });
  }
});

app.delete('/items/:id', async (req, res) => {
  try {
    const count = await db('items').where({ id: req.params.id }).del();
    if (count) {
      res.status(204).end();
    } else {
      res.status(404).json({ error: 'Item not found' });
    }
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete item' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

module.exports = app; // Export the app for testing
