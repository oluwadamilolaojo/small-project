import React, { useState } from 'react'
import { Plus, Trash2, ChevronUp, ChevronDown } from 'lucide-react'

function bufferBadge(buf) {
  const pct = Math.round(buf * 100)
  if (buf <= 0)    return <span className="px-2 py-0.5 rounded-full text-xs bg-green-100 text-green-700">0%</span>
  if (buf <= 0.1)  return <span className="px-2 py-0.5 rounded-full text-xs bg-green-100 text-green-700">{pct}%</span>
  if (buf <= 0.2)  return <span className="px-2 py-0.5 rounded-full text-xs bg-yellow-100 text-yellow-700">{pct}%</span>
  if (buf <= 0.4)  return <span className="px-2 py-0.5 rounded-full text-xs bg-orange-100 text-orange-700">{pct}%</span>
  return               <span className="px-2 py-0.5 rounded-full text-xs bg-red-100 text-red-700">{pct}%</span>
}

function Cell({ val, onChange, type = 'number', small = false }) {
  return (
    <input
      type={type}
      value={val}
      onChange={e => onChange(type === 'number' ? Number(e.target.value) : e.target.value)}
      className={`w-full bg-transparent border-0 outline-none text-gray-800 text-xs text-center hover:bg-gray-50 focus:bg-blue-50 rounded px-1 py-1 ${small ? 'w-10' : ''}`}
    />
  )
}

const SORT_KEYS = { buffer: 'buffer', leakage: 'leakage', revenue: 'revenue', margin: 'marginPct' }

