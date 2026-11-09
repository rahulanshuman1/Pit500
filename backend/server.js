require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const rateLimit = require('express-rate-limit');

const Content = require('./models/Content');
const Admin = require('./models/Admin');
const auth = require('./middleware/auth');
const defaultContent = require('./config/defaultContent');

const { MONGODB_URI, JWT_SECRET } = process.env;
const PORT = process.env.PORT || 5000;
const TOKEN_TTL_SECONDS = 60 * 60 * 24; // 24 hours

if (!MONGODB_URI || !JWT_SECRET) {
  console.error('Missing MONGODB_URI or JWT_SECRET. Copy .env.example to .env and fill both in.');
  process.exit(1);
}

/* ---------- CORS ---------- */
const PRODUCTION_FRONTEND = 'https://pit500.vercel.app'; // change to your live Vercel URL
const allowedOrigins = new Set(
  [
    'http://localhost:5173',
    'http://127.0.0.1:5173',
    'http://localhost:3000',
    PRODUCTION_FRONTEND,
    ...(process.env.FRONTEND_URLS || '').split(','),
  ]
    .map((o) => o.trim().replace(/\/$/, ''))
    .filter(Boolean)
);

const app = express();
app.set('trust proxy', 1); // Render sits behind a proxy; needed for correct client IPs

app.use(helmet());
app.use(
  cors({
    origin(origin, callback) {
      // No Origin header = server-to-server call or curl; allow. Browsers always send one.
      if (!origin || allowedOrigins.has(origin)) return callback(null, true);
      return callback(new Error('Origin not allowed by CORS'));
    },
    methods: ['GET', 'POST', 'PUT', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    maxAge: 86400,
  })
);
app.use(express.json({ limit: '100kb' }));

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: 'Too many sign-in attempts. Try again in 15 minutes.' },
});

/* ---------- Helpers ---------- */
const isString = (v) => typeof v === 'string';

function slugify(text) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 60);
}

// Returns { error } or { data } with a clean, whitelisted payload.
function validateContent(body) {
  if (!body || typeof body !== 'object') return { error: 'Request body must be a JSON object.' };

  const textFields = {
    heroHeadline: { max: 160, required: true },
    heroSubheadline: { max: 400 },
    storeAddress: { max: 300 },
    storeTimings: { max: 200 },
    whatsappNumber: { max: 20 },
  };

  const data = {};
  for (const [field, rule] of Object.entries(textFields)) {
    const value = body[field];
    if (value === undefined) {
      if (rule.required) return { error: `${field} is required.` };
      continue;
    }
    if (!isString(value)) return { error: `${field} must be text.` };
    const trimmed = value.trim();
    if (rule.required && !trimmed) return { error: `${field} cannot be empty.` };
    if (trimmed.length > rule.max) return { error: `${field} must be ${rule.max} characters or fewer.` };
    data[field] = trimmed;
  }

  if (data.whatsappNumber !== undefined) {
    const digits = data.whatsappNumber.replace(/\D/g, '');
    if (digits && (digits.length < 10 || digits.length > 15)) {
      return { error: 'whatsappNumber must have 10 to 15 digits including country code.' };
    }
    data.whatsappNumber = digits;
  }

  if (body.categories !== undefined) {
    if (!Array.isArray(body.categories) || body.categories.length === 0 || body.categories.length > 12) {
      return { error: 'categories must be a list of 1 to 12 items.' };
    }
    const seen = new Set();
    data.categories = [];
    for (const [i, c] of body.categories.entries()) {
      if (!c || typeof c !== 'object') return { error: `Category ${i + 1} is invalid.` };
      const title = isString(c.title) ? c.title.trim() : '';
      const description = isString(c.description) ? c.description.trim() : '';
      const image = isString(c.imagePlaceholderUrl) ? c.imagePlaceholderUrl.trim() : '';
      if (!title) return { error: `Category ${i + 1} needs a title.` };
      if (title.length > 80) return { error: `Category ${i + 1} title must be 80 characters or fewer.` };
      if (description.length > 400) return { error: `Category ${i + 1} description must be 400 characters or fewer.` };
      if (image && !/^(https?:\/\/|\/)/i.test(image)) {
        return { error: `Category ${i + 1} image must start with http://, https:// or /.` };
      }
      let id = isString(c.id) && c.id.trim() ? slugify(c.id) : slugify(title);
      if (!id || seen.has(id)) id = `${id || 'category'}-${i + 1}`;
      seen.add(id);
      data.categories.push({ id, title, description, imagePlaceholderUrl: image });
    }
  }

  return { data };
}

function serializeContent(doc) {
  if (!doc) return defaultContent;
  return {
    heroHeadline: doc.heroHeadline || defaultContent.heroHeadline,
    heroSubheadline: doc.heroSubheadline ?? defaultContent.heroSubheadline,
    storeAddress: doc.storeAddress ?? defaultContent.storeAddress,
    storeTimings: doc.storeTimings ?? defaultContent.storeTimings,
    whatsappNumber: doc.whatsappNumber || defaultContent.whatsappNumber,
    categories: doc.categories && doc.categories.length ? doc.categories : defaultContent.categories,
  };
}

