// ============================================
// database/db.js — Módulo de persistencia con SQLite
// ============================================
// Usa better-sqlite3 (síncrono, rápido, sin dependencias nativas complicadas).
// Guarda cada mensaje entrante y saliente para auditoría y análisis.

const path = require('path');
const fs = require('fs');

let db = null;

/**
 * Inicializa la base de datos SQLite.
 * Crea el directorio y la tabla si no existen.
 */
function initDatabase() {
  const Database = require('better-sqlite3');
  const dbPath = process.env.DB_PATH || './data/conversations.db';
  const dbDir = path.dirname(dbPath);

  // Crear directorio si no existe
  if (!fs.existsSync(dbDir)) {
    fs.mkdirSync(dbDir, { recursive: true });
  }

  db = new Database(dbPath);

  // Activar WAL mode para mejor rendimiento en concurrencia
  db.pragma('journal_mode = WAL');

  // Crear tabla de mensajes
  db.exec(`
    CREATE TABLE IF NOT EXISTS messages (
      id            INTEGER PRIMARY KEY AUTOINCREMENT,
      message_sid   TEXT,
      phone_number  TEXT NOT NULL,
      direction     TEXT NOT NULL CHECK(direction IN ('inbound', 'outbound')),
      body          TEXT NOT NULL,
      created_at    DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Crear índice para búsquedas por número de teléfono
  db.exec(`
    CREATE INDEX IF NOT EXISTS idx_messages_phone
    ON messages(phone_number)
  `);

  // Crear índice para búsquedas por fecha
  db.exec(`
    CREATE INDEX IF NOT EXISTS idx_messages_date
    ON messages(created_at)
  `);

  console.log(`[DB] SQLite inicializada en: ${dbPath}`);
}

/**
 * Guarda un mensaje en la base de datos.
 *
 * @param {Object} params
 * @param {string} params.messageSid  — ID único del mensaje de Twilio
 * @param {string} params.from        — Número de teléfono
 * @param {string} params.direction   — 'inbound' o 'outbound'
 * @param {string} params.body        — Texto del mensaje
 */
function saveMessage({ messageSid, from, direction, body }) {
  if (!db) return; // Si la BD no está inicializada, no hacer nada

  const stmt = db.prepare(`
    INSERT INTO messages (message_sid, phone_number, direction, body)
    VALUES (?, ?, ?, ?)
  `);

  stmt.run(messageSid, from, direction, body);
}

/**
 * Obtiene el historial de conversación de un número de teléfono.
 *
 * @param {string} phoneNumber — Número del usuario
 * @param {number} limit       — Cantidad máxima de mensajes (default: 50)
 * @returns {Array} — Lista de mensajes ordenados por fecha
 */
function getConversationHistory(phoneNumber, limit = 50) {
  if (!db) return [];

  const stmt = db.prepare(`
    SELECT * FROM messages
    WHERE phone_number = ?
    ORDER BY created_at DESC
    LIMIT ?
  `);

  return stmt.all(phoneNumber, limit);
}

/**
 * Obtiene estadísticas generales de mensajes.
 * Útil para dashboards o reportes.
 */
function getStats() {
  if (!db) return null;

  const totalMessages = db.prepare('SELECT COUNT(*) as count FROM messages').get();
  const uniqueUsers = db.prepare('SELECT COUNT(DISTINCT phone_number) as count FROM messages').get();
  const todayMessages = db.prepare(`
    SELECT COUNT(*) as count FROM messages
    WHERE DATE(created_at) = DATE('now')
  `).get();

  return {
    totalMessages: totalMessages.count,
    uniqueUsers: uniqueUsers.count,
    todayMessages: todayMessages.count,
  };
}

module.exports = {
  initDatabase,
  saveMessage,
  getConversationHistory,
  getStats,
};
