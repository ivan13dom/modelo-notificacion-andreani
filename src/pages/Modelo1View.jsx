import { useState, useMemo, useEffect, useCallback } from 'react'
import { EMAIL_MODELOS } from '../data/emailModelos'

// ─── ACCESS TOKEN ─────────────────────────────────────────────────────────────
const ACCESS_TOKEN = 'W84C-TPYQ-4KKB'
const SESSION_KEY = 'andreani_preview_unlocked'

// ─── ETAPA META ───────────────────────────────────────────────────────────────
const ETAPA_META = {
  alta:         { label: 'Alta',         emoji: '📬', color: '#1a5f9c', bg: '#EAF3FB', border: '#b3d4f0', dot: '#378ADD' },
  en_camino:    { label: 'En camino',    emoji: '🚚', color: '#92600a', bg: '#FEF9EC', border: '#f5d97a', dot: '#BA7517' },
  visita:       { label: 'Visita',       emoji: '🏠', color: '#c25400', bg: '#FFF3EB', border: '#fdc08a', dot: '#D85A30' },
  entregado:    { label: 'Entregado',    emoji: '✅', color: '#1a6e2e', bg: '#EAF7EA', border: '#7dcf8a', dot: '#639922' },
  no_entregado: { label: 'No entregado', emoji: '❌', color: '#c8281e', bg: '#FAEAEA', border: '#f5b0ad', dot: '#E24B4A' },
  custodia:     { label: 'Custodia',     emoji: '🏪', color: '#6b21a8', bg: '#F5F0FF', border: '#c4a0f0', dot: '#7F77DD' },
  devolucion:   { label: 'Devolución',   emoji: '↩️', color: '#374151', bg: '#F3F4F6', border: '#c0c5ce', dot: '#888780' },
  retiro:       { label: 'Retiro',       emoji: '📦', color: '#0369a1', bg: '#EFF9FF', border: '#90d0f5', dot: '#378ADD' },
  otro:         { label: 'Operativa',    emoji: '⚙️', color: '#555555', bg: '#F4F4F4', border: '#cccccc', dot: '#888780' },
}

