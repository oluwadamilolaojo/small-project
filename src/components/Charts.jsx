import React from 'react'
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  ReferenceLine, Cell, LabelList
} from 'recharts'

const BUFFER_COLORS = {
  critical: '#ef4444',
  high:     '#f97316',
  moderate: '#eab308',
  ok:       '#22c55e',
}

function bufferColor(buf) {
  if (buf > 0.5)  return BUFFER_COLORS.critical
  if (buf > 0.3)  return BUFFER_COLORS.high
  if (buf > 0.15) return BUFFER_COLORS.moderate
  return BUFFER_COLORS.ok
}

function CustomBufferTooltip({ active, payload }) {
  if (!active || !payload?.length) return null
  const d = payload[0].payload
  return (
    <div className="bg-white border border-gray-100 rounded-lg shadow-lg p-2.5 text-xs">
      <p className="font-semibold text-gray-800 mb-1">{d.name}</p>
      <p className="text-gray-500">Buffer: <span className="font-medium text-gray-800">{Math.round(d.buffer * 100)}%</span></p>
      <p className="text-gray-500">Excess: <span className="font-medium text-gray-800">{d.excessHeads} heads</span></p>
      <p className="text-gray-500">Leakage: <span className="font-medium text-amber-600">${Math.round(d.leakage).toLocaleString()}</span></p>
    </div>
  )
}

function CustomMarginTooltip({ active, payload }) {
  if (!active || !payload?.length) return null
  const d = payload[0].payload
  return (
    <div className="bg-white border border-gray-100 rounded-lg shadow-lg p-2.5 text-xs">
      <p className="font-semibold text-gray-800 mb-1">{d.name}</p>
      <p className="text-gray-500">Revenue: <span className="font-medium text-gray-800">${Math.round(d.revenue).toLocaleString()}</span></p>
      <p className="text-gray-500">Margin: <span className="font-medium text-green-600">{Math.round(d.marginPct * 100)}%</span></p>
    </div>
  )
}

export default function Charts({ computed }) {
  const bufferData = [...computed]
    .filter(r => r.actualHeads > 0)
    .sort((a, b) => b.buffer - a.buffer)
    .map(r => ({
      name:        r.name.length > 12 ? r.name.slice(0, 12) + '…' : r.name,
      fullName:    r.name,
      buffer:      r.buffer,
      excessHeads: r.actualHeads - r.billableHeads,
      leakage:     r.leakage,
    }))

  const revenueData = [...computed]
    .filter(r => r.revenue > 0)
    .sort((a, b) => b.revenue - a.revenue)
    .map(r => ({
      name:      r.name.length > 12 ? r.name.slice(0, 12) + '…' : r.name,
      revenue:   r.revenue,
      marginPct: r.marginPct,
    }))

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">

      {/* Buffer waterfall */}
      <div className="bg-white rounded-xl border border-gray-100 p-5">
        <h3 className="text-sm font-semibold text-gray-900 mb-0.5">Buffer by project</h3>
        <p className="text-xs text-gray-400 mb-4">Sorted by buffer %. Red = critical (&gt;50%), orange = high (&gt;30%)</p>
        <ResponsiveContainer width="100%" height={260}>
          <BarChart data={bufferData} layout="vertical" margin={{ left: 8, right: 40, top: 0, bottom: 0 }}>
            <XAxis type="number" tickFormatter={v => `${Math.round(v*100)}%`} tick={{ fontSize: 10, fill: '#9ca3af' }} axisLine={false} tickLine={false} domain={[0, 'auto']}/>
            <YAxis type="category" dataKey="name" tick={{ fontSize: 10, fill: '#6b7280' }} axisLine={false} tickLine={false} width={80}/>
            <Tooltip content={<CustomBufferTooltip/>}/>
            <ReferenceLine x={0.2} stroke="#d1d5db" strokeDasharray="4 2" label={{ value: '20%', position: 'top', fontSize: 9, fill: '#9ca3af' }}/>
            <Bar dataKey="buffer" radius={[0, 4, 4, 0]} maxBarSize={16}>
              {bufferData.map((entry, i) => (
                <Cell key={i} fill={bufferColor(entry.buffer)}/>
              ))}
              <LabelList dataKey="buffer" position="right" formatter={v => `${Math.round(v*100)}%`} style={{ fontSize: 10, fill: '#6b7280' }}/>
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Revenue by project */}
      <div className="bg-white rounded-xl border border-gray-100 p-5">
        <h3 className="text-sm font-semibold text-gray-900 mb-0.5">Revenue by project</h3>
        <p className="text-xs text-gray-400 mb-4">Monthly revenue from billable headcount</p>
        <ResponsiveContainer width="100%" height={260}>
          <BarChart data={revenueData} layout="vertical" margin={{ left: 8, right: 55, top: 0, bottom: 0 }}>
            <XAxis type="number" tickFormatter={v => `$${(v/1000).toFixed(0)}k`} tick={{ fontSize: 10, fill: '#9ca3af' }} axisLine={false} tickLine={false}/>
            <YAxis type="category" dataKey="name" tick={{ fontSize: 10, fill: '#6b7280' }} axisLine={false} tickLine={false} width={80}/>
            <Tooltip content={<CustomMarginTooltip/>}/>
            <Bar dataKey="revenue" fill="#111827" radius={[0, 4, 4, 0]} maxBarSize={16}>
              <LabelList dataKey="revenue" position="right" formatter={v => `$${(v/1000).toFixed(1)}k`} style={{ fontSize: 10, fill: '#6b7280' }}/>
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

    </div>
  )
}
