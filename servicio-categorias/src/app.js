// src/app.js
const express = require('express');
const { swaggerUi, specs } = require('./swagger');
const categoriesRoutes = require('./routes/categories');
const axios = require('axios');

const app = express();

app.set('view engine', 'ejs');
app.set('views', './src/views');

app.use(express.static('public')); 
app.use(express.urlencoded({ extended: true })); // Middleware for parsing form data

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));
app.use('/categories', categoriesRoutes);

app.get('/', (req, res) => {
  res.redirect('/view-categories');
});
// Path to display categories with search functionality
app.get('/view-categories', async (req, res) => {
  try {
    const response = await axios.get('https://api.escuelajs.co/api/v1/categories');
    let categories = response.data;

    // Filter categories if a search parameter is submitted
    const { search } = req.query;
    if (search) {
      categories = categories.filter(category =>
        category.name.toLowerCase().includes(search.toLowerCase())
      );
    }

    res.render('categories', { categories, search });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Ruta para eliminar una categoría
app.post('/delete-category', async (req, res) => {
  const { id } = req.body;
  try {
    await axios.delete(`https://api.escuelajs.co/api/v1/categories/${id}`);
    res.redirect('/view-categories');
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Ruta para mostrar el formulario de modificación de categoría
app.get('/edit-category/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const response = await axios.get(`https://api.escuelajs.co/api/v1/categories/${id}`);
    const category = response.data;
    res.render('edit-category', { category });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Ruta para procesar la modificación de categoría
app.post('/edit-category/:id', async (req, res) => {
  const { id } = req.params;
  const { name, description, image } = req.body;
  try {
    await axios.put(`https://api.escuelajs.co/api/v1/categories/${id}`, {
      name,
      description,
      image,
    });
    res.redirect('/view-categories');
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

const PORT = process.env.PORT || 4001;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
