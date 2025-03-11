// server.js
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const multer = require('multer');
const fetch = require('node-fetch');

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public')); // Serve static files from 'public' directory

// CREATE - POST endpoint for new coffee drink
app.post('/api/new_coffee_drink', async (req, res) => {
  try {
    const response = await fetch(`${SUPABASE_URL}/functions/v1/coffee_drinks`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`
      },
      body: JSON.stringify(req.body)
    });

    if (!response.ok) {
      throw new Error(`Supabase returned ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error('POST request error:', error);
    res.status(500).json({ error: error.message });
  }
});

// READ - GET endpoint for coffee drinks
app.get('/api/coffee_drinks', async (req, res) => {
  try {
    const response = await fetch(`${SUPABASE_URL}/functions/v1/coffee_drinks`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`
      }
    });

    if (!response.ok) {
      throw new Error(`Supabase returned ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error('GET request error:', error);
    res.status(500).json({ error: error.message });
  }
});

// UPDATE - PUT endpoint for updating coffee drink
app.put('/api/coffee_drinks/:id', async (req, res) => {
  try {
    const response = await fetch(`${SUPABASE_URL}/functions/v1/coffee_drinks/${req.params.id}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(req.body)
    });

    if (!response.ok) {
      throw new Error(`Supabase returned ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error('PUT request error:', error);
    res.status(500).json({ error: error.message });
  }
});

// DELETE - DELETE endpoint for coffee drink
app.delete('/api/coffee_drinks/:id', async (req, res) => {
  try {
    const response = await fetch(`${SUPABASE_URL}/functions/v1/coffee_drinks/${req.params.id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
        'apikey': `${SUPABASE_ANON_KEY}`,
        'Content-Type': 'application/json'
      }
    });

    const data = await response.json();
    console.log('Response data:', data);

    if (!response.ok) {
      throw new Error(`Supabase returned ${response.status}: ${data.error || response.statusText}`);
    }

    res.json({ success: true, message: "Coffee drink deleted successfully" });
  } catch (error) {
    console.error('DELETE request error:', error);
    res.status(500).json({ error: error.message });
  }
});

// READ - GET a specific coffee drink by ID
app.get('/api/coffee_drinks/:id', async (req, res) => {
  try {
    const { id } = req.params;

    // Fetch the specific coffee drink by ID from Supabase
    const response = await fetch(`${SUPABASE_URL}/rest/v1/coffee_drinks?id=eq.${id}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
        'apikey': `${SUPABASE_ANON_KEY}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error(`Supabase returned ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();

    if (data.length === 0) {
      return res.status(404).json({ error: "Drink not found" });
    }

    res.json(data[0]); // Return the first matching drink
  } catch (error) {
    console.error('GET request error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Setup multer for file uploads
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Photo endpoints

// GET all photos from Supabase storage
app.get('/api/photos', async (req, res) => {
  try {
    const response = await fetch(`${SUPABASE_URL}/functions/v1/photos`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`
      }
    });

    if (!response.ok) {
      throw new Error(`Supabase returned ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error('GET photos error:', error);
    res.status(500).json({ error: error.message });
  }
});

//POST a new photo to Supabase storage
app.post('/api/upload_photo', upload.single('photo'), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }

  if (!req.file.originalname.toLowerCase().endsWith('.png') || req.file.mimetype !== 'image/png') {
    return res.status(400).json({ error: 'Only PNG files are allowed' });
  }

  const fileName = `${Date.now()}-${req.file.originalname}`;
  const fileData = req.file.buffer.toString('base64');

  try {
    const response = await fetch(`${SUPABASE_URL}/functions/v1/photos`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ fileName, fileData })
    });

    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ error: error.message });
  }
});

//DELETE a specific photo from Supabase storage
app.delete('/api/photos/:fileName', async (req, res) => {
  try {
    const response = await fetch(`${SUPABASE_URL}/functions/v1/photos/${req.params.fileName}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`
      }
    });

    if (!response.ok) {
      throw new Error(`Delete failed: ${response.status}`);
    }

    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error('Delete error:', error);
    res.status(500).json({ error: error.message });
  }
});

// endpoint to provide the Supabase URL to the frontend
app.get('/api/supabase_url', (req, res) => {
  res.json({ url: SUPABASE_URL });
});

// Start server
app.listen(PORT, () => {
  console.log(`Proxy server running on http://localhost:${PORT}`);
});