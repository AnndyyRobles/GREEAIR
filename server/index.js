import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import pkg from 'pg';
import bcrypt from 'bcrypt';
const { Pool } = pkg;

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const pool = new Pool({
  user: process.env.DB_USER || 'postgres',
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME || 'GreenAir',
  password: process.env.DB_PASSWORD || 'root',
  port: parseInt(process.env.DB_PORT || '5432'),
});


// Middleware para manejar errores de conexión a la BD
app.use(async (req, res, next) => {
  try {
    await pool.query('SELECT NOW()');
    next();
  } catch (err) {
    console.error('Error de conexión a la base de datos:', err);
    res.status(500).json({ 
      error: 'Error de conexión a la base de datos',
      details: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
});

// Middleware para logging
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  next();
});

// Get all stations with coordinates
app.get('/api/stations/coordinates', async (req, res) => {
  try {
    console.log("Iniciando consulta para /api/stations/coordinates...");
    const result = await pool.query(`
      SELECT nombre, latitud, longitud
      FROM estaciones
    `);
    console.log("Resultados de la consulta:", result.rows); // Log para depuración
    res.json(result.rows);
  } catch (error) {
    console.error("Error en /api/stations/coordinates:", error);
    res.status(500).json({ error: error.message });
  }
});

// Get all regions
app.get('/api/regions', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM regiones ORDER BY nombre');
    res.json(result.rows);
  } catch (error) {
    console.error('Error en /api/regions:', error);
    res.status(500).json({ error: error.message });
  }
});


