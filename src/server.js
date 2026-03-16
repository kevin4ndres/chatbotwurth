// ============================================
// server.js — Punto de entrada del chatbot
// ============================================
// Este archivo configura Express, aplica middlewares de seguridad
// y monta las rutas del webhook de Twilio.

require('dotenv').config();

const express = require('express');
const morgan = require('morgan');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');

const webhookRoutes = require('./routes/webhook');
const { validateTwilioRequest } = require('./middleware/twilioAuth');
const { initDatabase } = require('./database/db');

const app = express();
const PORT = process.env.PORT || 3000;

// ============================================
// 1. Middlewares globales de seguridad
// ============================================

// Helmet: agrega cabeceras HTTP de seguridad (XSS, CSP, etc.)
app.use(helmet());

// Morgan: logging de peticiones HTTP en consola
app.use(morgan('combined'));

// Rate Limiter: protege contra ataques de fuerza bruta / DDoS
// Permite máximo 100 requests por IP cada 15 minutos
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: { error: 'Demasiadas solicitudes, intenta de nuevo más tarde.' },
});
app.use('/webhook', limiter);

// Parsear body como URL-encoded (formato que envía Twilio)
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// ============================================
// 2. Rutas
// ============================================

// Health check — útil para monitoreo y verificar que el servidor está vivo
app.get('/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Webhook de Twilio — aquí llegan los mensajes de WhatsApp
// En producción, activa la validación de firma de Twilio
// descomentando la línea de validateTwilioRequest
app.use(
  '/webhook',
  // validateTwilioRequest,  // ← Descomentar en producción
  webhookRoutes
);

// ============================================
// 3. Manejo de errores global
// ============================================
app.use((err, _req, res, _next) => {
  console.error('[ERROR]', err.message);
  res.status(500).json({ error: 'Error interno del servidor' });
});

// ============================================
// 4. Iniciar servidor
// ============================================
async function start() {
  // Inicializar base de datos SQLite (opcional, para guardar conversaciones)
  try {
    initDatabase();
    console.log('[DB] Base de datos inicializada correctamente.');
  } catch (err) {
    console.warn('[DB] No se pudo inicializar la BD:', err.message);
    console.warn('[DB] El bot funcionará sin persistencia de conversaciones.');
  }

  app.listen(PORT, () => {
    console.log('============================================');
    console.log(`  🤖 Chatbot WhatsApp activo`);
    console.log(`  📡 Puerto: ${PORT}`);
    console.log(`  🔗 Webhook: http://localhost:${PORT}/webhook/whatsapp`);
    console.log(`  ❤️  Health:  http://localhost:${PORT}/health`);
    console.log('============================================');
  });
}

start();
