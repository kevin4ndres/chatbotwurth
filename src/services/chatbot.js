// ============================================
// services/chatbot.js — Chatbot de Informatica
// ============================================
// Motor de respuestas sobre temas de informatica:
// hardware, software, redes, programacion y seguridad.

const conversationState = new Map();

// ============================================
// Base de conocimiento de informatica
// ============================================

const KNOWLEDGE = {
  hardware: {
    title: 'Hardware',
    icon: '🖥️',
    topics: {
      1: {
        name: 'Componentes de un PC',
        answer: [
          '🖥️ *Componentes principales de un PC:*',
          '',
          '• *CPU (Procesador):* El cerebro del computador. Ejecuta instrucciones y calculos. Ej: Intel Core i7, AMD Ryzen 5.',
          '• *RAM (Memoria):* Almacena datos temporalmente mientras se usan. Mas RAM = mas programas abiertos. Ej: 8GB, 16GB.',
          '• *Disco duro/SSD:* Almacena datos permanentemente. SSD es mucho mas rapido que HDD.',
          '• *Placa madre:* Conecta todos los componentes entre si.',
          '• *GPU (Tarjeta grafica):* Procesa imagenes y video. Clave para gaming y diseno.',
          '• *Fuente de poder (PSU):* Suministra energia a todos los componentes.',
          '• *Gabinete:* Carcasa que protege y organiza los componentes.',
        ].join('\n'),
      },
      2: {
        name: 'Diferencia HDD vs SSD',
        answer: [
          '💾 *HDD vs SSD:*',
          '',
          '*HDD (Hard Disk Drive):*',
          '• Usa discos magneticos giratorios',
          '• Mas lento (80-160 MB/s lectura)',
          '• Mas barato por GB',
          '• Mayor capacidad disponible (hasta 20TB)',
          '• Mas fragil ante golpes',
          '',
          '*SSD (Solid State Drive):*',
          '• Usa memoria flash (sin partes moviles)',
          '• Mucho mas rapido (500-7000 MB/s)',
          '• Mas caro por GB',
          '• Mayor durabilidad',
          '• Arranque del sistema en segundos',
          '',
          '💡 *Recomendacion:* SSD para sistema operativo y programas, HDD para almacenamiento masivo.',
        ].join('\n'),
      },
      3: {
        name: 'Como elegir un procesador',
        answer: [
          '⚡ *Guia para elegir procesador:*',
          '',
          '*Para uso basico* (oficina, navegacion):',
          '• Intel Core i3 / AMD Ryzen 3',
          '• 4 nucleos son suficientes',
          '',
          '*Para uso intermedio* (multitarea, edicion ligera):',
          '• Intel Core i5 / AMD Ryzen 5',
          '• 6 nucleos recomendados',
          '',
          '*Para uso intensivo* (gaming, edicion de video):',
          '• Intel Core i7-i9 / AMD Ryzen 7-9',
          '• 8+ nucleos con alta frecuencia',
          '',
          '📌 Fijate en: nucleos, hilos, frecuencia (GHz) y generacion.',
        ].join('\n'),
      },
      4: {
        name: 'Cuanta RAM necesito',
        answer: [
          '🧠 *Guia de RAM segun uso:*',
          '',
          '• *4 GB:* Minimo absoluto. Solo navegacion basica.',
          '• *8 GB:* Suficiente para oficina, navegacion y multitarea ligera.',
          '• *16 GB:* Ideal para gaming, programacion y edicion.',
          '• *32 GB:* Para edicion profesional de video/3D y maquinas virtuales.',
          '• *64 GB+:* Servidores, ciencia de datos, produccion audiovisual.',
          '',
          '💡 Asegurate de que la velocidad (MHz) sea compatible con tu placa madre.',
        ].join('\n'),
      },
    },
  },

  software: {
    title: 'Software',
    icon: '💻',
    topics: {
      1: {
        name: 'Tipos de software',
        answer: [
          '💻 *Tipos de software:*',
          '',
          '*1. Software de sistema:*',
          '• Sistemas operativos (Windows, Linux, macOS)',
          '• Drivers y controladores',
          '• Utilidades del sistema',
          '',
          '*2. Software de aplicacion:*',
          '• Navegadores (Chrome, Firefox)',
          '• Ofimática (Word, Excel, LibreOffice)',
          '• Diseño (Photoshop, GIMP)',
          '',
          '*3. Software de desarrollo:*',
          '• IDEs (VS Code, IntelliJ)',
          '• Compiladores e interpretes',
          '• Frameworks y librerias',
          '',
          '*4. Software libre vs propietario:*',
          '• Libre: codigo abierto, se puede modificar (Linux, Firefox)',
          '• Propietario: licencia cerrada (Windows, Photoshop)',
        ].join('\n'),
      },
      2: {
        name: 'Sistemas operativos',
        answer: [
          '🖥️ *Sistemas Operativos populares:*',
          '',
          '*Windows:*',
          '• El mas usado en PCs (~74% del mercado)',
          '• Compatible con la mayoria del software',
          '• Versiones: Windows 10, 11',
          '',
          '*Linux:*',
          '• Gratuito y de codigo abierto',
          '• Ideal para servidores y programacion',
          '• Distribuciones: Ubuntu, Fedora, Debian',
          '',
          '*macOS:*',
          '• Exclusivo de computadores Apple',
          '• Muy estable y optimizado para hardware Apple',
          '• Popular en diseno y desarrollo',
          '',
          '*Android / iOS:*',
          '• Sistemas operativos moviles dominantes',
        ].join('\n'),
      },
      3: {
        name: 'Que es la nube (Cloud)',
        answer: [
          '☁️ *Computacion en la nube:*',
          '',
          'Es el uso de servidores remotos para almacenar, procesar y gestionar datos en lugar de hacerlo en tu PC local.',
          '',
          '*Tipos de servicios cloud:*',
          '• *IaaS:* Infraestructura como servicio (AWS EC2, Azure VM)',
          '• *PaaS:* Plataforma como servicio (Heroku, Google App Engine)',
          '• *SaaS:* Software como servicio (Gmail, Dropbox, Office 365)',
          '',
          '*Ventajas:*',
          '• Acceso desde cualquier lugar',
          '• Escalable segun necesidad',
          '• Sin mantenimiento de hardware',
          '',
          '*Proveedores principales:* AWS, Azure, Google Cloud.',
        ].join('\n'),
      },
      4: {
        name: 'Que es una maquina virtual',
        answer: [
          '🖥️ *Maquinas virtuales (VM):*',
          '',
          'Una VM es un computador simulado dentro de tu computador real. Funciona como si fuera una maquina fisica independiente.',
          '',
          '*Para que sirven:*',
          '• Probar otros sistemas operativos sin instalarlos',
          '• Crear entornos de desarrollo aislados',
          '• Ejecutar software antiguo o incompatible',
          '• Laboratorios de ciberseguridad',
          '',
          '*Software para crear VMs:*',
          '• VirtualBox (gratuito)',
          '• VMware Workstation',
          '• Hyper-V (incluido en Windows Pro)',
          '',
          '💡 Necesitas suficiente RAM y CPU para compartir con la VM.',
        ].join('\n'),
      },
    },
  },

  redes: {
    title: 'Redes e Internet',
    icon: '🌐',
    topics: {
      1: {
        name: 'Conceptos basicos de redes',
        answer: [
          '🌐 *Conceptos basicos de redes:*',
          '',
          '• *IP:* Direccion unica que identifica un dispositivo en la red. Ej: 192.168.1.1',
          '• *DNS:* Traduce nombres de dominio (google.com) a direcciones IP.',
          '• *Router:* Dispositivo que conecta tu red local a Internet.',
          '• *Switch:* Conecta varios dispositivos en una red local.',
          '• *LAN:* Red de area local (tu casa/oficina).',
          '• *WAN:* Red de area amplia (Internet).',
          '• *DHCP:* Asigna IPs automaticamente a los dispositivos.',
          '• *Puerto:* Numero que identifica un servicio (80=HTTP, 443=HTTPS).',
        ].join('\n'),
      },
      2: {
        name: 'Modelo OSI y TCP/IP',
        answer: [
          '📡 *Modelo OSI (7 capas):*',
          '',
          '7. *Aplicacion:* HTTP, SMTP, FTP',
          '6. *Presentacion:* Cifrado, compresion',
          '5. *Sesion:* Control de conexiones',
          '4. *Transporte:* TCP (confiable) / UDP (rapido)',
          '3. *Red:* IP, enrutamiento',
          '2. *Enlace de datos:* MAC, Ethernet, Wi-Fi',
          '1. *Fisica:* Cables, señales electricas',
          '',
          '*Modelo TCP/IP (4 capas):*',
          '4. Aplicacion (capas 5-7 del OSI)',
          '3. Transporte (TCP/UDP)',
          '2. Internet (IP)',
          '1. Acceso a red (capas 1-2 del OSI)',
          '',
          '💡 TCP/IP es el modelo que usa Internet realmente.',
        ].join('\n'),
      },
      3: {
        name: 'WiFi: como mejorar la conexion',
        answer: [
          '📶 *Tips para mejorar tu WiFi:*',
          '',
          '• *Ubicacion del router:* Ponlo en un lugar central y elevado.',
          '• *Canal WiFi:* Cambia a un canal menos congestionado (usa apps como WiFi Analyzer).',
          '• *Banda 5 GHz:* Usa esta banda para mayor velocidad (menor alcance).',
          '• *Banda 2.4 GHz:* Mejor alcance pero mas interferencia.',
          '• *Actualiza firmware:* Manten tu router actualizado.',
          '• *Extensores/Mesh:* Si tu casa es grande, usa un sistema mesh.',
          '• *Contraseña segura:* Evita que vecinos usen tu red.',
          '• *Dispositivos conectados:* Desconecta los que no uses.',
        ].join('\n'),
      },
      4: {
        name: 'Que es una VPN',
        answer: [
          '🔒 *VPN (Red Privada Virtual):*',
          '',
          'Una VPN crea un tunel cifrado entre tu dispositivo y un servidor remoto, ocultando tu trafico de Internet.',
          '',
          '*Para que sirve:*',
          '• Proteger tu privacidad en WiFi publico',
          '• Acceder a contenido con restriccion geografica',
          '• Ocultar tu IP real',
          '• Conexion segura a redes empresariales',
          '',
          '*Protocolos comunes:*',
          '• OpenVPN (seguro y popular)',
          '• WireGuard (rapido y moderno)',
          '• IPSec/IKEv2 (bueno para moviles)',
          '',
          '⚠️ Una VPN no te hace 100% anonimo ni protege contra malware.',
        ].join('\n'),
      },
    },
  },

  programacion: {
    title: 'Programacion',
    icon: '👨‍💻',
    topics: {
      1: {
        name: 'Lenguajes de programacion',
        answer: [
          '👨‍💻 *Lenguajes populares y sus usos:*',
          '',
          '• *Python:* Ciencia de datos, IA, automatizacion, backend. Facil de aprender.',
          '• *JavaScript:* Web (frontend y backend con Node.js). El mas usado en la web.',
          '• *Java:* Apps empresariales, Android. Muy robusto.',
          '• *C/C++:* Sistemas operativos, videojuegos, software de alto rendimiento.',
          '• *C#:* Videojuegos (Unity), apps Windows, backend (.NET).',
          '• *Go:* Servidores, microservicios. Rapido y simple.',
          '• *Rust:* Seguridad de memoria, sistemas de alto rendimiento.',
          '• *PHP:* Backend web, WordPress.',
          '• *SQL:* Consultas a bases de datos.',
          '',
          '💡 *Recomendacion para empezar:* Python o JavaScript.',
        ].join('\n'),
      },
      2: {
        name: 'Frontend vs Backend',
        answer: [
          '🌐 *Frontend vs Backend:*',
          '',
          '*Frontend (lado del cliente):*',
          '• Lo que el usuario ve e interactua',
          '• Tecnologias: HTML, CSS, JavaScript',
          '• Frameworks: React, Vue, Angular',
          '• Se ejecuta en el navegador del usuario',
          '',
          '*Backend (lado del servidor):*',
          '• Logica del negocio, bases de datos, APIs',
          '• Tecnologias: Node.js, Python, Java, Go',
          '• Frameworks: Express, Django, Spring',
          '• Se ejecuta en el servidor',
          '',
          '*Fullstack:*',
          '• Desarrollador que maneja ambas partes',
          '',
          '💡 El frontend envia peticiones al backend, que responde con datos.',
        ].join('\n'),
      },
      3: {
        name: 'Que es Git y GitHub',
        answer: [
          '📁 *Git y GitHub:*',
          '',
          '*Git:* Sistema de control de versiones. Registra los cambios en tu codigo, permitiendo:',
          '• Volver a versiones anteriores',
          '• Trabajar en equipo sin pisar el codigo del otro',
          '• Crear ramas para experimentar',
          '',
          '*Comandos basicos:*',
          '• git init - Iniciar un repositorio',
          '• git add . - Preparar cambios',
          '• git commit -m "mensaje" - Guardar cambios',
          '• git push - Subir a repositorio remoto',
          '• git pull - Bajar cambios del remoto',
          '• git branch - Crear/ver ramas',
          '',
          '*GitHub:* Plataforma web para alojar repositorios Git. Alternativas: GitLab, Bitbucket.',
        ].join('\n'),
      },
      4: {
        name: 'Bases de datos SQL vs NoSQL',
        answer: [
          '🗄️ *Bases de datos:*',
          '',
          '*SQL (Relacionales):*',
          '• Datos en tablas con filas y columnas',
          '• Estructura rigida (esquema definido)',
          '• Ideal para datos relacionados entre si',
          '• Ejemplos: PostgreSQL, MySQL, SQLite',
          '• Lenguaje: SQL (SELECT, INSERT, UPDATE...)',
          '',
          '*NoSQL (No relacionales):*',
          '• Datos en documentos, clave-valor, grafos',
          '• Estructura flexible (sin esquema fijo)',
          '• Ideal para datos no estructurados y alta escalabilidad',
          '• Ejemplos: MongoDB, Redis, Cassandra',
          '',
          '💡 *Cuando usar cada una:*',
          '• SQL: e-commerce, finanzas, datos relacionales',
          '• NoSQL: redes sociales, IoT, big data',
        ].join('\n'),
      },
    },
  },

  seguridad: {
    title: 'Seguridad Informatica',
    icon: '🔐',
    topics: {
      1: {
        name: 'Tipos de amenazas',
        answer: [
          '🔐 *Principales amenazas informaticas:*',
          '',
          '• *Malware:* Software malicioso (virus, troyanos, spyware).',
          '• *Ransomware:* Cifra tus archivos y pide rescate para devolverlos.',
          '• *Phishing:* Correos o sitios falsos que roban tus credenciales.',
          '• *Ingenieria social:* Manipulacion psicologica para obtener informacion.',
          '• *Ataques de fuerza bruta:* Prueban miles de contraseñas hasta acertar.',
          '• *Man-in-the-Middle:* Interceptan la comunicacion entre dos partes.',
          '• *DDoS:* Saturan un servidor con millones de peticiones.',
          '',
          '⚠️ La mayoria de ataques exitosos explotan errores humanos, no fallos tecnicos.',
        ].join('\n'),
      },
      2: {
        name: 'Contraseñas seguras',
        answer: [
          '🔑 *Como crear contraseñas seguras:*',
          '',
          '*Reglas basicas:*',
          '• Minimo 12 caracteres',
          '• Combina mayusculas, minusculas, numeros y simbolos',
          '• No uses datos personales (nombre, fecha de nacimiento)',
          '• No reutilices contraseñas entre servicios',
          '',
          '*Herramientas recomendadas:*',
          '• *Gestor de contraseñas:* Bitwarden, 1Password, KeePass',
          '• *Autenticacion 2FA:* Agrega una segunda capa de seguridad',
          '• Apps de 2FA: Google Authenticator, Authy',
          '',
          '💡 Un gestor de contraseñas es la mejor inversion en seguridad personal.',
        ].join('\n'),
      },
      3: {
        name: 'Proteger tu PC',
        answer: [
          '🛡️ *Como proteger tu computador:*',
          '',
          '• *Manten todo actualizado:* Sistema operativo, navegador, apps.',
          '• *Antivirus:* Windows Defender es suficiente para la mayoria.',
          '• *Firewall:* Mantenerlo activado siempre.',
          '• *Copias de seguridad:* Respaldo regular (regla 3-2-1).',
          '• *No descargues de sitios dudosos:* Usa fuentes oficiales.',
          '• *Cuidado con los USB:* Pueden contener malware.',
          '• *Cifra tu disco:* BitLocker (Windows) o FileVault (Mac).',
          '• *Bloquea tu sesion:* Win+L cuando te alejes del PC.',
          '',
          '📌 La regla 3-2-1: 3 copias, 2 medios distintos, 1 fuera del sitio.',
        ].join('\n'),
      },
      4: {
        name: 'Navegar seguro en Internet',
        answer: [
          '🌐 *Tips para navegar seguro:*',
          '',
          '• *Verifica HTTPS:* El candado en la barra indica conexion cifrada.',
          '• *No hagas clic en enlaces sospechosos:* Especialmente en correos.',
          '• *Revisa el remitente:* Los correos de phishing imitan empresas reales.',
          '• *WiFi publico:* Evita hacer transacciones. Usa VPN.',
          '• *Permisos de apps:* Revisa que permisos otorgas.',
          '• *Actualizaciones del navegador:* Mantenerlo al dia.',
          '• *Extensiones de seguridad:* uBlock Origin, HTTPS Everywhere.',
          '',
          '⚠️ Si algo parece demasiado bueno para ser verdad, probablemente lo es.',
        ].join('\n'),
      },
    },
  },
};