// Get stations grouped by region
app.get('/api/stations/by-region', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT e.*, r.nombre as region_nombre
      FROM estaciones e
      JOIN regiones r ON e.id_region = r.id_region
      ORDER BY r.nombre, e.nombre
    `);
    
    const stationsByRegion = result.rows.reduce((acc, station) => {
      if (!acc[station.id_region]) {
        acc[station.id_region] = [];
      }
      acc[station.id_region].push(station);
      return acc;
    }, {});
    
    res.json(stationsByRegion);
  } catch (error) {
    console.error('Error en /api/stations/by-region:', error);
    res.status(500).json({ error: error.message });
  }
});


// Get station details
app.get('/api/stations/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query(`
      SELECT e.*, r.nombre as region_nombre
      FROM estaciones e
      JOIN regiones r ON e.id_region = r.id_region
      WHERE e.id_estacion = $1
    `, [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Station not found' });
    }
    
    res.json(result.rows[0]);
  } catch (error) {
    console.error(`Error en /api/stations/${req.params.id}:`, error);
    res.status(500).json({ error: error.message });
  }
});

// Get weather conditions for a station
app.get('/api/stations/:id/weather', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query(`
      SELECT cc.*, e.nombre as estacion
      FROM condiciones_climaticas cc
      JOIN estaciones e ON cc.id_estacion = e.id_estacion
      WHERE cc.id_estacion = $1
      ORDER BY cc.fecha DESC
      LIMIT 1
    `, [id]);
    
    if (result.rows.length === 0) {
      return res.json({
        temperatura: 0,
        humedad: 0,
        velocidad_viento: 0,
        estacion: ''
      });
    }
    res.json(result.rows[0]);
  } catch (error) {
    console.error(`Error en /api/stations/${req.params.id}/weather:`, error);
    res.status(500).json({ error: error.message });
  }
});

// Get alerts for a station
app.get('/api/stations/:id/alerts', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query(`
      SELECT a.*, m.fecha, m.valor_concentracion as concentracion, c.nombre as contaminante
      FROM alertas a
      JOIN mediciones m ON a.id_medicion = m.id_medicion
      JOIN contaminantes c ON m.id_contaminante = c.id_contaminante
      WHERE m.id_estacion = $1
      AND m.fecha <= NOW()  -- Filtrar para excluir fechas futuras
      AND m.fecha::date = NOW()::date  -- Solo alertas del día actual
      ORDER BY m.fecha DESC
      LIMIT 10
    `, [id]);
    res.json(result.rows);
  } catch (error) {
    console.error(`Error en /api/stations/${req.params.id}/alerts:`, error);
    res.status(500).json({ error: error.message });
  }
});

// Get weekly history for a station
app.get('/api/stations/:id/history', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query(`
      SELECT m.fecha, c.nombre as contaminante, m.valor_concentracion,
             m.indice_calidad, m.valor_calidad
      FROM mediciones m
      JOIN contaminantes c ON m.id_contaminante = c.id_contaminante
      WHERE m.id_estacion = $1
      AND m.fecha >= (NOW()::date - INTERVAL '6 days')  -- Incluye hoy y los seis días anteriores
      AND m.fecha < NOW()  -- Asegura que no se incluyan fechas futuras
      ORDER BY m.fecha DESC
    `, [id]);
    res.json(result.rows);
  } catch (error) {
    console.error(`Error en /api/stations/${req.params.id}/history:`, error);
    res.status(500).json({ error: error.message });
  }
});

// Get main pollutant for a station
app.get('/api/stations/:id/pollutant', async (req, res) => {
  try {
    const { id } = req.params;

    // Consulta para obtener el contaminante con mayor concentración del día actual
    const result = await pool.query(`
      SELECT c.nombre as contaminante, c.descripcion,
             m.valor_concentracion
      FROM mediciones m
      JOIN contaminantes c ON m.id_contaminante = c.id_contaminante
      WHERE m.id_estacion = $1
      AND m.fecha::date = NOW()::date  -- Solo mediciones del día actual
      ORDER BY m.valor_concentracion DESC  -- Obtener el contaminante con la mayor concentración
      LIMIT 1
    `, [id]);

    if (result.rows.length === 0) {
      return res.json({
        contaminante: 'No data',
        descripcion: 'No hay datos disponibles',
        valor_concentracion: 0
      });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error(`Error en /api/stations/${req.params.id}/pollutant:`, error);
    res.status(500).json({ error: error.message });
  }
});


// Get pollutant trends for a station
app.get('/api/stations/:id/trends', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query(`
      SELECT m.fecha, c.nombre as contaminante,
             m.valor_concentracion
      FROM mediciones m
      JOIN contaminantes c ON m.id_contaminante = c.id_contaminante
      WHERE m.id_estacion = $1
      AND m.fecha >= NOW() - INTERVAL '24 hours'
      AND m.fecha <= NOW()  -- Excluir fechas futuras
      ORDER BY m.fecha ASC
    `, [id]);
    res.json(result.rows);
  } catch (error) {
    console.error(`Error en /api/stations/${req.params.id}/trends:`, error);
    res.status(500).json({ error: error.message });
  }
});

// Get AQI for a station
app.get('/api/stations/:id/aqi', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query(`
      SELECT m.valor_calidad, m.indice_calidad,
             'Basado en las últimas mediciones' as descripcion
      FROM mediciones m
      WHERE m.id_estacion = $1
      ORDER BY m.fecha DESC
      LIMIT 1
    `, [id]);
    
    if (result.rows.length === 0) {
      return res.json({
        valor_calidad: 0,
        indice_calidad: 'Sin datos',
        descripcion: 'No hay datos disponibles'
      });
    }
    res.json(result.rows[0]);
  } catch (error) {
    console.error(`Error en /api/stations/${req.params.id}/aqi:`, error);
    res.status(500).json({ error: error.message });
  }
});

// Get pollutants comparison for a station
// app.get('/api/stations/:id/pollutants/comparison', async (req, res) => {
//   try {
//     const { id } = req.params;
//     const result = await pool.query(`
//       WITH CurrentValues AS (
//         SELECT c.nombre as contaminante,
//                m.valor_concentracion as valor_actual,
//                50 as limite_permitido
//         FROM mediciones m
//         JOIN contaminantes c ON m.id_contaminante = c.id_contaminante
//         WHERE m.id_estacion = $1
//         AND m.fecha >= NOW() - INTERVAL '1 hour'
//         AND m.fecha <= NOW()  -- Excluir fechas futuras
//       )
//       SELECT *
//       FROM CurrentValues
//       ORDER BY valor_actual DESC
//     `, [id]);
//     res.json(result.rows);
//   } catch (error) {
//     console.error(`Error en /api/stations/${req.params.id}/pollutants/comparison:`, error);
//     res.status(500).json({ error: error.message });
//   }
// });
app.get('/api/stations/:id/pollutants/comparison', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query(`
      WITH CurrentValues AS (
        SELECT c.nombre as contaminante,
               m.valor_concentracion as valor_actual,
               50 as limite_permitido
        FROM mediciones m
        JOIN contaminantes c ON m.id_contaminante = c.id_contaminante
        WHERE m.id_estacion = $1
        AND m.fecha <= NOW()
        AND m.fecha::date = NOW()::date
      )
      SELECT *
      FROM CurrentValues
      ORDER BY valor_actual DESC
    `, [id]);
    res.json(result.rows);
  } catch (error) {
    console.error(`Error en /api/stations/${req.params.id}/pollutants/comparison:`, error);
    res.status(500).json({ error: error.message });
  }
});


