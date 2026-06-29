import { useState, useMemo, useEffect } from 'react'

// ─── ACCESS TOKEN ─────────────────────────────────────────────────────────────
const ACCESS_TOKEN = 'W84C-TPYQ-4KKB'
const SESSION_KEY = 'andreani_preview_unlocked'

// ─── PRODUCTO 7 — datos embebidos ─────────────────────────────────────────────
const PRODUCTO = {
  "id": 7,
  "nombre": "Distribución Gral. Estándar | B2C",
  "descripcion": "Modelo completo de distribución general para clientes B2C. Incluye predicción de entrega (EDA, ERA, ETA) combinada con el ciclo completo de visita, custodia y resultado final.",
  "icono": "📬",
  "mensajes": [
    {
      "titulo": "Alta con fecha estimada",
      "texto": "¡Hola Sofía! 👋🏼 Soy Andi, asistente virtual de Andreani. 🤖\n\nTe cuento que tu envío N° 3100000345678 de Tienda eCommerce comenzó el circuito de entrega. Lo recibirás, a más tardar, el 15/04/2026. 📬\n\n• Presentá tu DNI original actualizado.\n• Es posible que debas firmar la entrega.\n\nPor favor, no respondas a este mensaje.\n\nObtené más información… 👇🏼",
      "regla": "Evento contiene (Admision; AltaManual; AltaAutomatica; AltaRemota) - EsMultibulto=False - CicloNo-ContieneDevolucion; Drop - ConDatosEDA=True -",
      "html": "<div class=\"whatsapp-message-content\"><span>¡Hola /</span><strong>DestinatarioNombreSolo</strong><span>/! 👋🏼 Soy Andi, asistente virtual de Andreani. 🤖</span><br><br><span>Te cuento que tu </span><strong>envío N° /</strong><span>NumeroDeEnvio</span><strong>/</strong><span> de </span><strong>/</strong><span>NombreFantasia</span><strong>/</strong><span> comenzó el circuito de entrega. </span><strong>Lo recibirás, a más tardar, el /</strong><span>EdaFecha</span><strong>/.</strong><span> 📬</span><br><br><span>• Presentá tu DNI original actualizado.</span><br><span>• Es posible que debas firmar la entrega.</span><br><br><em>Por favor, no respondas a este mensaje.</em><br><br><span>Obtené más información… 👇🏼</span><br></div>"
    },
    {
      "titulo": "Alta sin fecha estimada",
      "texto": "¡Hola Sofía! 👋🏼 Soy Andi, asistente virtual de Andreani 🤖.\n\nQuiero contarte que estamos preparando tu envío N° 3100000345678 de Tienda eCommerce. Pronto iniciará el circuito de entrega.\n\nPor favor, no respondas a este mensaje.\n\nObtené más información… 👇🏼",
      "regla": "Evento contiene (Admision; AltaManual; AltaAutomatica; AltaRemota) - EsMultibulto=False - CicloNo-ContieneDevolucion; Drop - ConDatosEDA=False -",
      "html": "<div class=\"whatsapp-message-content\"><span>¡Hola /</span><strong>DestinatarioNombreSolo</strong><span>/! 👋🏼 Soy Andi, asistente virtual de Andreani 🤖.</span><br><br><span>Quiero contarte que </span><strong>estamos preparando tu envío N° /</strong><span>NumeroDeEnvio</span><strong>/ de /</strong><span>NombreFantasia</span><strong>/</strong><span>. Pronto iniciará el circuito de entrega.</span><br><br><em>Por favor, no respondas a este mensaje.</em><br><br><span>Obtené más información… 👇🏼</span></div>"
    },
    {
      "titulo": "Estimación de entrega",
      "texto": "¡Hola Sofía! 👋🏼🤖\nTu envio 3100000345678 está listo para entregarse. Durante la tarde para que lo recibas.\n \n• Presentá tu DNI original actualizado.\n• Es posible que debas firmar la entrega.\n \nObtené más información… 👇🏼",
      "regla": "Evento=ERA - PosicionHDR>=0 - CumplimientoTTOrdenHDR>=50 - EraRango!=null - SucursalCodigo contiene (...) - FechaVisitaHoy=False - MotivoUltimaVisitaNo-ContieneEntregado -",
      "html": "<div class=\"whatsapp-message-content\"><span>¡Hola /</span><strong>DestinatarioNombreSolo</strong><span>/! 👋🏼🤖</span><br><span>Tu envio /</span><strong>NumeroDeEnvio</strong><span>/ está listo para entregarse. /</span><strong>EstimacionDescripcion</strong><span>/ para que lo recibas.</span><br><span> </span><br><span>• Presentá tu DNI original actualizado.</span><br><span>• Es posible que debas firmar la entrega.</span><br><span> </span><br><span>Obtené más información… 👇🏼</span></div>"
    },
    {
      "titulo": "Llegada próxima",
      "texto": "¡Hola Sofía! 👋🏼🤖\n\nTe cuento que te visitaremos dentro de la próxima hora en Libertad 4444 10° A, para entregarte tu envío N° 3100000345678 de Tienda eCommerce. \n\n• Presentá tu DNI original actualizado.\n• Es posible que debas firmar la entrega.\n\nPor favor, no respondas a este mensaje.\n\nObtené más información… 👇🏼",
      "regla": "Evento=ETA - FechaVisitaHoy=False - SucursalCodigo contiene (...) - DistribuidorDocumentoNo-Contiene (...) -",
      "html": "<div class=\"whatsapp-message-content\"><span>¡Hola /</span><strong>DestinatarioNombreSolo</strong><span>/! 👋🏼🤖</span><br><br><span>Te cuento que </span><strong>te visitaremos dentro de la próxima hora</strong><span> en /</span><strong>DestinatarioDireccionCompleta</strong><span>/, para entregarte tu envío N° /</span><strong>NumeroDeEnvio</strong><span>/ de /</span><strong>NombreFantasia</strong><span>/. </span><br><br><span>• Presentá tu DNI original actualizado.</span><br><span>• Es posible que debas firmar la entrega.</span><br><br><em>Por favor, no respondas a este mensaje.</em><br><br><span>Obtené más información… 👇🏼</span></div>"
    },
    {
      "titulo": "Aviso de distribución",
      "texto": "¡Hola Sofía! Aquí Andi nuevamente… 🤖\n\nPaso a avisarte que hoy te visitaremos en Libertad 4444 10° A, para entregar tu envío N° 3100000345678 de Tienda eCommerce. 📬\n\n• Por favor, presentá tu DNI.\n• Dependiendo del tipo de envío, es posible que debas firmar la entrega.\n• Distribuidor asignado: Carlos Rodriguez.\n\nPor favor, no respondas a este mensaje.\n\nObtené más información… 👇🏼",
      "regla": "Evento=Distribucion - Ciclo!=Devolucion - TipoDeDistribuidor!=Mostrador - Estado!=Recanalizada - Dis...",
      "html": "<div class=\"whatsapp-message-content\"><span>¡Hola /</span><strong>DestinatarioNombreSolo</strong><span>/! Aquí Andi nuevamente… 🤖</span><br><br><span>Paso a avisarte que </span><strong>hoy te visitaremos en /</strong><span>DestinatarioDireccionCompleta</span><strong>/,</strong><span> para entregar tu </span><strong>envío N° /</strong><span>NumeroDeEnvio</span><strong>/</strong><span> de </span><strong>/</strong><span>NombreFantasia</span><strong>/.</strong><span> 📬</span><br><br><span>• Por favor, presentá tu DNI.</span><br><span>• Dependiendo del tipo de envío, es posible que debas firmar la entrega.</span><br><span>• Distribuidor asignado: /</span><strong>DistribuidorNombre</strong><span>/.</span><br><br><em>Por favor, no respondas a este mensaje.</em><br><br><span>Obtené más información… 👇🏼</span><br></div>"
    },
    {
      "titulo": "Visita no realizada",
      "texto": "Hola Sofía, 🤖\n\nTe cuento que, por causas de fuerza mayor, no pudimos visitarte hoy en Libertad 4444 10° A, para realizar la entrega de tu envío N° 3100000345678 de Tienda eCommerce.\n\n❗ Recibirás novedades cuando estemos en camino.\n\nObtené más información… 👇🏼",
      "regla": "Evento=Visita - Motivo contiene (No fue visitado; Feriado Provincial; Zona inaccesible) - Ciclo!=Dev...",
      "html": "<div class=\"whatsapp-message-content\"><span>Hola /</span><strong>DestinatarioNombreSolo</strong><span>/, 🤖</span><br><br><span>Te cuento que, por causas de fuerza mayor, </span><strong>no pudimos visitarte hoy en /</strong><span>DestinatarioDireccionCompleta</span><strong>/,</strong><span> para realizar la entrega de tu </span><strong>envío N° /</strong><span>NumeroDeEnvio</span><strong>/</strong><span> de </span><strong>/</strong><span>NombreFantasia</span><strong>/.</strong><br><br><span>❗ Recibirás novedades cuando estemos en camino.</span><br><br><span>Obtené más información… 👇🏼</span></div>"
    },
    {
      "titulo": "Visita fallida",
      "texto": "Hola Sofía, 🤖\n\nTe cuento que te visitamos en Libertad 4444 10° A, a las 15:35, pero no logramos entregar tu envío N° 3100000345678 de Tienda eCommerce.\n\n• Motivo: Dirección incompleta.\n\n❗ Pronto te enviaremos novedades con los pasos a seguir.\n\nPor favor, no respondas a este mensaje.\n\nObtené más información… 👇🏼",
      "regla": "Evento=Visita - Motivo contiene (Cerrado Definitivo; Destinatario Desconocido; Direccion Incorrecta;...",
      "html": "<div class=\"whatsapp-message-content\"><span>Hola /</span><strong>DestinatarioNombreSolo</strong><span>/, 🤖</span><br><br><span>Te cuento que te visitamos en </span><strong>/</strong><span>DestinatarioDireccionCompleta</span><strong>/,</strong><span> a las /</span><strong>HoraEvento</strong><span>/, pero no logramos entregar tu </span><strong>envío N° /</strong><span>NumeroDeEnvio</span><strong>/</strong><span> de </span><strong>/</strong><span>NombreFantasia</span><strong>/.</strong><br><br><span>• Motivo: /</span><strong>Motivo</strong><span>/.</span><br><br><span>❗ Pronto te enviaremos novedades con los pasos a seguir.</span><br><br><em>Por favor, no respondas a este mensaje.</em><br><br><span>Obtené más información… 👇🏼</span><br></div>"
    },
    {
      "titulo": "Entrega confirmada (sucursal)",
      "texto": "¿Qué tal Sofía? 👋🏼🤖\n\nTe confirmo que ya entregamos tu envío N° 3100000345678 de Tienda eCommerce en nuestra sucursal Avellaneda (Pienovi), a las 15:35. ¡Gracias por tu colaboración! ❤️\n\n_¡Contanos tu experiencia!_ » [ver encuesta]\n\nPor favor, no respondas a este mensaje.\n\nObtené más información… 👇🏼",
      "regla": "Evento=Visita - Motivo=Entregado - SubMotivo=Entregado por Mostrador - Ciclo!=Devolucion - Distribui...",
      "html": "<div class=\"whatsapp-message-content\"><span>¿Qué tal /</span><strong>DestinatarioNombreSolo</strong><span>/? 👋🏼🤖</span><br><br><span>Te confirmo que </span><strong>ya entregamos tu envío N° /</strong><span>NumeroDeEnvio</span><strong>/</strong><span> de /</span><strong>NombreFantasia</strong><span>/ en nuestra </span><strong>sucursal /</strong><span>SucursalDescripcion</span><strong>/</strong><span>, a las /</span><strong>HoraEvento</strong><span>/. ¡Gracias por tu colaboración! ❤️</span><br><br><strong>_¡Contanos tu experiencia!_</strong><span> » https://loopeencuestas.com.ar/encuesta/Andreani/f26beb0b-c1f6-4cf3-88bc-9f308f388e38?codId=/</span><strong>DatosEncuestaEncriptados</strong><span>/</span><br><br><em>Por favor, no respondas a este mensaje.</em><br><br><span>Obtené más información… 👇🏼</span><br></div>"
    },
    {
      "titulo": "Entrega confirmada (domicilio)",
      "texto": "¿Qué tal Sofía? 👋🏼🤖\n\nTe confirmo que ya entregamos tu envío N° 3100000345678 de Tienda eCommerce en Libertad 4444 10° A, a las 15:35. ¡Gracias por tu colaboración! ❤️\n\n• El envío fue recibido por Evelyn Barrios, DNI N° 32860626. \n• Conocé dónde se realizó la entrega: https://www.andreani.com/envio/3100000345678 📍\n\n¡Contanos tu experiencia! » [ver encuesta]\n\nPor favor, no respondas a este mensaje.\n\nObtené más información… 👇🏼",
      "regla": "Evento=VisitaMobile - Motivo=Entregado Mobile - Ciclo!=Devolucion -",
      "html": "<div class=\"whatsapp-message-content\"><span>¿Qué tal /</span><strong>DestinatarioNombreSolo</strong><span>/? 👋🏼🤖</span><br><br><span>Te confirmo que </span><strong>ya entregamos tu envío N° /</strong><span>NumeroDeEnvio</span><strong>/</strong><span> de /</span><strong>NombreFantasia</strong><span>/ en </span><strong>/</strong><span>DestinatarioDireccionCompleta</span><strong>/</strong><span>, a las /</span><strong>HoraEvento</strong><span>/. ¡Gracias por tu colaboración! ❤️</span><br><br><span>• /</span><strong>PODRecepcion</strong><span>/. </span><br><span>• Conocé dónde se realizó la entrega: /</span><strong>Localizacion</strong><span>/ 📍</span><br><br><span>¡Contanos tu experiencia! » https://loopeencuestas.com.ar/encuesta/Andreani/404f8159-79e6-4dec-ba23-f5b0e7104605?codId=/</span><strong>DatosEncuestaEncriptados</strong><span>/</span><br><br><em>Por favor, no respondas a este mensaje.</em><br><br><span>Obtené más información… 👇🏼</span><br></div>"
    },
    {
      "titulo": "Listo para retirar",
      "texto": "¡Hola Sofía!  👋 🤖\n\n📦 Te aviso que ya podés retirar tu envío N°3100000345678 de Tienda eCommerce.\nTenés tiempo hasta el 26/05/2026. ⏳\n\n📍 Sucursal Andreani Avellaneda (Pienovi)\n📌 Dirección: Pienovi 104\n🕐 Horarios: Lunes a viernes 08:00-18:00 / Sábados 08:00-13:00\n\n❗ Recordá llevar tu DNI original actualizado.\n\nPor favor, no respondas a este mensaje.",
      "regla": "Evento=AsignacionACaja - Ciclo!=Devolucion - Estado=Custodia - ContratoRequierePin=False ",
      "html": "<div class=\"whatsapp-message-content\"><span>¡Hola /</span><strong>DestinatarioNombreSolo</strong><span>/!  👋 🤖</span><br><br><span>📦 Te aviso que ya podés retirar tu envío N°/</span><strong>NumeroDeEnvio</strong><span>/ de /</span><strong>NombreFantasia</strong><span>/.</span><br><span>Tenés tiempo </span><strong>hasta el /</strong><span>FechaVencimientoCustodia</span><strong>/.</strong><span> ⏳</span><br><br><span>📍 Sucursal Andreani /</span><strong>SucursalDescripcion</strong><span>/</span><br><span>📌 Dirección: /</span><strong>SucursalDireccion</strong><span>/</span><br><span>🕐 Horarios: /</span><strong>SucursalHorario</strong><span>/</span><br><br><span>❗ Recordá llevar tu DNI original actualizado.</span><br><br><span>Por favor, no respondas a este mensaje.</span></div>"
    },
    {
      "titulo": "Recordatorio de custodia",
      "texto": "Hola Sofía 👋  \n\nQuiero recordarte que ya podés retirar tu envío N° 3100000345678 de Tienda eCommerce\n\n📍 Sucursal Andreani Avellaneda (Pienovi)\n🗺️ Pienovi 104\n🕐 Lunes a viernes 08:00-18:00 / Sábados 08:00-13:00\n\nTenés tiempo hasta el 26/05/2026 ⏱️ Luego de esa fecha, será devuelto al remitente.\n\n❗ Recordá llevar tu DNI original actualizado.\n\nPor favor, no respondas a este mensaje.",
      "regla": "Evento=AvisoCustodia",
      "html": "<div class=\"whatsapp-message-content\"><span>Hola /</span><strong>DestinatarioNombreSolo</strong><span>/ 👋  </span><br><br><span>Quiero recordarte que </span><strong>ya podés retirar tu envío N° /</strong><span>NumeroDeEnvio</span><strong>/</strong><span> de /</span><strong>NombreFantasia</strong><span>/</span><br><br><span>📍 Sucursal Andreani /</span><strong>SucursalDescripcion</strong><span>/</span><br><span>🗺️ /</span><strong>SucursalDireccion</strong><span>/</span><br><span>🕐 /</span><strong>SucursalHorario</strong><span>/</span><br><br><span>Tenés tiempo </span><strong>hasta el /</strong><span>FechaVencimientoCustodia</span><strong>/</strong><span> ⏱️ Luego de esa fecha, será devuelto al remitente.</span><br><br><span>❗ Recordá llevar tu DNI original actualizado.</span><br><br><em>Por favor, no respondas a este mensaje.</em></div>"
    },
    {
      "titulo": "Envío no entregado",
      "texto": "Hola Sofía, 🤖\n\nTe quiero contar que no logramos realizar la entrega de tu envío N° 3100000345678. Podría ser devuelto a Tienda eCommerce\n\nℹ️ Si necesitás saber más al respecto, te sugiero que te contactes con el remitente.\n\n_¡Contanos tu experiencia!_ » [ver encuesta]\n\nPor favor, no respondas a este mensaje.\n\nObtené más información… 👇🏼",
      "regla": "Evento=EnvioNoEntregado - Ciclo!=Devolucion -",
      "html": "<div class=\"whatsapp-message-content\"><span>Hola /</span><strong>DestinatarioNombreSolo</strong><span>/, 🤖</span><br><br><span>Te quiero contar que no logramos realizar la entrega de tu envío N° /</span><strong>NumeroDeEnvio</strong><span>/. Podría ser devuelto a </span><strong>/</strong><span>NombreFantasia</span><strong>/</strong><br><br><span>ℹ️ Si necesitás saber más al respecto, </span><strong>te sugiero que te contactes con el remitente.</strong><br><br><strong>_¡Contanos tu experiencia!_</strong><span> » https://loopeencuestas.com.ar/encuesta/Andreani/853f4684-7a15-477d-9505-a16f7475794d?codId=/</span><strong>DatosEncuestaEncriptados</strong><span>/</span><br><br><em>Por favor, no respondas a este mensaje.</em><br><br><span>Obtené más información… 👇🏼</span><br></div>"
    },
    {
      "titulo": "Siniestro",
      "texto": "Hola Sofía 🤖.\n\nTe quiero contar que no pudimos entregar tu Tienda eCommerce N° 3100000345678 de envío\n\nℹ️ Si necesitás saber más al respecto, contactate con el remitente.\n\nPor favor, no respondas a este mensaje.\n\nObtené más información… 👇🏼",
      "regla": "Evento=Siniestro - Ciclo!=Devolucion -",
      "html": "<div class=\"whatsapp-message-content\"><span>Hola /</span><strong>DestinatarioNombreSolo</strong><span>/ 🤖.</span><br><br><span>Te quiero contar que no pudimos entregar tu /</span><strong>NombreFantasia</strong><span>/ N° /</span><strong>NumeroDeEnvio</strong><span>/ de </span><strong>envío</strong><br><br><span>ℹ️ Si necesitás saber más al respecto, </span><strong>contactate con el remitente.</strong><br><br><em>Por favor, no respondas a este mensaje</em><span>.</span><br><br><span>Obtené más información… 👇🏼</span><br></div>"
    }
  ]
}

