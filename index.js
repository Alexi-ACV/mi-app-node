const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { Pool } = require('pg');

const app = express();
const port = process.env.PORT || 10000;

// Conexión a PostgreSQL
const pool = new Pool({
  connectionString: 'postgresql://tgs_user:b6EkgcyjB8x4ZtPgAtLdNnMY7pK5Uh1L@dpg-cvu8h83uibrs73ejppp0-a.oregon-postgres.render.com/tgs'
});

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Ruta de registro
app.post('/register', async (req, res) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    return res.status(400).json({ error: 'Faltan datos requeridos.' });
  }

  try {
    const result = await pool.query(
      'INSERT INTO users (username, email, password) VALUES ($1, $2, $3) RETURNING id',
      [username, email, password]
    );

    return res.status(200).json({ message: 'Usuario registrado correctamente', id: result.rows[0].id });
  } catch (err) {
    console.error('Error al registrar:', err);
    return res.status(500).json({ error: 'Error al registrar el usuario.' });
  }
});

app.listen(port, () => {
  console.log(`Servidor corriendo en puerto ${port}`);
});