app.get('/api/stations/:id/history', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query(`
      SELECT m.fecha, c.nombre as contaminante, m.valor_concentracion,
             m.indice_calidad, m.valor_calidad
      FROM mediciones m
      JOIN contaminantes c ON m.id_contaminante = c.id_contaminante
      WHERE m.id_estacion = $1
      AND m.fecha >= CURRENT_DATE
      AND m.fecha < CURRENT_DATE + INTERVAL '1 day'
      ORDER BY m.fecha DESC
    `, [id]);
    
    console.log("Datos del historial diario:", result.rows);  // Agrega este log
    
    res.json(result.rows);
  } catch (error) {
    console.error(`Error en /api/stations/${req.params.id}/history:`, error);
    res.status(500).json({ error: error.message });
  }
});


// Agregar nuevo endpoint para estaciones cercanas
// app.get('/api/stations/:id/nearby', async (req, res) => {
//   try {
//     const { id } = req.params;
//     const result = await pool.query(`
//       WITH StationLocation AS (
//         SELECT latitud, longitud
//         FROM estaciones
//         WHERE id_estacion = $1
//       )
//       SELECT e.*
//       FROM estaciones e, StationLocation s
//       WHERE e.id_estacion != $1
//       AND earth_distance(
//         ll_to_earth(e.latitud, e.longitud),
//         ll_to_earth(s.latitud, s.longitud)
//       ) <= 5000  -- 5km radio
//       ORDER BY earth_distance(
//         ll_to_earth(e.latitud, e.longitud),
//         ll_to_earth(s.latitud, s.longitud)
//       )
//       LIMIT 5;
//     `, [id]);

//     res.json(result.rows);
//   } catch (error) {
//     console.error('Error al obtener estaciones cercanas:', error);
//     res.status(500).json({ error: 'Error al obtener estaciones cercanas' });
//   }
// });
app.get('/api/stations/:id/nearby', async (req, res) => {
  try {
    const { id } = req.params;
    const distance = parseFloat(req.query.distance) || 400; // Distancia predeterminada de 400 km si no se proporciona

    const result = await pool.query(`
      WITH StationLocation AS (
        SELECT latitud, longitud
        FROM estaciones
        WHERE id_estacion = $1
      )
      SELECT e.*
      FROM estaciones e, StationLocation s
      WHERE e.id_estacion != $1
      AND 111.045 * DEGREES(ACOS(COS(RADIANS(e.latitud)) * COS(RADIANS(s.latitud)) *
       COS(RADIANS(e.longitud) - RADIANS(s.longitud)) + SIN(RADIANS(e.latitud)) *
       SIN(RADIANS(s.latitud)))) <= $2
      ORDER BY 111.045 * DEGREES(ACOS(COS(RADIANS(e.latitud)) * COS(RADIANS(s.latitud)) *
       COS(RADIANS(e.longitud) - RADIANS(s.longitud)) + SIN(RADIANS(e.latitud)) *
       SIN(RADIANS(s.latitud))))
      LIMIT 5;
    `, [id, distance]);

    res.json(result.rows);
  } catch (error) {
    console.error('Error al obtener estaciones cercanas:', error); // Log detallado del error
    res.status(500).json({ error: 'Error al obtener estaciones cercanas', detalle: error.message });
  }
});

// Endpoint para crear un usuario
// app.post('/api/users/register', async (req, res) => {
//   try {
//     const { nombre, correo, ubicacion, telefono, direccion, id_region, tipo_usuario, contraseña } = req.body;
//     const hashedPassword = await bcrypt.hash(contraseña, 10); // Hash de contraseña

//     const result = await pool.query(`
//       INSERT INTO usuarios (nombre, correo, ubicacion, telefono, direccion, id_region, tipo_usuario, contraseña)
//       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
//       RETURNING id_usuario
//     `, [nombre, correo, ubicacion, telefono, direccion, id_region, tipo_usuario, hashedPassword]);

//     res.status(201).json({ id_usuario: result.rows[0].id_usuario });
//   } catch (error) {
//     console.error('Error en /api/users/register:', error);
//     res.status(500).json({ error: error.message });
//   }
// });
app.post('/api/users/register', async (req, res) => {
  try {
    console.log('Datos recibidos en el servidor:', req.body); // Verificar datos recibidos
    const { nombre, correo, ubicacion, telefono, direccion, id_region, tipo_usuario, contraseña } = req.body;

    // Verificar si algún campo está vacío
    if (!nombre || !correo || !ubicacion || !telefono || !direccion || !id_region || !tipo_usuario || !contraseña) {
      return res.status(400).json({ error: 'Todos los campos son obligatorios.' });
    }

    const hashedPassword = await bcrypt.hash(contraseña, 10);
    const result = await pool.query(`
      INSERT INTO usuarios (nombre, correo, ubicacion, telefono, direccion, id_region, tipo_usuario, contraseña)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING id_usuario
    `, [nombre, correo, ubicacion, telefono, direccion, id_region, tipo_usuario, hashedPassword]);

    res.status(201).json({ id_usuario: result.rows[0].id_usuario });
  } catch (error) {
    console.error('Error en /api/users/register:', error);
    res.status(500).json({ error: error.message });
  }
});