// ─── ETAPA META ───────────────────────────────────────────────────────────────
const ETAPA_META = {
  alta:         { label: 'Alta',         emoji: '📬', color: '#1a5f9c', bg: '#EAF3FB', border: '#b3d4f0', dot: '#378ADD' },
  en_camino:    { label: 'En camino',    emoji: '🚚', color: '#92600a', bg: '#FEF9EC', border: '#f5d97a', dot: '#BA7517' },
  visita:       { label: 'Visita',       emoji: '🏠', color: '#c25400', bg: '#FFF3EB', border: '#fdc08a', dot: '#D85A30' },
  entregado:    { label: 'Entregado',    emoji: '✅', color: '#1a6e2e', bg: '#EAF7EA', border: '#7dcf8a', dot: '#639922' },
  no_entregado: { label: 'No entregado', emoji: '❌', color: '#c8281e', bg: '#FAEAEA', border: '#f5b0ad', dot: '#E24B4A' },
  custodia:     { label: 'Custodia',     emoji: '🏪', color: '#6b21a8', bg: '#F5F0FF', border: '#c4a0f0', dot: '#7F77DD' },
}

// ─── FLOW SECTIONS — Producto 7 ──────────────────────────────────────────────
const FLOW = [
  { key: 'alta', label: 'Alta', emoji: '📬', nodes: [
    { key: 'alta_eda', label: 'Con fecha estimada', sub: 'EDA incluida en el mensaje', etapa: 'alta', optional: false,
      matchFn: m => m.titulo === 'Alta con fecha estimada' },
    { key: 'alta_sin', label: 'Sin fecha estimada', sub: 'Sin predicción de entrega',  etapa: 'alta', optional: false,
      matchFn: m => m.titulo === 'Alta sin fecha estimada' },
  ]},
  { key: 'en_camino', label: 'En camino', emoji: '🚚', nodes: [
    { key: 'era',  label: 'ERA',                  sub: 'Rango horario de entrega',  etapa: 'en_camino', optional: true,  matchFn: m => m.titulo === 'Estimación de entrega' },
    { key: 'dist', label: 'Aviso de distribución', sub: 'Hoy te visitaremos',        etapa: 'en_camino', optional: false, matchFn: m => m.titulo === 'Aviso de distribución' },
    { key: 'eta',  label: 'Llegada próxima',        sub: 'Dentro de la próxima hora', etapa: 'en_camino', optional: true,  matchFn: m => m.titulo === 'Llegada próxima' },
  ]},
  { key: 'visita', label: 'Visita', emoji: '🏠', nodes: [
    { key: 'no_visit',label: 'Visita no realizada',           sub: 'No se pasó por el domicilio · nueva visita', etapa: 'visita',    optional: false, matchFn: m => m.titulo === 'Visita no realizada' },
    { key: 'fallida', label: 'Visita fallida',                sub: 'Sin nueva visita',                           etapa: 'visita',    optional: false, matchFn: m => m.titulo === 'Visita fallida' },
    { key: 'ent_suc', label: 'Entrega confirmada (sucursal)', sub: 'Por mostrador ✓',                           etapa: 'entregado', optional: false, matchFn: m => m.titulo === 'Entrega confirmada (sucursal)' },
    { key: 'ent_dom', label: 'Entrega confirmada (domicilio)',sub: 'En domicilio ✓',                            etapa: 'entregado', optional: false, matchFn: m => m.titulo === 'Entrega confirmada (domicilio)' },
  ]},
  { key: 'custodia', label: 'Custodia', emoji: '🏪', nodes: [
    { key: 'cust', label: 'Listo para retirar', sub: 'Disponible en sucursal',     etapa: 'custodia', optional: false, matchFn: m => m.titulo === 'Listo para retirar' },
    { key: 'rec',  label: 'Recordatorio',        sub: 'Cada 48hs durante 10 días', etapa: 'custodia', optional: false, matchFn: m => m.titulo === 'Recordatorio de custodia' },
  ]},
  { key: 'final', label: 'No entregado', emoji: '❌', nodes: [
    { key: 'no_ent',   label: 'Envío no entregado', sub: 'Venció plazo / devolución', etapa: 'no_entregado', optional: false, matchFn: m => m.titulo === 'Envío no entregado' },
    { key: 'siniestro',label: 'Siniestro',           sub: 'En cualquier momento',     etapa: 'no_entregado', optional: true,  matchFn: m => m.titulo === 'Siniestro' },
  ]},
]

