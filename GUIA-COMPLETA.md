# Chatbot WhatsApp con Twilio — Guía Completa

## 1. Arquitectura del Sistema

```
┌──────────────┐     ┌──────────────────┐     ┌──────────────────────────┐
│  Usuario     │────▶│  Twilio          │────▶│  Tu Servidor (Node.js)   │
│  WhatsApp    │     │  WhatsApp API    │     │                          │
│              │◀────│                  │◀────│  Express + Chatbot       │
└──────────────┘     └──────────────────┘     │  Engine                  │
                                               │                          │
                                               │  ┌────────────────────┐  │
                                               │  │ Motor del Chatbot  │  │
                                               │  │ (Reglas + Estado)  │  │
                                               │  └────────────────────┘  │
                                               │  ┌────────────────────┐  │
                                               │  │ SQLite (opcional)  │  │
                                               │  │ Historial mensajes │  │
                                               │  └────────────────────┘  │
                                               └──────────────────────────┘
```

**Flujo de un mensaje:**

1. El usuario envía un mensaje de WhatsApp
2. Meta lo enruta a Twilio (porque Twilio está registrado como Business API)
3. Twilio hace un POST HTTP a tu webhook con los datos del mensaje
4. Express recibe el POST, extrae el texto y el remitente
5. El motor del chatbot procesa el mensaje según reglas y estado
6. Se construye una respuesta en formato TwiML (XML de Twilio)
7. Twilio recibe el TwiML y envía la respuesta al usuario vía WhatsApp

## 2. Estructura del Proyecto

```
whatsapp-chatbot-twilio/
├── .env.example           # Variables de entorno (plantilla)
├── .gitignore
├── package.json
├── GUIA-COMPLETA.md       # Esta guía
└── src/
    ├── server.js           # Punto de entrada, configura Express
    ├── routes/
    │   └── webhook.js      # Ruta POST que recibe mensajes de Twilio
    ├── middleware/
    │   └── twilioAuth.js   # Valida firma HMAC de Twilio
    ├── services/
    │   └── chatbot.js      # Motor del bot: menú, productos, soporte
    └── database/
        └── db.js           # Persistencia SQLite (opcional)
```

## 3. Instalación Paso a Paso

```bash
# 1. Clonar o copiar el proyecto
cd whatsapp-chatbot-twilio

# 2. Instalar dependencias
npm install

# 3. Configurar variables de entorno
cp .env.example .env
# Editar .env con tus credenciales de Twilio

# 4. Iniciar en modo desarrollo
npm run dev

# 5. O en producción
npm start
```

## 4. Configurar Twilio Sandbox

### Paso 1: Crear cuenta en Twilio
Regístrate en https://www.twilio.com/try-twilio (gratis).

### Paso 2: Activar el Sandbox de WhatsApp
1. Ve a **Twilio Console** → **Messaging** → **Try it out** → **Send a WhatsApp Message**
2. Twilio te dará un número de sandbox (ej: +1 415 523 8886)
3. Envía el código de activación desde tu WhatsApp al número de Twilio
   (ej: "join <palabra-clave>")

### Paso 3: Obtener credenciales
En la consola de Twilio, copia:
- **Account SID**: `ACxxxxxxxxx...`
- **Auth Token**: `xxxxxxxxx...`

Pégalos en tu archivo `.env`.

### Paso 4: Configurar el Webhook
1. En Twilio Console → Messaging → Settings → WhatsApp Sandbox Settings
2. En el campo **"When a message comes in"**, pega tu URL:
   ```
   https://tu-url-ngrok.ngrok-free.app/webhook/whatsapp
   ```
3. Método: **POST**
4. Guarda los cambios

## 5. Exponer el Servidor con ngrok

ngrok crea un túnel público hacia tu servidor local, necesario porque
Twilio necesita una URL pública para enviar los webhooks.

```bash
# 1. Instalar ngrok (si no lo tienes)
# Opción A: npm
npm install -g ngrok

# Opción B: descarga directa desde https://ngrok.com/download

# 2. Iniciar tu servidor Node.js
npm run dev

# 3. En OTRA terminal, iniciar ngrok
ngrok http 3000
```

ngrok te mostrará algo como:

```
Forwarding  https://abc123.ngrok-free.app -> http://localhost:3000
```

Copia esa URL `https://abc123.ngrok-free.app` y úsala en el paso 4
de la configuración de Twilio, agregando `/webhook/whatsapp` al final.

**Nota:** La URL de ngrok cambia cada vez que lo reinicias (en plan gratuito).
Tendrás que actualizar la URL en Twilio cada vez.

## 6. Probar el Bot

1. Asegúrate de tener el servidor corriendo (`npm run dev`)
2. Asegúrate de tener ngrok corriendo y la URL configurada en Twilio
3. Desde tu WhatsApp, envía **"hola"** al número de Twilio
4. Deberías recibir el menú principal
5. Prueba las opciones: 1, 2, 3 y 0

### Prueba local con curl (sin Twilio)

```bash
curl -X POST http://localhost:3000/webhook/whatsapp \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "Body=hola&From=whatsapp:+56912345678&MessageSid=test123"
```

Deberías recibir una respuesta XML con el menú.

## 7. Integración con IA (Extra)

Para agregar respuestas inteligentes con un LLM, crea un servicio adicional:

```javascript
// src/services/ai.js
const Anthropic = require('@anthropic-ai/sdk');

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

async function getAIResponse(userMessage, conversationHistory) {
  const response = await client.messages.create({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 300,
    system: 'Eres un asistente de atención al cliente amable y conciso.',
    messages: [
      ...conversationHistory,
      { role: 'user', content: userMessage },
    ],
  });

  return response.content[0].text;
}

module.exports = { getAIResponse };
```

Luego, en el chatbot, puedes usarlo como fallback cuando no se reconoce el mensaje.

## 8. Buenas Prácticas de Seguridad

1. **Validar firma de Twilio**: El middleware `twilioAuth.js` verifica que cada
   request viene realmente de Twilio usando HMAC-SHA1.
   Descoméntalo en `server.js` para producción.

2. **Rate Limiting**: El servidor limita a 100 requests por IP cada 15 minutos
   para prevenir abuso.

3. **Helmet**: Agrega cabeceras HTTP de seguridad automáticamente.

4. **Variables de entorno**: Nunca commitees `.env` al repositorio.
   Solo `.env.example` como referencia.

5. **HTTPS obligatorio**: En producción, usa siempre HTTPS.
   ngrok lo provee automáticamente durante desarrollo.

6. **Sanitización de inputs**: Siempre normaliza y valida los mensajes
   entrantes antes de procesarlos.

## 9. Pasar a Producción

Para un despliegue real:

1. **Registrar número de WhatsApp en Twilio**: Migrar del Sandbox a un
   número verificado por Meta Business.

2. **Desplegar en un servidor**: Railway, Render, AWS, DigitalOcean, etc.

3. **Usar una BD robusta**: Migrar de SQLite a PostgreSQL si el volumen
   de mensajes es alto.

4. **Activar la validación de firma Twilio**: Descomentar `validateTwilioRequest`
   en `server.js`.

5. **Configurar monitoreo**: Integrar con herramientas como Sentry para
   capturar errores en producción.
