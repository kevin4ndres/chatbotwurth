// ============================================
// routes/webhook.js — Ruta del webhook de Twilio
// ============================================
// Recibe los mensajes entrantes de WhatsApp vía POST,
// los pasa al motor del chatbot y devuelve la respuesta
// en formato TwiML (Twilio Markup Language).

const express = require('express');
const router = express.Router();
const { MessagingResponse } = require('twilio').twiml;

const { processMessage } = require('../services/chatbot');
const { saveMessage } = require('../database/db');

/**
 * POST /webhook/whatsapp
 *
 * Twilio envía un POST con estos campos relevantes:
 *   - Body:       texto del mensaje del usuario
 *   - From:       número del usuario (ej: whatsapp:+56912345678)
 *   - To:         número de Twilio
 *   - MessageSid: ID único del mensaje
 *   - NumMedia:   cantidad de archivos adjuntos
 */
router.post('/whatsapp', async (req, res) => {
  try {
    // Extraer datos del mensaje entrante
    const incomingMessage = req.body.Body?.trim() || '';
    const from = req.body.From || '';
    const messageSid = req.body.MessageSid || '';

    console.log(`[MENSAJE ENTRANTE] De: ${from} | Texto: "${incomingMessage}"`);

    // Guardar mensaje entrante en la base de datos (si está disponible)
    try {
      saveMessage({
        messageSid,
        from,
        direction: 'inbound',
        body: incomingMessage,
      });
    } catch (_dbErr) {
      // Si la BD no está disponible, continuamos sin persistencia
    }

    // Procesar el mensaje a través del motor del chatbot
    const responseText = await processMessage(incomingMessage, from);

    // Construir respuesta TwiML (formato XML que Twilio espera)
    const twiml = new MessagingResponse();
    twiml.message(responseText);

    // Guardar respuesta del bot en la base de datos
    try {
      saveMessage({
        messageSid: `${messageSid}-reply`,
        from: process.env.TWILIO_WHATSAPP_NUMBER || 'bot',
        direction: 'outbound',
        body: responseText,
      });
    } catch (_dbErr) {
      // Continuamos sin persistencia
    }

    console.log(`[RESPUESTA] Para: ${from} | Texto: "${responseText}"`);

    // Enviar respuesta con Content-Type XML
    res.type('text/xml').send(twiml.toString());
  } catch (error) {
    console.error('[ERROR en webhook]', error);

    // En caso de error, enviar un mensaje genérico al usuario
    const twiml = new MessagingResponse();
    twiml.message('Lo siento, ocurrió un error. Intenta de nuevo más tarde.');
    res.type('text/xml').send(twiml.toString());
  }
});

module.exports = router;
