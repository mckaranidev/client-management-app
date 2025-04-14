const express = require('express');
const router = express.Router();
const validateClient = require('../middleware/validateClient');
let clients = require('../data/clients');

// GET: Get all clients
router.get('/', (req, res) => {
  res.status(200).json(clients);
});

// GET: Get a client by ID
router.get('/:id', (req, res) => {
  const clientId = parseInt(req.params.id);
  const client = clients.find(c => c.id === clientId);

  if (!client) {
    return res.status(404).json({ message: 'Client not found' });
  }

  res.status(200).json(client); // Fixed: Return only the matched client
});

// POST: Create a new client
router.post('/', validateClient, (req, res) => {
  const { first_name, last_name, email, gender, image } = req.body;

  const newClient = {
    id: clients.length > 0 ? clients[clients.length - 1].id + 1 : 1,
    first_name: first_name.trim(),
    last_name: last_name.trim(),
    email: email.trim(),
    gender,
    image
  };

  clients.push(newClient);
  res.status(201).json(newClient);
});

// DELETE: Delete a client by ID
router.delete('/:id', (req, res) => {
  const clientId = parseInt(req.params.id);
  const clientIndex = clients.findIndex(c => c.id === clientId);

  if (clientIndex === -1) {
    return res.status(404).json({ message: 'Client not found' });
  }

  clients.splice(clientIndex, 1);
  res.status(200).json({ message: 'Client deleted successfully' });
});

module.exports = router;
