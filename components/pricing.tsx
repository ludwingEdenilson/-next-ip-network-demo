'use client'

import { createContext, useContext, useId, useState } from 'react'
import type { ReactNode } from 'react'

type BillingPeriod = 'monthly' | 'annual'

const BillingPeriodContext = createContext<BillingPeriod>('monthly')

export function PricingPeriod({ children }: { children: ReactNode }) {
  const [period, setPeriod] = useState<BillingPeriod>('monthly')
  const groupName = useId()

  return <BillingPeriodContext.Provider value={period}>
    <div className="pricing-controls">
      <fieldset className="pricing-fieldset">
        <legend className="pricing-legend">Periodo de facturación</legend>
        <div className={`billing-switch ${period === 'annual' ? 'is-annual' : ''}`}>
          <span className="billing-switch-thumb" aria-hidden="true" />
          <label className="billing-option">
            <input type="radio" name={groupName} value="monthly" checked={period === 'monthly'} onChange={() => setPeriod('monthly')} />
            <span>Mensual</span>
          </label>
          <label className="billing-option">
            <input type="radio" name={groupName} value="annual" checked={period === 'annual'} onChange={() => setPeriod('annual')} />
            <span>Anual</span>
          </label>
        </div>
      </fieldset>
      {period === 'annual' && <span className="discount-badge" role="status">Ahorra 15% al año</span>}
    </div>
    {children}
  </BillingPeriodContext.Provider>
}

export function PlanPrice({ basePrice }: { basePrice: number }) {
  const period = useContext(BillingPeriodContext)
  const originalPrice = basePrice.toFixed(2)
  const annualPrice = (Math.round(basePrice * 85) / 100).toFixed(2)
  const currentPrice = period === 'annual' ? annualPrice : originalPrice

  return <div className="plan-price" data-base-price={originalPrice} data-billing-period={period}>
    {period === 'annual' && <del className="price-original">${originalPrice}</del>}
    <strong className="price-current" key={period} aria-live="polite" aria-atomic="true">${currentPrice}</strong>
    <span>/mes</span>
  </div>
}