// Endpoint para login de usuario
app.post('/api/users/login', async (req, res) => {
  try {
    const { correo, contraseña } = req.body;

    const result = await pool.query('SELECT * FROM usuarios WHERE correo = $1', [correo]);

    if (result.rows.length === 0) {
      return res.status(401).json({ error: 'Usuario no encontrado' });
    }

    const user = result.rows[0];
    const isPasswordValid = await bcrypt.compare(contraseña, user.contraseña);

    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Contraseña incorrecta' });
    }

    // Generar token (opcional)
    res.json({ id_usuario: user.id_usuario, tipo_usuario: user.tipo_usuario });
  } catch (error) {
    console.error('Error en /api/users/login:', error);
    res.status(500).json({ error: error.message });
  }
});

// Verficar si usuario esta suscrito
app.get('/api/users/:userId/stations/:stationId', async (req, res) => {
  try {
    const { userId, stationId } = req.params;
    const result = await pool.query(
      'SELECT * FROM usuario_estaciones WHERE id_usuario = $1 AND id_estacion = $2',
      [userId, stationId]
    );

    res.json({ isSubscribed: result.rows.length > 0 });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al verificar suscripción' });
  }
});

// Subscribir un usuario a una estacion 
app.post('/api/users/:userId/stations/:stationId', async (req, res) => {
  try {
    const { userId, stationId } = req.params;
    await pool.query(
      'INSERT INTO usuario_estaciones (id_usuario, id_estacion) VALUES ($1, $2) ON CONFLICT DO NOTHING',
      [userId, stationId]
    );
    res.status(201).json({ message: 'Usuario suscrito a la estación' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al subscribirse a la estación' });
  }
});

// Desuscribir un usuario a una estacion
app.delete('/api/users/:userId/stations/:stationId', async (req, res) => {
  try {
    const { userId, stationId } = req.params;
    await pool.query(
      'DELETE FROM usuario_estaciones WHERE id_usuario = $1 AND id_estacion = $2',
      [userId, stationId]
    );
    res.status(200).json({ message: 'Usuario desuscrito de la estación' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al desuscribirse de la estación' });
  }
});

// Endpoint para obtener información del usuario
app.get('/api/users/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('SELECT * FROM usuarios WHERE id_usuario = $1', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }
    res.json(result.rows[0]);
  } catch (error) {
    console.error(`Error en /api/users/${id}:`, error);
    res.status(500).json({ error: error.message });
  }
});

// Endpoint para obtener las estaciones suscritas por el usuario
app.get('/api/users/:id/stations', async (req, res) => {
  try {
    const { id } = req.params;

    console.log(`ID del usuario recibido: ${id}`);

    const result = await pool.query(`
      SELECT 
        e.id_estacion, 
        e.nombre, 
        r.nombre AS region
      FROM 
        estaciones e
      JOIN 
        usuario_estaciones ue ON e.id_estacion = ue.id_estacion
      JOIN 
        regiones r ON e.id_region = r.id_region
      WHERE 
        ue.id_usuario = $1
    `, [id]);

    res.json(result.rows);
  } catch (error) {
    console.error(`Error en /api/users/${id}/stations:`, error);
    res.status(500).json({ error: error.message });
  }
});



// Endpoint para obtener las últimas 7 alertas de una estación
app.get('/api/stations/:id/alerts/latest', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query(`
      SELECT a.*, m.fecha, m.valor_concentracion as concentracion, c.nombre as contaminante
      FROM alertas a
      JOIN mediciones m ON a.id_medicion = m.id_medicion
      JOIN contaminantes c ON m.id_contaminante = c.id_contaminante
      WHERE m.id_estacion = $1
      AND m.fecha <= NOW()
      AND m.fecha::date = NOW()::date
      ORDER BY m.fecha DESC
      LIMIT 7
    `, [id]);
    res.json(result.rows);
  } catch (error) {
    console.error(`Error en /api/stations/${id}/alerts/latest:`, error);
    res.status(500).json({ error: error.message });
  }
});


const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
  console.log('Database connection details:', {
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT,
    user: process.env.DB_USER
  });
});

app._router.stack.forEach(function(r) {
  if (r.route && r.route.path) {
    console.log(r.route.path);
  }
});
