const express = require('express');
const axios = require('axios');
const app = express();
const PORT = 4003;

// requests as JSON
app.use(express.json());

// Function to validate images
async function validateImage(url) {
  try {
    const response = await axios.get(url);
    return response.status === 200;
  } catch {
    return false;
  }
}

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/cliente.html');
});

// get all products
app.get('/products', async (req, res) => {
  try {
    let products = await axios.get('https://api.escuelajs.co/api/v1/products');
    products = products.data;

    // Filter products if there is a search term
    const searchTerm = req.query.q;
    if (searchTerm) {
      products = products.filter(product =>
        product.title.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    
    const validProducts = [];
    for (const product of products) {
      if (validProducts.length >= 65) break;
      const isValidImage = await validateImage(product.images[0]);
      if (isValidImage) {
        validProducts.push(product);
      }
    }

    res.json(validProducts);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching products', error });
  }
});

// get a product by ID
app.get('/products/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const response = await axios.get(`https://api.escuelajs.co/api/v1/products/${id}`);
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching product', error });
  }
});

// update a product by ID
app.put('/products/:id', async (req, res) => {
  const { id } = req.params;
  const { title, price } = req.body;
  try {
    const response = await axios.put(`https://api.escuelajs.co/api/v1/products/${id}`, { title, price });
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ message: 'Error updating product', error });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
