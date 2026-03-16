// ============================================
// middleware/twilioAuth.js — Validación de firma Twilio
// ============================================
// Verifica que las peticiones al webhook realmente provienen
// de Twilio y no de un tercero malicioso.
//
// Twilio firma cada request con un hash HMAC-SHA1 usando
// tu Auth Token. Este middleware valida esa firma.

const twilio = require('twilio');

/**
 * Middleware que valida la firma X-Twilio-Signature.
 *
 * IMPORTANTE: Para que funcione correctamente necesitas:
 * 1. Tener TWILIO_AUTH_TOKEN en tu .env
 * 2. Pasar la URL pública completa del webhook (con https)
 *
 * En desarrollo con ngrok, la URL cambia cada vez que
 * reinicias, así que puedes desactivar esta validación
 * durante el desarrollo.
 */
function validateTwilioRequest(req, res, next) {
  const authToken = process.env.TWILIO_AUTH_TOKEN;

  if (!authToken) {
    console.warn('[AUTH] TWILIO_AUTH_TOKEN no configurado. Saltando validación.');
    return next();
  }

  // Construir la URL completa del webhook
  // En producción, usa tu dominio real. Con ngrok, usa la URL de ngrok.
  const webhookUrl =
    process.env.WEBHOOK_URL ||
    `${req.protocol}://${req.get('host')}${req.originalUrl}`;

  // Twilio envía la firma en este header
  const twilioSignature = req.headers['x-twilio-signature'] || '';

  // Validar la firma usando el SDK de Twilio
  const isValid = twilio.validateRequest(
    authToken,
    twilioSignature,
    webhookUrl,
    req.body
  );

  if (isValid) {
    return next();
  }

  console.warn(`[AUTH] Firma Twilio inválida desde IP: ${req.ip}`);
  return res.status(403).json({ error: 'Firma de Twilio inválida' });
}

module.exports = { validateTwilioRequest };