// ============================================
// Textos del chatbot
// ============================================
const TEXTS = {
  welcome: [
    '¡Hola! 👋 Soy *Informatica Bot*, tu asistente de informatica.',
    '',
    '¿Que tipo de problema tienes?',
    '',
    '1️⃣ 🔑 Problemas con su clave',
    '2️⃣ 🌐 Problemas con Intranet',
    '3️⃣ 📶 Problemas con WiFi',
    '4️⃣ 🔒 Problemas con VPN',
    '5️⃣ 🖨️ Problemas de Impresora',
    '6️⃣ ⚡ Problemas con Speedy',
    '7️⃣ 🗄️ Problemas con DBNet',
    '',
    '_Escribe el numero de la opcion que deseas._',
  ].join('\n'),

  backToMenu: 'Volviendo al menu principal...',

  unknown: [
    '🤔 No entendi tu mensaje.',
    '',
    'Escribe *hola* para ver el menu principal.',
  ].join('\n'),
};

// Tipos de claves para el submenu
const CLAVES = {
  1: {
    name: 'Clave Correo',
    answer: [
      '📧 *Problema con Clave de Correo*',
      '',
      'Para restablecer tu clave de correo:',
      '1. Contacta al area de informatica',
      '2. Indica tu nombre completo y usuario',
      '3. Se te asignara una clave temporal',
      '',
      '⚠️ Recuerda cambiar la clave temporal por una personal al ingresar.',
      '',
      'Escribe *0* para volver al menu.',
    ].join('\n'),
  },
  2: {
    name: 'Clave WSL Token Password',
    answer: [
      '🔐 *Problema con Clave WSL Token Password*',
      '',
      'Para restablecer tu token/password de WSL:',
      '1. Ingresa al portal de WSL',
      '2. Selecciona "Olvidé mi contraseña"',
      '3. Si no puedes, contacta al area de informatica con tu usuario',
      '',
      'Escribe *0* para volver al menu.',
    ].join('\n'),
  },
  3: {
    name: 'Clave Intranet',
    answer: [
      '🌐 *Problema con Clave de Intranet*',
      '',
      'Para restablecer tu clave de Intranet:',
      '1. Contacta al area de informatica',
      '2. Proporciona tu RUT y nombre completo',
      '3. Se generara una nueva clave temporal',
      '',
      'Escribe *0* para volver al menu.',
    ].join('\n'),
  },
  4: {
    name: 'Clave DBNet',
    answer: [
      '🗄️ *Problema con Clave DBNet*',
      '',
      'Para restablecer tu clave de DBNet:',
      '1. Contacta al area de informatica',
      '2. Indica tu usuario de DBNet',
      '3. Se restablecera tu acceso',
      '',
      '⚠️ No compartas tu clave de DBNet con terceros.',
      '',
      'Escribe *0* para volver al menu.',
    ].join('\n'),
  },
};

