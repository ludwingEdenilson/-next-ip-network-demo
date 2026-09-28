'use client'

import Link from 'next/link'
import { useState } from 'react'
import { ArrowRight, Check, ChevronDown, Headphones, Mail, MapPin, Phone, Signal, Wifi } from 'lucide-react'

export function Logo() {
  return <Link className="brand" href="/" aria-label="Next IP Network, inicio"><span className="brand-mark"><Signal size={19} strokeWidth={2.5} /></span><span>next <b>ip</b></span></Link>
}

export function Header({ active }: { active: 'inicio' | 'planes' | 'contacto' }) {
  const [open, setOpen] = useState(false)
  return <header className="site-header"><div className="container header-inner"><Logo /><button className="menu-toggle" aria-label="Abrir menú" aria-expanded={open} onClick={() => setOpen(!open)}><span /><span /><span /></button><nav className={open ? 'main-nav open' : 'main-nav'} aria-label="Navegación principal"><Link className={active === 'inicio' ? 'active' : ''} href="/" onClick={() => setOpen(false)}>Inicio</Link><Link className={active === 'planes' ? 'active' : ''} href="/planes" onClick={() => setOpen(false)}>Planes</Link><Link className={active === 'contacto' ? 'active' : ''} href="/contacto" onClick={() => setOpen(false)}>Contacto</Link><Link className="nav-cta" href="/contacto" onClick={() => setOpen(false)}>Habla con nosotros <ArrowRight size={16} /></Link></nav></div></header>
}

export function Footer() {
  return <footer className="site-footer"><div className="container footer-grid"><div><Logo /><p className="footer-note">Conectamos lo que importa para que tu mundo nunca se detenga.</p></div><div><h3>Explora</h3><Link href="/">Inicio</Link><Link href="/planes">Planes</Link><Link href="/contacto">Contacto</Link></div><div><h3>Ayuda</h3><Link href="/contacto#faq">Preguntas frecuentes</Link></div><div><h3>Contacto</h3><a href="tel:900123456"><Phone size={15} /> 900 123 456</a><a href="mailto:hola@nextip.network"><Mail size={15} /> hola@nextip.network</a></div></div><div className="container footer-bottom"><span>© <span id="current-year">{new Date().getFullYear()}</span> Next IP Network</span><span>Conectividad con propósito.</span></div></footer>
}

export function PageShell({ children, active }: { children: React.ReactNode; active: 'inicio' | 'planes' | 'contacto' }) {
  return <><Header active={active} /><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({ '@context': 'https://schema.org', '@type': 'Organization', name: 'Next IP Network', url: 'https://nextip.network', email: 'hola@nextip.network', telephone: '+34900123456' }) }} />{children}<Footer /></>
}

export const CheckItem = ({ children }: { children: React.ReactNode }) => <li><span className="check"><Check size={13} /></span>{children}</li>
export const ContactIcon = ({ type }: { type: 'phone' | 'mail' | 'map' }) => type === 'phone' ? <Phone /> : type === 'mail' ? <Mail /> : <MapPin />
export const SupportBadge = () => <span className="support-badge"><Headphones size={15} /> Soporte 24/7</span>
export const WifiIcon = () => <span className="icon-chip"><Wifi size={20} /></span>
export const Chevron = ({ open }: { open: boolean }) => <ChevronDown className={open ? 'chevron rotated' : 'chevron'} size={18} />
