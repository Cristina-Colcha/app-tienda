
const express = require('express');
const axios = require('axios');
const router = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Category:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *         name:
 *           type: string
 *         image:
 *           type: string
 */

/**
 * @swagger
 * /categories:
 *   get:
 *     summary: Retrieve a list of categories
 *     responses:
 *       200:
 *         description: A list of categories
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Category'
 */
router.get('/', async (req, res) => {
  try {
    const response = await axios.get('https://api.escuelajs.co/api/v1/categories');
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