// ─── MODELO 1 FLOW ────────────────────────────────────────────────────────────
const MODELO1_SECTIONS = [
  {
    key: 'alta', label: 'Alta', emoji: '📬', nodes: [
      { key: 'alta_eda',     label: 'Con fecha estimada',             sub: 'EDA incluida en el mensaje',                 etapa: 'alta',        optional: false, matchFn: e => e.titulo === 'Estamos preparando tu envío' && /Con/i.test(e.regla) && /EDA/i.test(e.regla) },
      { key: 'alta_sin_eda', label: 'Sin fecha estimada',             sub: 'Sin predicción de entrega',                  etapa: 'alta',        optional: false, matchFn: e => e.titulo === 'Estamos preparando tu envío' && /Sin/i.test(e.regla) },
      { key: 'alta_multi',   label: 'Multibulto',                     sub: 'Varios envíos en un pedido',                 etapa: 'alta',        optional: false, matchFn: e => e.titulo === 'Estamos preparando tu envío' && /AltaAutomatica|AltaManual/i.test(e.regla) },
    ]
  },
  {
    key: 'en_camino', label: 'En camino', emoji: '🚚', nodes: [
      { key: 'inactividad',  label: 'Inactividad',                    sub: 'Si el envío se detiene entre etapas',        etapa: 'en_camino',   optional: true,  matchFn: e => /AvisoInactividad/i.test(e.regla) },
      { key: 'disculpa_eda', label: 'Pedimos disculpas',              sub: 'Demora respecto a la fecha prometida',       etapa: 'en_camino',   optional: true,  matchFn: e => /DisculpaEda/i.test(e.regla) },
      { key: 'dist_era',     label: 'ERA',                            sub: 'Predicción de rango horario',                etapa: 'en_camino',   optional: false, matchFn: e => /ERA.*mañana.*tarde|ERA.*tarde.*mañana/i.test(e.regla) },
      { key: 'dist_normal',  label: 'Distribución sin predicción',    sub: 'Hoy te visitaremos sin rango horario',       etapa: 'en_camino',   optional: false, matchFn: e => /Distribucion/i.test(e.regla) && !/ERA|ETA/i.test(e.regla) && /Hoy vamos/i.test(e.titulo) },
      { key: 'eta',          label: 'ETA',                            sub: 'Dentro de la próxima hora',                  etapa: 'en_camino',   optional: true,  matchFn: e => /ETA/i.test(e.regla) && /Hoy vamos/i.test(e.titulo) },
    ]
  },
  {
    key: 'visita', label: 'Visita', emoji: '🏠', nodes: [
      { key: 'no_visitado',   label: 'No visitado',                   sub: 'No se pasó por el domicilio · puede revisitar', etapa: 'visita',   optional: false, matchFn: e => /no pudimos visitarte/i.test(e.titulo) && /Rectificacion/i.test(e.regla) },
      { key: 'no_responde',   label: 'No responde',                   sub: 'Se tocó el timbre, no atendió · puede revisitar', etapa: 'visita', optional: false, matchFn: e => /no te encontramos/i.test(e.titulo) },
      { key: 'visita_fallida',label: 'Visita fallida',                sub: 'Dirección incorrecta, vacaciones, etc.',     etapa: 'visita',      optional: false, matchFn: e => e.titulo === 'No pudimos entregar tu envío' && /^Evento=Visita/i.test(e.regla) },
      { key: 'entregado_dom', label: 'Entregado',                     sub: 'En domicilio ✓',                             etapa: 'entregado',   optional: false, matchFn: e => /ya entregamos/i.test(e.titulo) && /VisitaMobile|^Evento=Visita/i.test(e.regla) },
    ]
  },
  {
    key: 'custodia', label: 'Custodia', emoji: '🏪', nodes: [
      { key: 'cust_sin_pin',  label: 'Disponible sin PIN',            sub: 'Retiro libre en sucursal',                   etapa: 'custodia',    optional: false, matchFn: e => /retirar/i.test(e.titulo) && /AsignacionACaja/i.test(e.regla) },
      { key: 'cust_con_pin',  label: 'Disponible con PIN',            sub: 'Requiere PIN para retirar',                  etapa: 'custodia',    optional: false, matchFn: e => /retirar/i.test(e.titulo) && /AsignacionACaja/i.test(e.regla) },
      { key: 'rec_sin_pin',   label: 'Recordatorio sin PIN',          sub: 'Cada 48hs durante 10 días',                  etapa: 'custodia',    optional: false, matchFn: e => /retirar/i.test(e.titulo) && /AvisoCustodia/i.test(e.regla) },
      { key: 'rec_con_pin',   label: 'Recordatorio con PIN',          sub: 'Cada 48hs durante 10 días',                  etapa: 'custodia',    optional: false, matchFn: e => /retirar/i.test(e.titulo) && /AvisoCustodia/i.test(e.regla) },
      { key: 'retirado',      label: 'Retirado',                      sub: 'Entregado en mostrador ✓',                   etapa: 'entregado',   optional: false, matchFn: e => /ya entregamos/i.test(e.titulo) && /Rectificacion/i.test(e.regla) },
    ]
  },
  {
    key: 'final', label: 'No entregado', emoji: '❌', nodes: [
      { key: 'no_entregado',  label: 'No entregado',                  sub: 'Venció el plazo o se ordenó devolución',     etapa: 'no_entregado', optional: false, matchFn: e => e.titulo === 'No pudimos entregar tu envío' && /EnvioNoEntregado/i.test(e.regla) },
      { key: 'rendido',       label: 'Envío rendido',                 sub: 'Ya devuelto al remitente',                   etapa: 'no_entregado', optional: false, matchFn: () => false },
      { key: 'siniestro',     label: 'Siniestro',                     sub: 'Pérdida o rotura · puede ocurrir en cualquier momento', etapa: 'no_entregado', optional: true, matchFn: e => /siniestro/i.test(e.regla) },
    ]
  },
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
            width: '100%', background: '#C8281E', color: '#fff', border: 'none',
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
function FlowList({ emails, selectedKey, onSelect }) {
  return (
    <div style={{ overflowY: 'auto', maxHeight: '70vh' }}>
      {MODELO1_SECTIONS.map((section, si) => {
        const meta = ETAPA_META[section.key] || ETAPA_META.otro
        return (
          <div key={section.key}>
            <div style={{
              padding: '12px 16px 6px',
              fontSize: '0.85rem', fontWeight: 800, color: meta.color,
              textTransform: 'uppercase', letterSpacing: '0.06em',
              display: 'flex', alignItems: 'center', gap: 7,
              borderTop: si > 0 ? '1px solid #f0ede8' : 'none',
              marginTop: si > 0 ? 4 : 0
            }}>
              <span style={{ fontSize: '1rem' }}>{section.emoji}</span><span>{section.label}</span>
            </div>
            {section.nodes.map(node => {
              const nodeMeta = ETAPA_META[node.etapa] || ETAPA_META.otro
              const matched = node.matchFn ? emails.find(node.matchFn) : null
              const isActive = selectedKey === node.key
              const hasEmail = !!matched
              return (
                <button key={node.key}
                  onClick={() => hasEmail && onSelect(node.key)}
                  disabled={!hasEmail}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 10,
                    width: '100%', textAlign: 'left', padding: '8px 16px',
                    border: 'none',
                    borderLeft: `3px solid ${isActive ? nodeMeta.color : 'transparent'}`,
                    background: isActive ? nodeMeta.bg : 'transparent',
                    cursor: hasEmail ? 'pointer' : 'default',
                    opacity: hasEmail ? 1 : 0.4, transition: 'all 0.12s'
                  }}
                  onMouseEnter={e => { if (hasEmail && !isActive) e.currentTarget.style.background = '#f9f8f6' }}
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
                  {hasEmail && <span style={{ fontSize: '0.72rem', color: isActive ? nodeMeta.color : '#ccc', flexShrink: 0 }}>→</span>}
                </button>
              )
            })}
          </div>
        )
      })}
    </div>
  )
}

