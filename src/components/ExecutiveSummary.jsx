import React from 'react'
import { TrendingUp, TrendingDown, AlertTriangle, Users, DollarSign, Zap } from 'lucide-react'

function fmt(val, currency, fxRate, type = 'currency') {
  const v = currency === 'NGN' ? val * fxRate : val
  if (type === 'currency') return (currency === 'NGN' ? '₦' : '$') + v.toLocaleString('en-US', { maximumFractionDigits: 0 })
  if (type === 'pct') return (val * 100).toFixed(1) + '%'
  return v.toLocaleString()
}

function MetricCard({ label, value, sub, color = 'gray', icon: Icon, flag }) {
  const colors = {
    gray:   'bg-white border-gray-100',
    red:    'bg-red-50 border-red-100',
    green:  'bg-green-50 border-green-100',
    amber:  'bg-amber-50 border-amber-100',
  }
  const textColors = {
    gray:  'text-gray-900',
    red:   'text-red-700',
    green: 'text-green-700',
    amber: 'text-amber-700',
  }
  return (
    <div className={`rounded-xl border p-4 ${colors[color]}`}>
      <div className="flex items-start justify-between mb-2">
        <p className="text-xs text-gray-500 leading-tight">{label}</p>
        {Icon && <Icon size={14} className="text-gray-300 mt-0.5" />}
      </div>
      <p className={`text-2xl font-semibold tracking-tight ${textColors[color]}`}>{value}</p>
      {sub && <p className="text-xs text-gray-400 mt-1">{sub}</p>}
      {flag && (
        <div className="mt-2 flex items-center gap-1">
          <AlertTriangle size={10} className="text-amber-500" />
          <span className="text-xs text-amber-600">{flag}</span>
        </div>
      )}
    </div>
  )
}

export default function ExecutiveSummary({ portfolio, currency, fxRate }) {
  const { totalRevenue, totalCost, grossMargin, portfolioMargin, portfolioBuffer,
          totalLeakage, totalBillable, totalActual } = portfolio

  const bufferColor  = portfolioBuffer > 0.3 ? 'red' : portfolioBuffer > 0.2 ? 'amber' : 'green'
  const marginColor  = portfolioMargin < 0.7 ? 'amber' : 'green'

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-base font-semibold text-gray-900">Executive Summary</h2>
          <p className="text-xs text-gray-400">Small projects portfolio · March 2026</p>
        </div>
        <div className="flex gap-2">
          <span className="text-xs bg-gray-100 text-gray-500 px-2 py-1 rounded-full">{totalBillable} billable</span>
          <span className="text-xs bg-gray-100 text-gray-500 px-2 py-1 rounded-full">{totalActual} actual</span>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3 mb-6">
        <MetricCard
          label="Monthly Revenue"
          value={fmt(totalRevenue, currency, fxRate)}
          sub="Billable heads only"
          icon={TrendingUp}
          color="gray"
        />
        <MetricCard
          label="Total Cost"
          value={fmt(totalCost, currency, fxRate)}
          sub="Incl. CTC & overhead"
          icon={TrendingDown}
          color="gray"
        />
        <MetricCard
          label="Gross Margin"
          value={fmt(grossMargin, currency, fxRate)}
          sub={fmt(portfolioMargin, currency, fxRate, 'pct') + ' margin'}
          icon={DollarSign}
          color={marginColor}
        />
        <MetricCard
          label="Portfolio Buffer"
          value={fmt(portfolioBuffer, currency, fxRate, 'pct')}
          sub={`${totalActual - totalBillable} excess heads`}
          icon={Users}
          color={bufferColor}
          flag={portfolioBuffer > 0.25 ? 'Above 20% target' : null}
        />
        <MetricCard
          label="Revenue Leakage"
          value={fmt(totalLeakage, currency, fxRate)}
          sub="Unbilled capacity / mo"
          icon={Zap}
          color={totalLeakage > 10000 ? 'amber' : 'gray'}
        />
        <MetricCard
          label="Problem Projects"
          value={portfolio.rows.filter(r => r.buffer > 0.3).length}
          sub="Buffer above 30%"
          icon={AlertTriangle}
          color={portfolio.rows.filter(r => r.buffer > 0.3).length > 4 ? 'red' : 'amber'}
        />
      </div>
    </div>
  )
}