/* ---------- Routes ---------- */
app.get('/health', (_req, res) => res.json({ status: 'ok' }));

// Public: live storefront copy (falls back to baseline copy when the DB is empty)
app.get('/api/content', async (_req, res) => {
  try {
    const doc = await Content.findOne({ key: 'site' }).lean();
    res.set('Cache-Control', 'public, max-age=30, stale-while-revalidate=120');
    return res.json(serializeContent(doc));
  } catch (err) {
    console.error('GET /api/content failed:', err);
    // Never break the storefront: serve baseline copy if the DB is unreachable.
    return res.json(defaultContent);
  }
});

// Public: admin sign-in
const DUMMY_HASH = bcrypt.hashSync('pit500-timing-equaliser', 12);

app.post('/api/auth/login', loginLimiter, async (req, res) => {
  try {
    const { username, password } = req.body || {};
    if (!isString(username) || !isString(password) || !username.trim() || !password) {
      return res.status(400).json({ message: 'Username and password are required.' });
    }

    const admin = await Admin.findOne({ username: username.trim().toLowerCase() });
    // Compare against a dummy hash when the user is missing so timing does not reveal valid usernames.
    const valid = await bcrypt.compare(password, admin ? admin.password : DUMMY_HASH);
    if (!admin || !valid) {
      return res.status(401).json({ message: 'Incorrect username or password.' });
    }

    const token = jwt.sign({ sub: admin._id.toString(), username: admin.username }, JWT_SECRET, {
      algorithm: 'HS256',
      expiresIn: TOKEN_TTL_SECONDS,
    });
    return res.json({ token, expiresIn: TOKEN_TTL_SECONDS, username: admin.username });
  } catch (err) {
    console.error('POST /api/auth/login failed:', err);
    return res.status(500).json({ message: 'Sign-in failed. Try again.' });
  }
});

// Protected: update storefront copy
app.put('/api/content', auth, async (req, res) => {
  const { error, data } = validateContent(req.body);
  if (error) return res.status(400).json({ message: error });

  try {
    const doc = await Content.findOneAndUpdate(
      { key: 'site' },
      { $set: data, $setOnInsert: { key: 'site' } },
      { upsert: true, new: true, runValidators: true, setDefaultsOnInsert: true }
    ).lean();
    return res.json({ message: 'Content published.', content: serializeContent(doc) });
  } catch (err) {
    // Two simultaneous first-ever saves can race on the unique key; one retry resolves it.
    if (err.code === 11000) {
      const doc = await Content.findOneAndUpdate({ key: 'site' }, { $set: data }, { new: true }).lean();
      return res.json({ message: 'Content published.', content: serializeContent(doc) });
    }
    console.error('PUT /api/content failed:', err);
    return res.status(500).json({ message: 'Could not save content. Try again.' });
  }
});

// Protected: change the admin password (the seeded default should be replaced right away)
app.put('/api/auth/password', auth, loginLimiter, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body || {};
    if (!isString(currentPassword) || !isString(newPassword)) {
      return res.status(400).json({ message: 'Current and new password are required.' });
    }
    if (newPassword.length < 10 || newPassword.length > 128) {
      return res.status(400).json({ message: 'New password must be 10 to 128 characters.' });
    }
    const admin = await Admin.findById(req.admin.sub);
    if (!admin || !(await admin.verifyPassword(currentPassword))) {
      return res.status(401).json({ message: 'Current password is incorrect.' });
    }
    admin.password = await Admin.hashPassword(newPassword);
    await admin.save();
    return res.json({ message: 'Password updated.' });
  } catch (err) {
    console.error('PUT /api/auth/password failed:', err);
    return res.status(500).json({ message: 'Could not update password. Try again.' });
  }
});

app.use((_req, res) => res.status(404).json({ message: 'Route not found.' }));

// eslint-disable-next-line no-unused-vars
app.use((err, _req, res, _next) => {
  if (err.message === 'Origin not allowed by CORS') {
    return res.status(403).json({ message: err.message });
  }
  console.error('Unhandled error:', err);
  return res.status(500).json({ message: 'Unexpected server error.' });
});

/* ---------- Boot ---------- */
async function seedAdmin() {
  if ((await Admin.countDocuments()) > 0) return;
  const defaultPassword = process.env.ADMIN_DEFAULT_PASSWORD || 'Pit500@Admin2026';
  await Admin.create({
    username: 'admin_pit500',
    password: await Admin.hashPassword(defaultPassword),
  });
  console.log('Seeded default admin "admin_pit500". Sign in and change the password immediately.');
}

async function start() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('MongoDB connected');
    await Content.init(); // make sure the unique index exists before serving writes
    await seedAdmin();
    app.listen(PORT, () => console.log(`Pit500 API listening on port ${PORT}`));
  } catch (err) {
    console.error('Startup failed:', err);
    process.exit(1);
  }
}

start();
