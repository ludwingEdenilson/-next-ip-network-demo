'use client'

import { FormEvent, useEffect, useRef, useState } from 'react'
import { Check, CheckCircle2, ChevronDown, LoaderCircle, MessageCircle, Search, Send, X, XCircle } from 'lucide-react'

export function FAQ({ items }: { items: { question: string; answer: string }[] }) {
  const [active, setActive] = useState<number | null>(null)
  return <div className="faq-list">{items.map((item, index) => <div className="faq-item" key={item.question}><button className="faq-question" aria-expanded={active === index} onClick={() => setActive(active === index ? null : index)}>{item.question}<ChevronDown size={18} className={active === index ? 'chevron rotated' : 'chevron'} /></button><div className={active === index ? 'faq-answer open' : 'faq-answer'}><p>{item.answer}</p></div></div>)}</div>
}

const WHATSAPP_PROMPT_KEY = 'next-ip-whatsapp-prompt-seen'

const DEMO_COVERAGE_AREAS = [
  { city: 'San Salvador', postalCode: '1101' },
  { city: 'Soyapango', postalCode: '1116' },
  { city: 'Mejicanos', postalCode: '1120' },
  { city: 'Apopa', postalCode: '1123' },
  { city: 'Santa Tecla', postalCode: '1501' },
  { city: 'Antiguo Cuscatlán', postalCode: '1502' },
  { city: 'Ahuachapán', postalCode: '2101' },
  { city: 'Santa Ana', postalCode: '2201' },
  { city: 'Sonsonate', postalCode: '2301' },
  { city: 'San Miguel', postalCode: '3301' },
  { city: 'Usulután', postalCode: '3401' },
]

function normalizeCoverageValue(value: string) {
  return value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().trim()
}

async function lookupCoverage(value: string) {
  await new Promise(resolve => window.setTimeout(resolve, 1400))
  const normalizedValue = normalizeCoverageValue(value)
  return DEMO_COVERAGE_AREAS.find(area =>
    area.postalCode === normalizedValue || normalizeCoverageValue(area.city) === normalizedValue,
  ) ?? null
}

