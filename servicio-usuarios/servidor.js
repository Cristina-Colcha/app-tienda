const express = require('express');
const axios = require('axios');
const app = express();


app.use(express.json());

// Root route
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/Cliente.html');
});

// Get all users
app.get('/users', async (req, res) => {
  try {
    const response = await axios.get('https://api.escuelajs.co/api/v1/users');
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching users', error: error.message });
  }
});

// Get user by ID
app.get('/users/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const response = await axios.get(`https://api.escuelajs.co/api/v1/users/${id}`);
    res.json(response.data);
  } catch (error) {
    if (error.response && error.response.status === 404) {
      res.status(404).json({ message: 'User not found' });
    } else {
      res.status(500).json({ message: 'Error fetching user', error: error.message });
    }
  }
});

// Create a new user
app.post('/users', async (req, res) => {
  try {
    const response = await axios.post('https://api.escuelajs.co/api/v1/users', req.body);
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ message: 'Error creating user', error: error.message });
  }
});

// Update user by ID
app.put('/users/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const response = await axios.put(`https://api.escuelajs.co/api/v1/users/${id}`, req.body);
    res.json(response.data);
  } catch (error) {
    if (error.response && error.response.status === 404) {
      res.status(404).json({ message: 'User not found' });
    } else {
      res.status(500).json({ message: 'Error updating user', error: error.message });
    }
  }
});

// Delete user by ID
app.delete('/users/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const response = await axios.delete(`https://api.escuelajs.co/api/v1/users/${id}`);
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    if (error.response && error.response.status === 404) {
      res.status(404).json({ message: 'User not found' });
    } else {
      res.status(500).json({ message: 'Error deleting user', error: error.message });
    }
  }
});

// Start server
const PORT = process.env.PORT || 4002;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