// ─── PASSWORD GATE ────────────────────────────────────────────────────────────
function PasswordGate({ onUnlock }) {
  const [value, setValue] = useState('')
  const [error, setError] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    const clean = value.trim().toUpperCase().replace(/\s+/g, '')
    if (clean === ACCESS_TOKEN) {
      sessionStorage.setItem(SESSION_KEY, '1')
      onUnlock()
    } else {
      setError(true)
      setTimeout(() => setError(false), 2000)
    }
  }

  return (
    <div style={{
      minHeight: '100vh', background: '#1a1917',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontFamily: 'Nunito Sans, sans-serif', padding: '2rem'
    }}>
      <div style={{
        background: '#fff', borderRadius: 20, padding: '2.5rem',
        maxWidth: 380, width: '100%', textAlign: 'center'
      }}>
        <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>🔒</div>
        <h1 style={{ fontSize: '1.3rem', fontWeight: 800, color: '#1a1917', marginBottom: 8 }}>
          Contenido confidencial
        </h1>
        <p style={{ fontSize: '0.85rem', color: '#888', marginBottom: '1.75rem', lineHeight: 1.5 }}>
          Ingresá el código de acceso que te compartió tu contacto en Andreani.
        </p>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            value={value}
            onChange={e => setValue(e.target.value)}
            placeholder="XXXX-XXXX-XXXX"
            autoFocus
            style={{
              width: '100%', padding: '12px 14px', borderRadius: 10,
              border: `2px solid ${error ? '#c8281e' : '#e0e0e0'}`,
              fontSize: '1rem', fontWeight: 700, textAlign: 'center',
              letterSpacing: '0.1em', textTransform: 'uppercase',
              fontFamily: 'monospace', outline: 'none', boxSizing: 'border-box',
              marginBottom: '1rem', transition: 'border-color 0.2s'
            }}
          />
          {error && (
            <p style={{ color: '#c8281e', fontSize: '0.78rem', marginBottom: '1rem', fontWeight: 600 }}>
              Código incorrecto. Intentá de nuevo.
            </p>
          )}
          <button type="submit" style={{
            width: '100%', background: '#25D366', color: '#fff', border: 'none',
            padding: '12px', borderRadius: 10, fontWeight: 800, fontSize: '0.9rem',
            cursor: 'pointer', letterSpacing: '0.02em'
          }}>
            Ingresar
          </button>
        </form>
      </div>
    </div>
  )
}

