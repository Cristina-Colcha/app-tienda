const express = require('express');
const axios = require('axios');
const app = express();
const PORT = 4003;

// Middleware para parsear el cuerpo de las solicitudes como JSON
app.use(express.json());

// Función para validar las imágenes
async function validateImage(url) {
  try {
    const response = await axios.get(url);
    return response.status === 200;
  } catch {
    return false;
  }
}

// Ruta raíz
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/cliente.html');
});

// Ruta para obtener todos los productos
app.get('/products', async (req, res) => {
  try {
    let products = await axios.get('https://api.escuelajs.co/api/v1/products');
    products = products.data;

    // Filtrar productos si hay un término de búsqueda
    const searchTerm = req.query.q;
    if (searchTerm) {
      products = products.filter(product =>
        product.title.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Validar imágenes y limitar a 40 productos
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

// Ruta para obtener un producto por ID
app.get('/products/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const response = await axios.get(`https://api.escuelajs.co/api/v1/products/${id}`);
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching product', error });
  }
});

// Ruta para actualizar un producto por ID
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
