import React from 'react'
import { TrendingUp, TrendingDown, AlertTriangle, Users, DollarSign, Zap } from 'lucide-react'

function fmt(val, currency, fxRate, type = 'currency') {
  const v = currency === 'NGN' ? val * fxRate : val
  if (type === 'currency') {
    const sym = currency === 'NGN' ? '₦' : '$'
    if (Math.abs(v) >= 1000000) return sym + (v / 1000000).toFixed(1) + 'M'
    if (Math.abs(v) >= 1000)    return sym + (v / 1000).toFixed(0) + 'k'
    return sym + Math.round(v)
  }
  if (type === 'pct') return (val * 100).toFixed(1) + '%'
  return v.toLocaleString()
}

function PrimaryCard({ label, value, sub, color, icon: Icon, flag }) {
  const colors = {
    red:   { bg: 'bg-red-50 border-red-100',   val: 'text-red-700',   sub: 'text-red-400' },
    amber: { bg: 'bg-amber-50 border-amber-100', val: 'text-amber-700', sub: 'text-amber-400' },
    green: { bg: 'bg-green-50 border-green-100', val: 'text-green-700', sub: 'text-green-400' },
    gray:  { bg: 'bg-white border-gray-100',     val: 'text-gray-900',  sub: 'text-gray-400' },
  }
  const c = colors[color] || colors.gray
  return (
    <div className={`rounded-xl border-2 p-5 ${c.bg}`}>
      <div className="flex items-start justify-between mb-3">
        <p className="text-xs font-medium text-gray-500 leading-tight">{label}</p>
        {Icon && <Icon size={15} className="text-gray-300 mt-0.5 flex-shrink-0" />}
      </div>
      <p className={`text-3xl font-semibold tracking-tight ${c.val}`}>{value}</p>
      {sub  && <p className={`text-xs mt-1.5 ${c.sub}`}>{sub}</p>}
      {flag && (
        <div className="mt-2 flex items-center gap-1">
          <AlertTriangle size={10} className="text-amber-500" />
          <span className="text-xs text-amber-600">{flag}</span>
        </div>
      )}
    </div>
  )
}

function SecondaryCard({ label, value, sub, icon: Icon }) {
  return (
    <div className="rounded-xl border border-gray-100 bg-white p-4">
      <div className="flex items-start justify-between mb-2">
        <p className="text-xs text-gray-400 leading-tight">{label}</p>
        {Icon && <Icon size={13} className="text-gray-200 mt-0.5 flex-shrink-0" />}
      </div>
      <p className="text-xl font-semibold text-gray-900 tracking-tight">{value}</p>
      {sub && <p className="text-xs text-gray-400 mt-1">{sub}</p>}
    </div>
  )
}

export default function ExecutiveSummary({ portfolio, currency, fxRate }) {
  const { totalRevenue, totalCost, grossMargin, portfolioMargin,
          portfolioBuffer, totalLeakage, totalBillable, totalActual } = portfolio

  const bufferColor  = portfolioBuffer > 0.3 ? 'red' : portfolioBuffer > 0.2 ? 'amber' : 'green'
  const leakageColor = totalLeakage > 20000 ? 'amber' : 'gray'
  const problems     = portfolio.rows.filter(r => r.buffer > 0.3).length

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div>
            <p className="text-xs text-gray-400">Small projects portfolio</p>
          </div>
        </div>
        <div className="flex gap-2">
          <span className="text-xs bg-blue-50 text-blue-600 px-2.5 py-1 rounded-full font-medium">{totalBillable} billable</span>
          <span className="text-xs bg-orange-50 text-orange-600 px-2.5 py-1 rounded-full font-medium">{totalActual} actual</span>
          <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${problems > 4 ? 'bg-red-50 text-red-600' : 'bg-amber-50 text-amber-600'}`}>{problems} problem projects</span>
        </div>
      </div>

      {/* Primary cards — the two numbers that matter most */}
      <div className="grid grid-cols-2 gap-3 mb-3">
        <PrimaryCard
          label="Portfolio buffer"
          value={fmt(portfolioBuffer, currency, fxRate, 'pct')}
          sub={`${totalActual - totalBillable} excess heads · target ≤20%`}
          icon={Users}
          color={bufferColor}
          flag={portfolioBuffer > 0.25 ? 'Above 20% target' : null}
        />
        <PrimaryCard
          label="Revenue leakage"
          value={fmt(totalLeakage, currency, fxRate)}
          sub="Unbilled capacity per month"
          icon={Zap}
          color={leakageColor}
        />
      </div>

      {/* Secondary cards */}
      <div className="grid grid-cols-4 gap-3 mb-6">
        <SecondaryCard
          label="Monthly revenue"
          value={fmt(totalRevenue, currency, fxRate)}
          sub="Billable heads only"
          icon={TrendingUp}
        />
        <SecondaryCard
          label="Total cost"
          value={fmt(totalCost, currency, fxRate)}
          sub="Incl. CTC & overhead"
          icon={TrendingDown}
        />
        <SecondaryCard
          label="Gross margin"
          value={fmt(grossMargin, currency, fxRate)}
          sub={fmt(portfolioMargin, currency, fxRate, 'pct') + ' margin'}
          icon={DollarSign}
        />
        <SecondaryCard
          label="Problem projects"
          value={problems}
          sub="Buffer above 30%"
          icon={AlertTriangle}
        />
      </div>
    </div>
  )
}
