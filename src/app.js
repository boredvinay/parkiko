import express from "express";
import { createClient } from '@supabase/supabase-js';
import cors from 'cors';
import 'dotenv/config'; 
import fs   from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';


const app = express();
app.use(express.json());

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY; 

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

const __filename = fileURLToPath(import.meta.url);
const __dirname  = path.dirname(__filename);

const sslOptions = {
  key: process.env.SSL_KEY_FILE
    ? fs.readFileSync(process.env.SSL_KEY_FILE)
    : undefined,
  cert: process.env.SSL_CRT_FILE
    ? fs.readFileSync(process.env.SSL_CRT_FILE)
    : undefined,
};

// Create a reservation
app.post('/api/reservations', async (req, res) => {
  const { plate_number, space_number, reserved_from, reserved_to } = req.body;

  let { error } = await supabase
    .from('vehicle')
    .upsert({ plate_number });
  if (error) return res.status(400).json({ error: error.message });

  let { data: space, error: spErr } = await supabase
    .from('parking_space')
    .select('id, is_reserved')
    .eq('space_number', space_number)
    .single();
  if (spErr) return res.status(404).json({ error: spErr.message });
  if (space.is_reserved)
    return res.status(400).json({ error: 'Space already reserved' });

  ({ error } = await supabase
    .from('reservation')
    .insert({
      space_id:      space.id,
      vehicle_plate: plate_number,
      reserved_from,
      reserved_to,
    }));
  if (error) return res.status(400).json({ error: error.message });

  ({ error } = await supabase
    .from('parking_space')
    .update({
      is_reserved:           true,
      current_vehicle_plate: plate_number,
    })
    .eq('id', space.id));
  if (error) return res.status(400).json({ error: error.message });

  res.status(201).json({ message: 'Reservation created' });
});

// Reset all spaces at end of day
app.post('/api/spaces/reset', async (_req, res) => {
  
  let { error } = await supabase.from('reservation').delete();
  if (error) return res.status(500).json({ error: error.message });

  ({ error } = await supabase
    .from('parking_space')
    .update({ is_reserved: false, current_vehicle_plate: null }));
  if (error) return res.status(500).json({ error: error.message });

  ({ error } = await supabase
    .from('parking_session')
    .update({ end_time: new Date().toISOString() })
    .is('end_time', null));
  if (error) return res.status(500).json({ error: error.message });

  res.json({ message: 'All spaces reset' });
});

// List reserved spaces
app.get('/api/spaces/reserved', async (_req, res) => {
  const { data, error } = await supabase
    .from('parking_space')
    .select('space_number, current_vehicle_plate')
    .eq('is_reserved', true);
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

// List available (non-reserved) spaces
app.get('/api/spaces/available', async (_req, res) => {
  const { data, error } = await supabase
    .from('parking_space')
    .select('space_number')
    .eq('is_reserved', false);
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

// List occupied spaces
app.get('/api/spaces/occupied', async (_req, res) => {
  const { data, error } = await supabase
    .from('parking_space')
    .select('space_number, current_vehicle_plate')
    .not('current_vehicle_plate', 'is', null);
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

app.use("/static", express.static(path.join(__dirname, "static")));
app.use(cors({ origin: '*' }));
// serve React bundles
app.use(express.static(path.join(__dirname, "../appPackage/build")));
app.get('*', (req, res, next) => {
  if (req.path.startsWith('/api/')) return next();
  res.sendFile(path.join(buildPath, 'index.html'));
});

const port = process.env.port || process.env.PORT || 3978;
app.listen(port, () => console.log(`Server listening on ${port}`));