export function CoverageChecker() {
  const [isOpen, setIsOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [status, setStatus] = useState<'idle' | 'checking' | 'covered' | 'unavailable'>('idle')
  const [resultCity, setResultCity] = useState('')
  const [queryError, setQueryError] = useState('')
  const [email, setEmail] = useState('')
  const [emailError, setEmailError] = useState('')
  const [emailNotice, setEmailNotice] = useState('')
  const rootRef = useRef<HTMLDivElement>(null)
  const triggerRef = useRef<HTMLButtonElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (!isOpen) return
    inputRef.current?.focus()

    function closeOnOutsideClick(event: PointerEvent) {
      if (!rootRef.current?.contains(event.target as Node)) setIsOpen(false)
    }
    function closeOnEscape(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setIsOpen(false)
        triggerRef.current?.focus()
      }
    }

    document.addEventListener('pointerdown', closeOnOutsideClick)
    document.addEventListener('keydown', closeOnEscape)
    return () => {
      document.removeEventListener('pointerdown', closeOnOutsideClick)
      document.removeEventListener('keydown', closeOnEscape)
    }
  }, [isOpen])

  async function submitCoverage(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const trimmedQuery = query.trim()
    const isPostalCode = /^\d+$/.test(trimmedQuery)

    if (!trimmedQuery) {
      setQueryError('Ingresa una ciudad o código postal.')
      setStatus('idle')
      return
    }
    if (isPostalCode && !/^\d{4}$/.test(trimmedQuery)) {
      setQueryError('El código postal de El Salvador debe tener 4 dígitos.')
      setStatus('idle')
      return
    }
    if (!isPostalCode && normalizeCoverageValue(trimmedQuery).replace(/[^a-z]/g, '').length < 3) {
      setQueryError('Ingresa una ciudad con al menos 3 letras.')
      setStatus('idle')
      return
    }

    setQueryError('')
    setEmailError('')
    setEmailNotice('')
    setStatus('checking')
    const result = await lookupCoverage(trimmedQuery)
    setResultCity(result?.city ?? trimmedQuery)
    setStatus(result ? 'covered' : 'unavailable')
  }

  function submitEmail(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!/^\S+@\S+\.\S+$/.test(email.trim())) {
      setEmailError('Ingresa un correo electrónico válido.')
      setEmailNotice('')
      return
    }
    setEmailError('')
    setEmailNotice('Correo válido. En esta demo no se guarda ni se envía el aviso.')
  }

  const whatsappHref = `https://wa.me/50377777777?text=${encodeURIComponent(`Hola, quisiera consultar cobertura en ${resultCity}.`)}`

  return (
    <div className="coverage-nav" ref={rootRef}>
      <span className="coverage-nav-label">Verifica si tenemos servicio en tu ciudad</span>
      <button
        ref={triggerRef}
        className="coverage-nav-trigger"
        type="button"
        aria-label="Buscar cobertura por ciudad o código postal"
        aria-expanded={isOpen}
        aria-controls="coverage-panel"
        onClick={() => setIsOpen(!isOpen)}
      >
        <Search size={18} aria-hidden="true" />
      </button>
      {isOpen && <section className="coverage-panel" id="coverage-panel" aria-labelledby="coverage-panel-title">
        <h2 className="coverage-panel-title" id="coverage-panel-title">Ingresa tu zona</h2>
        <form className="coverage-form" onSubmit={submitCoverage} noValidate aria-busy={status === 'checking'}>
          <label className="coverage-visually-hidden" htmlFor="coverage-query">Ciudad o código postal</label>
          <input
            ref={inputRef}
            id="coverage-query"
            className="coverage-input"
            type="text"
            autoComplete="address-level2"
            maxLength={80}
            placeholder="Ciudad o código postal"
            value={query}
            onChange={event => {
              setQuery(event.target.value)
              setQueryError('')
              if (status !== 'checking') setStatus('idle')
            }}
            aria-invalid={Boolean(queryError)}
            aria-describedby={queryError ? 'coverage-query-error' : undefined}
            disabled={status === 'checking'}
          />
          <button className="coverage-search-submit" type="submit" aria-label="Consultar cobertura" disabled={status === 'checking'}>
            {status === 'checking' ? <LoaderCircle className="coverage-spinner" size={18} aria-hidden="true" /> : <Search size={18} aria-hidden="true" />}
          </button>
        </form>
        {queryError && <p className="coverage-error" id="coverage-query-error" role="alert" aria-live="assertive">{queryError}</p>}
        <div className="coverage-feedback" role="status" aria-live="polite" aria-atomic="true">
          {status === 'checking' && <span className="coverage-message"><LoaderCircle className="coverage-spinner" size={18} aria-hidden="true" /> Estamos verificando tu zona...</span>}
          {status === 'covered' && <div className="coverage-result"><span className="coverage-message"><CheckCircle2 size={19} aria-hidden="true" /> Sí tenemos cobertura en {resultCity}</span><a className="button button-primary coverage-whatsapp" href={whatsappHref} target="_blank" rel="noreferrer"><MessageCircle size={16} aria-hidden="true" /> Consultar por WhatsApp</a></div>}
          {status === 'unavailable' && <>
            <span className="coverage-message coverage-message-error"><XCircle size={19} aria-hidden="true" /> Aún no llegamos a tu zona</span>
            <p className="coverage-email-prompt">Déjanos tu correo y te avisaremos cuando haya cobertura en tu ciudad.</p>
            <form className="coverage-email-form" onSubmit={submitEmail} noValidate>
              <label className="coverage-visually-hidden" htmlFor="coverage-email">Correo electrónico</label>
              <input
                id="coverage-email"
                className="coverage-input"
                type="email"
                autoComplete="email"
                placeholder="Tu correo electrónico"
                value={email}
                onChange={event => {
                  setEmail(event.target.value)
                  setEmailError('')
                  setEmailNotice('')
                }}
                aria-invalid={Boolean(emailError)}
                aria-describedby={emailError ? 'coverage-email-error' : undefined}
              />
              <button className="coverage-email-submit" type="submit" aria-label="Solicitar aviso de cobertura" title="Solicitar aviso"><Check size={18} aria-hidden="true" /></button>
              {emailError && <span className="coverage-error" id="coverage-email-error" role="alert" aria-live="assertive">{emailError}</span>}
              {emailNotice && <span className="coverage-note" aria-live="polite">{emailNotice}</span>}
            </form>
          </>}
        </div>
      </section>}
    </div>
  )
}