// Problemas con contacto directo
const PROBLEMAS = {
  2: {
    name: 'Problemas con Intranet',
    answer: [
      '🌐 *Problemas con Intranet*',
      '',
      'Para resolver tu problema con Intranet, contacta a:',
      '',
      '👤 *Rony Castillo*',
      '📱 +569 76590469',
      '',
      'Escribe *0* para volver al menu.',
    ].join('\n'),
  },
  3: {
    name: 'Problemas con WiFi',
    answer: [
      '📶 *Problemas con WiFi*',
      '',
      'Para resolver tu problema con WiFi, contacta a:',
      '',
      '👤 *Damian Verdugo*',
      '📱 +569 44772213',
      '',
      'Escribe *0* para volver al menu.',
    ].join('\n'),
  },
  4: {
    name: 'Problemas con VPN',
    answer: [
      '🔒 *Problemas con VPN*',
      '',
      'Para resolver tu problema con VPN, contacta a:',
      '',
      '👤 *Damian Verdugo*',
      '📱 +569 44772213',
      '',
      'Escribe *0* para volver al menu.',
    ].join('\n'),
  },
  5: {
    name: 'Problemas de Impresora',
    answer: [
      '🖨️ *Problemas de Impresora*',
      '',
      'Para resolver tu problema con la impresora, contacta a:',
      '',
      '👤 *Kevin Arriagada*',
      '📱 +569 30919502',
      '',
      'Escribe *0* para volver al menu.',
    ].join('\n'),
  },
  6: {
    name: 'Problemas con Speedy',
    answer: [
      '⚡ *Problemas con Speedy*',
      '',
      'Para resolver tu problema con Speedy, contacta a:',
      '',
      '👤 *Julio Castillo*',
      '📱 +569 57190055',
      '',
      'Escribe *0* para volver al menu.',
    ].join('\n'),
  },
  7: {
    name: 'Problemas con DBNet',
    answer: [
      '🗄️ *Problemas con DBNet*',
      '',
      'Para resolver tu problema con DBNet, contacta a:',
      '',
      '👤 *Julio Castillo*',
      '📱 +569 57190055',
      '',
      'Escribe *0* para volver al menu.',
    ].join('\n'),
  },
};