// ─── FLOW LIST ────────────────────────────────────────────────────────────────
function FlowList({ mensajes, selectedKey, onSelect }) {
  return (
    <div style={{ overflowY: 'auto', maxHeight: '70vh' }}>
      {FLOW.map((section, si) => {
        const meta = ETAPA_META[section.key] || ETAPA_META.alta
        return (
          <div key={section.key}>
            <div style={{
              padding: '10px 16px 4px',
              fontSize: '0.85rem', fontWeight: 800, color: meta.color,
              textTransform: 'uppercase', letterSpacing: '0.06em',
              display: 'flex', alignItems: 'center', gap: 7,
              borderTop: si > 0 ? '1px solid #f0ede8' : 'none',
              marginTop: si > 0 ? 4 : 0
            }}>
              <span style={{ fontSize: '1rem' }}>{section.emoji}</span><span>{section.label}</span>
            </div>
            {section.nodes.map(node => {
              const nodeMeta = ETAPA_META[node.etapa] || ETAPA_META.alta
              const matched = node.matchFn ? mensajes.find(node.matchFn) : null
              const isActive = selectedKey === node.key
              const hasMsg = !!matched
              return (
                <button key={node.key}
                  onClick={() => hasMsg && onSelect(node.key)}
                  disabled={!hasMsg}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 10,
                    width: '100%', textAlign: 'left', padding: '8px 16px',
                    border: 'none',
                    borderLeft: `3px solid ${isActive ? nodeMeta.color : 'transparent'}`,
                    background: isActive ? nodeMeta.bg : 'transparent',
                    cursor: hasMsg ? 'pointer' : 'default',
                    opacity: hasMsg ? 1 : 0.4, transition: 'all 0.12s'
                  }}
                  onMouseEnter={e => { if (hasMsg && !isActive) e.currentTarget.style.background = '#f9f8f6' }}
                  onMouseLeave={e => { if (!isActive) e.currentTarget.style.background = 'transparent' }}
                >
                  <span style={{ width: 8, height: 8, borderRadius: '50%', background: nodeMeta.dot, flexShrink: 0, outline: isActive ? `2px solid ${nodeMeta.color}40` : 'none' }} />
                  <span style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 1 }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <span style={{ fontSize: '0.82rem', fontWeight: isActive ? 700 : 500, color: isActive ? nodeMeta.color : '#1a1917', lineHeight: 1.3 }}>
                        {node.label}
                      </span>
                      {node.optional && <span style={{ fontSize: '0.6rem', color: '#bbb', fontStyle: 'italic' }}>opcional</span>}
                    </span>
                    <span style={{ fontSize: '0.72rem', color: isActive ? nodeMeta.color : '#999', lineHeight: 1.3 }}>{node.sub}</span>
                  </span>
                  {hasMsg && <span style={{ fontSize: '0.72rem', color: isActive ? nodeMeta.color : '#ccc', flexShrink: 0 }}>→</span>}
                </button>
              )
            })}
          </div>
        )
      })}
    </div>
  )
}