// ─── EMAIL PREVIEW (protegido) ────────────────────────────────────────────────
function EmailPreview({ email }) {
  const meta = ETAPA_META[email.etapa] || ETAPA_META.otro
  return (
    <div>
      <div style={{
        background: '#fff', borderRadius: 12, border: '1.5px solid #e8e5de',
        padding: '0.875rem 1.25rem', display: 'flex', alignItems: 'center', gap: 10,
        marginBottom: '0.75rem'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, background: meta.bg, border: `1.5px solid ${meta.border}`, borderRadius: 100, padding: '4px 12px' }}>
          <span style={{ fontSize: '0.75rem' }}>{meta.emoji}</span>
          <span style={{ fontSize: '0.72rem', fontWeight: 800, color: meta.color }}>{meta.label}</span>
        </div>
        <div style={{ fontWeight: 700, color: '#1a1917', fontSize: '0.9rem' }}>{email.titulo}</div>
      </div>
      {/* Overlay invisible que bloquea selección directa del iframe sin afectar el scroll interno */}
      <div style={{ border: '1.5px solid #e8e5de', borderRadius: 16, overflow: 'hidden', background: '#fff', position: 'relative' }}>
        <div style={{ position: 'relative', height: 580, userSelect: 'none' }}>
          <iframe
            key={email.titulo + email.regla}
            srcDoc={email.html}
            title={email.titulo}
            style={{ width: '160%', height: '160%', border: 'none', transform: 'scale(0.625)', transformOrigin: '0 0', position: 'absolute', top: 0, left: 0, pointerEvents: 'none' }}
            sandbox="allow-same-origin"
          />
          {/* Capa transparente sobre el iframe: bloquea click derecho, selección y drag, sin bloquear el scroll de la página */}
          <div
            onContextMenu={e => e.preventDefault()}
            onMouseDown={e => e.preventDefault()}
            style={{ position: 'absolute', inset: 0, background: 'transparent', cursor: 'default' }}
          />
        </div>
      </div>
    </div>
  )
}