export function WhatsAppWidget() {
  const [showPrompt, setShowPrompt] = useState(false)

  useEffect(() => {
    if (window.sessionStorage.getItem(WHATSAPP_PROMPT_KEY)) return

    const timer = window.setTimeout(() => {
      if (window.sessionStorage.getItem(WHATSAPP_PROMPT_KEY)) return
      window.sessionStorage.setItem(WHATSAPP_PROMPT_KEY, 'true')
      setShowPrompt(true)
    }, 5000)

    return () => window.clearTimeout(timer)
  }, [])

  function dismissPrompt() {
    window.sessionStorage.setItem(WHATSAPP_PROMPT_KEY, 'true')
    setShowPrompt(false)
  }

  return <>
    {showPrompt && <div className="whatsapp-prompt" role="status"><span>¿Dudas con tu cobertura? Habla con un asesor 👋</span><button className="whatsapp-prompt-close" type="button" aria-label="Cerrar mensaje" onClick={dismissPrompt}><X size={16} /></button></div>}
    <button className="whatsapp-float" type="button" aria-label="WhatsApp" onClick={dismissPrompt}><MessageCircle size={28} strokeWidth={2.2} /></button>
  </>
}

export function ContactForm({ initialPlan = '' }: { initialPlan?: string }) {
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent'>('idle')
  const [errors, setErrors] = useState<Record<string, string>>({})
  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const data = new FormData(event.currentTarget)
    const next: Record<string, string> = {}
    const name = String(data.get('name') || '').trim()
    const email = String(data.get('email') || '').trim()
    const message = String(data.get('message') || '').trim()

    if (!name) next.name = 'Escribe tu nombre.'
    if (!email || !/^\S+@\S+\.\S+$/.test(email)) next.email = 'Ingresa un correo válido.'
    if (message.length < 10) next.message = 'Cuéntanos un poco más (mínimo 10 caracteres).'

    setErrors(next)
    if (Object.keys(next).length > 0) {
      setStatus('idle')
      return
    }

    setStatus('sending')
    window.setTimeout(() => setStatus('sent'), 1500)
  }

  return (
    <form className="contact-form" id="formulario" onSubmit={submit} noValidate aria-busy={status === 'sending'}>
      <label htmlFor="name">
        Nombre
        <input
          id="name"
          name="name"
          autoComplete="name"
          aria-invalid={Boolean(errors.name)}
          aria-describedby={errors.name ? 'name-error' : undefined}
          className={errors.name ? 'has-error' : ''}
          disabled={status !== 'idle'}
        />
        {errors.name && <span className="field-error" id="name-error">{errors.name}</span>}
      </label>
      <label htmlFor="email">
        Correo electrónico
        <input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          aria-invalid={Boolean(errors.email)}
          aria-describedby={errors.email ? 'email-error' : undefined}
          className={errors.email ? 'has-error' : ''}
          disabled={status !== 'idle'}
        />
        {errors.email && <span className="field-error" id="email-error">{errors.email}</span>}
      </label>
      <label htmlFor="plan">
        Plan de interés
        <select id="plan" name="plan" defaultValue={initialPlan} disabled={status !== 'idle'}>
          <option value="">Selecciona un plan</option>
          <option value="esencial">Esencial · 300 Mb</option>
          <option value="conecta">Conecta · 600 Mb</option>
          <option value="ultra">Ultra · 1 Gb</option>
        </select>
      </label>
      <label htmlFor="message">
        ¿En qué podemos ayudarte?
        <textarea
          id="message"
          name="message"
          rows={5}
          aria-invalid={Boolean(errors.message)}
          aria-describedby={errors.message ? 'message-error' : undefined}
          className={errors.message ? 'has-error' : ''}
          disabled={status !== 'idle'}
        />
        {errors.message && <span className="field-error" id="message-error">{errors.message}</span>}
      </label>
      {status !== 'idle' && (
        <div className={`contact-send-status ${status}`} role="status" aria-live="polite">
          {status === 'sending' ? (
            <span className="send-waves" aria-hidden="true"><span /></span>
          ) : (
            <Check size={20} aria-hidden="true" />
          )}
          <span>
            {status === 'sending'
              ? 'Validando tus datos y simulando el envío...'
              : 'Envío simulado confirmado. Tus datos superaron la validación.'}
          </span>
        </div>
      )}
      <button className="button button-primary" type="submit" disabled={status !== 'idle'}>
        {status === 'idle' ? 'Enviar mensaje' : status === 'sending' ? 'Enviando...' : 'Envío confirmado'}
        {status === 'sent' ? <Check size={16} /> : <Send size={16} />}
      </button>
    </form>
  )
}
