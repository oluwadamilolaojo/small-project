import React from 'react'

function bufferColor(buf) {
  if (buf > 0.5)  return '#ef4444'
  if (buf > 0.3)  return '#f97316'
  if (buf > 0.15) return '#eab308'
  return '#22c55e'
}

function fmtMoney(v) {
  if (v >= 1000) return '$' + (v / 1000).toFixed(0) + 'k'
  return '$' + Math.round(v)
}

export default function Charts({ computed }) {
  const bufferData = [...computed]
    .filter(r => r.actualHeads > 0)
    .sort((a, b) => b.buffer - a.buffer)

  const revenueData = [...computed]
    .filter(r => r.revenue > 0)
    .sort((a, b) => b.revenue - a.revenue)

  const maxBuf = Math.max(...bufferData.map(r => r.buffer), 0.01)
  const maxRev = Math.max(...revenueData.map(r => r.revenue), 1)
  const refPct = Math.round(0.2 / maxBuf * 100)

  return (
    <div className="space-y-4">

      {/* Buffer chart — full width */}
      <div className="bg-white rounded-xl border border-gray-100 p-6">
        <div className="flex items-start justify-between mb-1">
          <h3 className="text-sm font-semibold text-gray-900">Buffer by project</h3>
          <div className="flex items-center gap-3 text-xs text-gray-400">
            <span className="flex items-center gap-1"><span className="inline-block w-2.5 h-2.5 rounded-sm bg-red-400"></span>Critical &gt;50%</span>
            <span className="flex items-center gap-1"><span className="inline-block w-2.5 h-2.5 rounded-sm bg-orange-400"></span>High &gt;30%</span>
            <span className="flex items-center gap-1"><span className="inline-block w-2.5 h-2.5 rounded-sm bg-yellow-400"></span>Moderate</span>
            <span className="flex items-center gap-1"><span className="inline-block w-2.5 h-2.5 rounded-sm bg-green-400"></span>OK</span>
          </div>
        </div>
        <p className="text-xs text-gray-400 mb-5">Sorted highest to lowest · dashed line = 20% target</p>

        <div className="space-y-2.5">
          {bufferData.map((r, i) => {
            const w = Math.round(r.buffer / maxBuf * 100)
            return (
              <div key={i}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium text-gray-800">{r.name}</span>
                  <span className="text-sm font-semibold text-gray-700">{Math.round(r.buffer * 100)}%</span>
                </div>
                <div className="relative h-5 bg-gray-100 rounded-md overflow-hidden">
                  <div className="h-full rounded-md transition-all"
                    style={{ width: `${w}%`, background: bufferColor(r.buffer) }} />
                  <div className="absolute top-0 h-full border-l-2 border-dashed border-gray-400 opacity-60"
                    style={{ left: `${refPct}%` }} />
                </div>
              </div>
            )
          })}
        </div>

        <div className="mt-3 flex items-center gap-1.5 text-xs text-gray-400">
          <div className="w-4 border-t-2 border-dashed border-gray-400"></div>
          <span>20% target line</span>
        </div>
      </div>

      {/* Revenue chart — full width */}
      <div className="bg-white rounded-xl border border-gray-100 p-6">
        <h3 className="text-sm font-semibold text-gray-900 mb-1">Revenue by project</h3>
        <p className="text-xs text-gray-400 mb-5">Monthly revenue from billable headcount · sorted highest to lowest</p>

        <div className="space-y-2.5">
          {revenueData.map((r, i) => {
            const w = Math.round(r.revenue / maxRev * 100)
            return (
              <div key={i}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium text-gray-800">{r.name}</span>
                  <span className="text-sm font-semibold text-gray-700">{fmtMoney(r.revenue)}</span>
                </div>
                <div className="h-5 bg-gray-100 rounded-md overflow-hidden">
                  <div className="h-full rounded-md bg-gray-800 transition-all" style={{ width: `${w}%` }} />
                </div>
              </div>
            )
          })}
        </div>
      </div>

    </div>
  )
}