// ─── MAIN CONTENT (post-unlock) ───────────────────────────────────────────────
function PreviewContent() {
  const modelo = EMAIL_MODELOS.find(m => m.id === 1)
  const [selectedKey, setSelectedKey] = useState(null)

  // Bloqueo de clic derecho, selección, copiar, atajos de impresión/guardado/inspección
  useEffect(() => {
    const blockContextMenu = e => e.preventDefault()
    const blockSelectStart = e => e.preventDefault()
    const blockCopy = e => e.preventDefault()
    const blockKeys = e => {
      const k = e.key.toLowerCase()
      // Ctrl/Cmd + S, P, U, C ; F12 ; Ctrl+Shift+I/J/C
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

  const selectedEmail = useMemo(() => {
    if (!selectedKey) return null
    for (const section of MODELO1_SECTIONS) {
      const node = section.nodes.find(n => n.key === selectedKey)
      if (node?.matchFn) return modelo.emails.find(node.matchFn) || null
    }
    return null
  }, [selectedKey, modelo])

  if (!modelo) return null

  return (
    <div style={{ minHeight: '100vh', background: '#f5f4f0', fontFamily: 'Nunito Sans, sans-serif', userSelect: 'none' }}>

      <div style={{ background: '#C8281E', padding: '1.5rem 2rem' }}>
        <div style={{ maxWidth: 1300, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <img src="/Isologo_Andreani_rojo_sin_fondo.png"
              alt="Andreani"
              style={{ height: 32, filter: 'brightness(0) invert(1)' }}
              onError={e => e.target.style.display = 'none'}
            />
            <div style={{ width: 1, height: 28, background: 'rgba(255,255,255,0.3)' }} />
            <div>
              <div style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.6)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                Notificaciones Email
              </div>
              <div style={{ fontSize: '1rem', fontWeight: 800, color: '#fff' }}>
                Distribución general
              </div>
            </div>
          </div>
          <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.5)', fontWeight: 600 }}>
            {modelo.emails.length} templates · Modelo estándar
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
                  Seleccioná un momento para ver la notificación
                </div>
              </div>
              {selectedKey && (
                <button onClick={() => setSelectedKey(null)} style={{ background: 'none', border: '1.5px solid #e8e5de', borderRadius: 8, padding: '3px 10px', fontSize: '0.7rem', color: '#999', cursor: 'pointer' }}>
                  Limpiar
                </button>
              )}
            </div>
            <FlowList emails={modelo.emails} selectedKey={selectedKey} onSelect={setSelectedKey} />
          </div>
        </div>

        <div style={{ position: 'sticky', top: 24 }}>
          {selectedEmail ? (
            <EmailPreview email={selectedEmail} />
          ) : (
            <div style={{ background: '#fff', borderRadius: 16, border: '1.5px solid #e8e5de', padding: '6rem 2rem', textAlign: 'center' }}>
              <div style={{ fontSize: '2.5rem', marginBottom: 12 }}>←</div>
              <div style={{ fontSize: '0.95rem', fontWeight: 700, color: '#555' }}>
                Seleccioná un momento del ciclo
              </div>
              <div style={{ fontSize: '0.82rem', color: '#aaa', marginTop: 6 }}>
                La notificación aparecerá acá
              </div>
            </div>
          )}
        </div>
      </div>

      <div style={{ textAlign: 'center', padding: '2rem', fontSize: '0.72rem', color: '#bbb' }}>
        Andreani · Notificaciones Email · Distribución general · Contenido confidencial
      </div>
    </div>
  )
}

// ─── PAGE WRAPPER (gate + content) ───────────────────────────────────────────
export default function Modelo1PreviewPage() {
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