// ─── MENSAJE PREVIEW (estilo chat WhatsApp) ──────────────────────────────────
function MensajePreview({ mensaje }) {
  const renderText = (texto) => {
    return texto.split('\n').map((line, i) => {
      const parts = line.split(/(\*\*[^*]+\*\*)/g)
      return (
        <p key={i} style={{ margin: line === '' ? '6px 0' : '1px 0', fontSize: '0.88rem', color: '#111', lineHeight: 1.6 }}>
          {parts.map((p, j) =>
            p.startsWith('**') && p.endsWith('**')
              ? <strong key={j}>{p.slice(2,-2)}</strong>
              : p
          )}
        </p>
      )
    })
  }

  const now = new Date().toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' })

  return (
    <div style={{ border: '1.5px solid #e8e5de', borderRadius: 16, overflow: 'hidden', background: '#fff' }}>
      <div style={{ padding: '0.875rem 1.25rem', borderBottom: '1px solid #f0ede8', fontWeight: 700, color: '#1a1917', fontSize: '0.9rem' }}>
        {mensaje.titulo}
      </div>
      <div style={{ background: '#f5f4f0', padding: '1.5rem' }}>
        <div style={{ background: '#075E54', borderRadius: '12px 12px 0 0', padding: '10px 16px', display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 36, height: 36, borderRadius: '50%', background: '#25D366', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, color: '#fff', fontSize: '1rem' }}>A</div>
          <div>
            <div style={{ color: '#fff', fontSize: '0.85rem', fontWeight: 700 }}>Andreani</div>
            <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.7rem' }}>en línea</div>
          </div>
        </div>
        <div style={{ background: '#ECE5DD', padding: '16px 14px', borderRadius: '0 0 12px 12px', minHeight: 280 }}>
          <div style={{ maxWidth: '85%', position: 'relative' }}>
            <div style={{ background: '#fff', borderRadius: '0 12px 12px 12px', padding: '10px 14px', boxShadow: '0 1px 2px rgba(0,0,0,0.08)' }}>
              <div style={{ position: 'absolute', top: 0, left: -7, width: 0, height: 0, borderTop: '8px solid #fff', borderLeft: '7px solid transparent' }} />
              {renderText(mensaje.texto)}
              <div style={{ textAlign: 'right', fontSize: '0.65rem', color: '#999', marginTop: 5 }}>{now} ✓✓</div>
            </div>
            <div style={{ background: '#fff', padding: '7px 14px', fontSize: '0.72rem', fontWeight: 700, color: '#0277BD', textAlign: 'center', borderTop: '1px solid #f0ede8', borderRadius: '0 0 12px 12px' }}>
              SEGUIR ENVÍO
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── PREVIEW CONTENT (post-unlock) ────────────────────────────────────────────
function PreviewContent() {
  const [selectedKey, setSelectedKey] = useState(null)

  // Bloqueo de clic derecho, selección, copiar, atajos de impresión/guardado/inspección
  useEffect(() => {
    const blockContextMenu = e => e.preventDefault()
    const blockSelectStart = e => e.preventDefault()
    const blockCopy = e => e.preventDefault()
    const blockKeys = e => {
      const k = e.key.toLowerCase()
      if ((e.ctrlKey || e.metaKey) && ['s', 'p', 'u', 'c'].includes(k)) e.preventDefault()
      if (e.key === 'F12') e.preventDefault()
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && ['i', 'j', 'c'].includes(k)) e.preventDefault()
    }
    document.addEventListener('contextmenu', blockContextMenu)
    document.addEventListener('selectstart', blockSelectStart)
    document.addEventListener('copy', blockCopy)
    document.addEventListener('keydown', blockKeys)
    return () => {
      document.removeEventListener('contextmenu', blockContextMenu)
      document.removeEventListener('selectstart', blockSelectStart)
      document.removeEventListener('copy', blockCopy)
      document.removeEventListener('keydown', blockKeys)
    }
  }, [])

  const selectedMensaje = useMemo(() => {
    if (!selectedKey) return null
    for (const section of FLOW) {
      const node = section.nodes.find(n => n.key === selectedKey)
      if (node?.matchFn) return PRODUCTO.mensajes.find(node.matchFn) || null
    }
    return null
  }, [selectedKey])

  return (
    <div style={{ minHeight: '100vh', background: '#f5f4f0', fontFamily: 'Nunito Sans, sans-serif', userSelect: 'none' }}>
      <div style={{ background: '#075E54', padding: '1.5rem 2rem' }}>
        <div style={{ maxWidth: 1300, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <span style={{ fontSize: '2rem' }}>{PRODUCTO.icono}</span>
            <div>
              <div style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.6)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                Notificaciones WhatsApp
              </div>
              <div style={{ fontSize: '1rem', fontWeight: 800, color: '#fff' }}>
                {PRODUCTO.nombre}
              </div>
            </div>
          </div>
          <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.5)', fontWeight: 600 }}>
            {PRODUCTO.mensajes.length} mensajes
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 1300, margin: '0 auto', padding: '2rem', display: 'grid', gridTemplateColumns: '300px 1fr', gap: '1.5rem', alignItems: 'start' }}>
        <div style={{ position: 'sticky', top: 24 }}>
          <div style={{ background: '#fff', borderRadius: 16, border: '1.5px solid #e8e5de', overflow: 'hidden' }}>
            <div style={{ padding: '0.875rem 1.25rem', borderBottom: '1px solid #f0ede8', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ fontSize: '0.68rem', fontWeight: 800, color: '#aaa', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                  Ciclo de vida del envío
                </div>
                <div style={{ fontSize: '0.78rem', color: '#888', marginTop: 2 }}>
                  Seleccioná un momento para ver el mensaje
                </div>
              </div>
              {selectedKey && (
                <button onClick={() => setSelectedKey(null)} style={{ background: 'none', border: '1.5px solid #e8e5de', borderRadius: 8, padding: '3px 10px', fontSize: '0.7rem', color: '#999', cursor: 'pointer' }}>
                  Limpiar
                </button>
              )}
            </div>
            <FlowList mensajes={PRODUCTO.mensajes} selectedKey={selectedKey} onSelect={setSelectedKey} />
          </div>
        </div>

        <div style={{ position: 'sticky', top: 24 }}>
          {selectedMensaje ? (
            <MensajePreview mensaje={selectedMensaje} />
          ) : (
            <div style={{ background: '#fff', borderRadius: 16, border: '1.5px solid #e8e5de', padding: '6rem 2rem', textAlign: 'center' }}>
              <div style={{ fontSize: '2.5rem', marginBottom: 12 }}>←</div>
              <div style={{ fontSize: '0.95rem', fontWeight: 700, color: '#555' }}>
                Seleccioná un momento del ciclo
              </div>
              <div style={{ fontSize: '0.82rem', color: '#aaa', marginTop: 6 }}>
                El mensaje aparecerá acá
              </div>
            </div>
          )}
        </div>
      </div>

      <div style={{ textAlign: 'center', padding: '2rem', fontSize: '0.72rem', color: '#bbb' }}>
        Andreani · Notificaciones WhatsApp · {PRODUCTO.nombre} · Contenido confidencial
      </div>
    </div>
  )
}

// ─── PAGE WRAPPER (gate + content) ───────────────────────────────────────────
export default function WhatsApp7View() {
  const [unlocked, setUnlocked] = useState(false)

  useEffect(() => {
    if (sessionStorage.getItem(SESSION_KEY) === '1') {
      setUnlocked(true)
    }
  }, [])

  if (!unlocked) {
    return <PasswordGate onUnlock={() => setUnlocked(true)} />
  }

  return <PreviewContent />
}