// Mapeo de numero a categoria (para las opciones de conocimiento)
const CATEGORY_MAP = {
  8: 'hardware',
  9: 'software',
  10: 'redes',
  11: 'programacion',
  12: 'seguridad',
};

// ============================================
// Funcion principal: procesar mensaje
// ============================================
async function processMessage(message, from) {
  const normalized = message.toLowerCase().trim();

  const state = conversationState.get(from) || { menu: 'idle' };

  // Comando universal: "0" vuelve al menu principal
  if (normalized === '0') {
    conversationState.set(from, { menu: 'idle' });
    return `${TEXTS.backToMenu}\n\n${TEXTS.welcome}`;
  }

  // Saludos: mostrar menu principal
  if (['hola', 'hi', 'hello', 'inicio', 'menu', 'menú'].includes(normalized)) {
    conversationState.set(from, { menu: 'main' });
    return TEXTS.welcome;
  }

  switch (state.menu) {
    case 'main':
      return handleMainMenu(normalized, from);

    case 'claves':
      return handleClaveSelection(normalized, from);

    case 'category':
      return handleTopicSelection(normalized, from, state.category);

    default:
      return TEXTS.unknown;
  }
}

// ============================================
// Handlers
// ============================================

function handleMainMenu(input, from) {
  const option = parseInt(input, 10);

  // Opcion 1: Problemas con clave
  if (option === 1) {
    conversationState.set(from, { menu: 'claves' });
    return [
      '🔑 *Problemas con su clave*',
      '',
      '¿Que tipo de clave necesitas restablecer?',
      '',
      '*1.* Clave Correo',
      '*2.* Clave WSL Token Password',
      '*3.* Clave Intranet',
      '*4.* Clave DBNet',
      '',
      'Escribe el numero de la opcion, o *0* para volver al menu.',
    ].join('\n');
  }

  // Opciones 2-7: Problemas con contacto directo
  if (option >= 2 && option <= 7) {
    const problema = PROBLEMAS[option];
    if (problema) {
      return problema.answer;
    }
  }

  // Opciones 8+: Categorias de conocimiento (si las necesitas)
  const categoryKey = CATEGORY_MAP[option];

  if (!categoryKey) {
    return `No reconozco esa opcion.\n\n${TEXTS.welcome}`;
  }

  const category = KNOWLEDGE[categoryKey];
  conversationState.set(from, { menu: 'category', category: categoryKey });

  return buildTopicList(category);
}

