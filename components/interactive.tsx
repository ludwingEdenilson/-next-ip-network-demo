'use client'

import { FormEvent, useState } from 'react'
import { Check, ChevronDown, Send } from 'lucide-react'

export function FAQ({ items }: { items: { question: string; answer: string }[] }) {
  const [active, setActive] = useState<number | null>(null)
  return <div className="faq-list">{items.map((item, index) => <div className="faq-item" key={item.question}><button className="faq-question" aria-expanded={active === index} onClick={() => setActive(active === index ? null : index)}>{item.question}<ChevronDown size={18} className={active === index ? 'chevron rotated' : 'chevron'} /></button><div className={active === index ? 'faq-answer open' : 'faq-answer'}><p>{item.answer}</p></div></div>)}</div>
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
    if (!email || !/^\S+@\S+\.\S+$/.test(email)) next.email = 'Introduce un email válido.'
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
        Email
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