export default function ProjectTable({ projects, setProjects, computed, currency, fxRate }) {
  const [sort, setSort] = useState({ key: 'buffer', dir: 'desc' })

  const sym = currency === 'NGN' ? '₦' : '$'
  const fx  = currency === 'NGN' ? fxRate : 1

  function updateProject(id, field, val) {
    setProjects(ps => ps.map(p => p.id === id ? { ...p, [field]: val } : p))
  }

  function addProject() {
    const newId = Math.max(...projects.map(p => p.id)) + 1
    setProjects(ps => [...ps, {
      id: newId, name: 'New Project', rate: 12,
      billableAgents: 2, actualAgents: 3,
      billableQA: 0, actualQA: 0,
      billableTL: 0, actualTL: 0,
      billablePC: 0, actualPC: 0,
    }])
  }

  function removeProject(id) {
    setProjects(ps => ps.filter(p => p.id !== id))
  }

  function toggleSort(key) {
    setSort(s => s.key === key ? { key, dir: s.dir === 'desc' ? 'asc' : 'desc' } : { key, dir: 'desc' })
  }

  const sorted = [...computed].sort((a, b) => {
    const k = SORT_KEYS[sort.key] || sort.key
    return sort.dir === 'desc' ? b[k] - a[k] : a[k] - b[k]
  })

  function SortBtn({ label, k }) {
    const active = sort.key === k
    return (
      <button onClick={() => toggleSort(k)} className={`flex items-center gap-0.5 text-xs font-medium uppercase tracking-wide ${active ? 'text-gray-900' : 'text-gray-400 hover:text-gray-600'}`}>
        {label}
        {active ? (sort.dir === 'desc' ? <ChevronDown size={10}/> : <ChevronUp size={10}/>) : null}
      </button>
    )
  }

  return (
    <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
      <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
        <div>
          <h3 className="text-sm font-semibold text-gray-900">Project Breakdown</h3>
          <p className="text-xs text-gray-400 mt-0.5">Click any cell to edit · {projects.length} projects</p>
        </div>
        <button onClick={addProject}
          className="flex items-center gap-1.5 text-xs bg-gray-900 text-white px-3 py-1.5 rounded-lg hover:bg-gray-700 transition-colors">
          <Plus size={12} /> Add project
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-xs">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-100">
              <th className="text-left px-4 py-2.5 text-gray-400 font-medium w-36">Project</th>
              <th className="text-center px-2 py-2.5 text-gray-400 font-medium">Rate</th>
              {/* Billable */}
              <th className="text-center px-1 py-2.5 text-blue-400 font-medium" colSpan={4}>Billable (Ag · QA · TL · PC)</th>
              {/* Actual */}
              <th className="text-center px-1 py-2.5 text-orange-400 font-medium" colSpan={4}>Actual (Ag · QA · TL · PC)</th>
              {/* Computed */}
              <th className="px-2 py-2.5"><SortBtn label="Buffer" k="buffer"/></th>
              <th className="px-2 py-2.5"><SortBtn label="Revenue" k="revenue"/></th>
              <th className="px-2 py-2.5"><SortBtn label="Margin" k="margin"/></th>
              <th className="px-2 py-2.5"><SortBtn label="Leakage" k="leakage"/></th>
              <th className="px-2 py-2.5 w-8"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {sorted.map(row => {
              const p = projects.find(x => x.id === row.id)
              if (!p) return null
              return (
                <tr key={p.id} className={`hover:bg-gray-50 transition-colors ${row.buffer > 0.4 ? 'bg-red-50/30' : ''}`}>
                  <td className="px-4 py-1.5">
                    <input type="text" value={p.name}
                      onChange={e => updateProject(p.id, 'name', e.target.value)}
                      className="w-full bg-transparent text-gray-800 text-xs outline-none hover:bg-gray-100 focus:bg-blue-50 rounded px-1 py-0.5 font-medium"/>
                  </td>
                  <td className="px-1 py-1.5 text-center">
                    <div className="flex items-center justify-center gap-0.5">
                      <span className="text-gray-300 text-xs">$</span>
                      <Cell val={p.rate} onChange={v => updateProject(p.id, 'rate', v)} />
                    </div>
                  </td>
                  {/* Billable */}
                  {['billableAgents','billableQA','billableTL','billablePC'].map(f => (
                    <td key={f} className="px-1 py-1.5 text-center text-blue-600">
                      <Cell val={p[f]} onChange={v => updateProject(p.id, f, v)} />
                    </td>
                  ))}
                  {/* Actual */}
                  {['actualAgents','actualQA','actualTL','actualPC'].map(f => (
                    <td key={f} className="px-1 py-1.5 text-center text-orange-600">
                      <Cell val={p[f]} onChange={v => updateProject(p.id, f, v)} />
                    </td>
                  ))}
                  {/* Computed */}
                  <td className="px-2 py-1.5 text-center">{bufferBadge(row.buffer)}</td>
                  <td className="px-2 py-1.5 text-center text-gray-700">{sym}{(row.revenue * fx).toLocaleString('en-US', {maximumFractionDigits:0})}</td>
                  <td className="px-2 py-1.5 text-center text-gray-700">{(row.marginPct * 100).toFixed(0)}%</td>
                  <td className="px-2 py-1.5 text-center text-amber-600">{sym}{(row.leakage * fx).toLocaleString('en-US', {maximumFractionDigits:0})}</td>
                  <td className="px-2 py-1.5 text-center">
                    <button onClick={() => removeProject(p.id)}
                      className="text-gray-200 hover:text-red-400 transition-colors">
                      <Trash2 size={12}/>
                    </button>
                  </td>
                </tr>
              )
            })}
          </tbody>
          {/* Totals */}
          <tfoot>
            <tr className="bg-gray-50 border-t border-gray-200 font-semibold">
              <td className="px-4 py-2.5 text-gray-700 text-xs">TOTAL</td>
              <td/>
              <td className="text-center text-blue-600 text-xs px-1">{computed.reduce((s,r)=>s+r.billableAgents,0)}</td>
              <td className="text-center text-blue-600 text-xs px-1">{computed.reduce((s,r)=>s+r.billableQA,0)}</td>
              <td className="text-center text-blue-600 text-xs px-1">{computed.reduce((s,r)=>s+r.billableTL,0)}</td>
              <td className="text-center text-blue-600 text-xs px-1">{computed.reduce((s,r)=>s+r.billablePC,0)}</td>
              <td className="text-center text-orange-600 text-xs px-1">{computed.reduce((s,r)=>s+r.actualAgents,0)}</td>
              <td className="text-center text-orange-600 text-xs px-1">{computed.reduce((s,r)=>s+r.actualQA,0)}</td>
              <td className="text-center text-orange-600 text-xs px-1">{computed.reduce((s,r)=>s+r.actualTL,0)}</td>
              <td className="text-center text-orange-600 text-xs px-1">{computed.reduce((s,r)=>s+r.actualPC,0)}</td>
              <td className="text-center px-2 text-xs">
                {bufferBadge(computed.reduce((s,r)=>s+r.billableHeads,0) > 0
                  ? (computed.reduce((s,r)=>s+r.actualHeads,0) - computed.reduce((s,r)=>s+r.billableHeads,0)) / computed.reduce((s,r)=>s+r.billableHeads,0)
                  : 0)}
              </td>
              <td className="text-center text-gray-800 text-xs px-2">
                {sym}{(computed.reduce((s,r)=>s+r.revenue,0)*fx).toLocaleString('en-US',{maximumFractionDigits:0})}
              </td>
              <td className="text-center text-gray-800 text-xs px-2">
                {(() => { const r = computed.reduce((s,x)=>s+x.revenue,0); const c = computed.reduce((s,x)=>s+x.totalCost,0); return r > 0 ? ((r-c)/r*100).toFixed(0)+'%' : '-' })()}
              </td>
              <td className="text-center text-amber-700 text-xs px-2">
                {sym}{(computed.reduce((s,r)=>s+r.leakage,0)*fx).toLocaleString('en-US',{maximumFractionDigits:0})}
              </td>
              <td/>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  )
}