function handleClaveSelection(input, from) {
  const claveId = parseInt(input, 10);
  const clave = CLAVES[claveId];

  if (clave) {
    conversationState.set(from, { menu: 'idle' });
    return clave.answer;
  }

  return `Opcion no valida. Elige un numero del 1 al 4, o escribe *0* para volver.`;
}

function handleTopicSelection(input, from, categoryKey) {
  const category = KNOWLEDGE[categoryKey];
  if (!category) {
    conversationState.set(from, { menu: 'idle' });
    return TEXTS.unknown;
  }

  const topicId = parseInt(input, 10);
  const topic = category.topics[topicId];

  if (topic) {
    return `${topic.answer}\n\nEscribe otro numero para ver otro tema, o *0* para volver al menu.`;
  }

  return `Opcion no valida. Elige un numero del 1 al ${Object.keys(category.topics).length}, o escribe *0* para volver.`;
}

// ============================================
// Helpers
// ============================================

function buildTopicList(category) {
  const topics = Object.entries(category.topics)
    .map(([id, t]) => `*${id}.* ${t.name}`)
    .join('\n');

  return [
    `${category.icon} *${category.title}*`,
    '',
    'Elige un tema:',
    '',
    topics,
    '',
    'Escribe el numero del tema, o *0* para volver al menu.',
  ].join('\n');
}

module.exports = { processMessage };
