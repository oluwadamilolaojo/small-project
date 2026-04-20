import React, { useState } from 'react'
import { Plus, X, Users } from 'lucide-react'

export default function PoolingSimulator({ computed }) {
  const [pools, setPools] = useState([
    { id: 1, name: 'Pool A', projectIds: [] },
  ])
  const [nextId, setNextId] = useState(2)

  const activeProjects = computed.filter(r => r.actualHeads > 0)
  const assignedIds = new Set(pools.flatMap(p => p.projectIds))
  const unassigned = activeProjects.filter(r => !assignedIds.has(r.id))

  function addPool() {
    setPools(ps => [...ps, { id: nextId, name: `Pool ${String.fromCharCode(64 + nextId)}`, projectIds: [] }])
    setNextId(n => n + 1)
  }

  function removePool(poolId) {
    setPools(ps => ps.filter(p => p.id !== poolId))
  }

  function addToPool(poolId, projectId) {
    setPools(ps => ps.map(p => p.id === poolId
      ? { ...p, projectIds: [...p.projectIds, projectId] }
      : p
    ))
  }

  function removeFromPool(poolId, projectId) {
    setPools(ps => ps.map(p => p.id === poolId
      ? { ...p, projectIds: p.projectIds.filter(id => id !== projectId) }
      : p
    ))
  }

  function calcPool(pool) {
    const projects = activeProjects.filter(r => pool.projectIds.includes(r.id))
    if (!projects.length) return null
    const totalBillable = projects.reduce((s, r) => s + r.billableHeads, 0)
    const totalActual   = projects.reduce((s, r) => s + r.actualHeads,   0)
    const combinedBuf   = totalBillable > 0 ? (totalActual - totalBillable) / totalBillable : 0
    const totalRevenue  = projects.reduce((s, r) => s + r.revenue,        0)
    const totalCost     = projects.reduce((s, r) => s + r.totalCost,      0)
    const totalLeakage  = projects.reduce((s, r) => s + r.leakage,        0)
    const margin        = totalRevenue > 0 ? (totalRevenue - totalCost) / totalRevenue : 0
    const worstIndividual = Math.max(...projects.map(r => r.buffer))
    const improvement = worstIndividual - combinedBuf
    return { totalBillable, totalActual, combinedBuf, totalRevenue, totalCost, totalLeakage, margin, worstIndividual, improvement, count: projects.length }
  }

  function bufBadge(b) {
    const pct = Math.round(b * 100)
    if (b <= 0.1)  return <span className="px-2 py-0.5 rounded-full text-xs bg-green-100 text-green-700">{pct}%</span>
    if (b <= 0.2)  return <span className="px-2 py-0.5 rounded-full text-xs bg-yellow-100 text-yellow-700">{pct}%</span>
    if (b <= 0.4)  return <span className="px-2 py-0.5 rounded-full text-xs bg-orange-100 text-orange-700">{pct}%</span>
    return <span className="px-2 py-0.5 rounded-full text-xs bg-red-100 text-red-700">{pct}%</span>
  }

  return (
    <div className="bg-white rounded-xl border border-gray-100 p-5">
      <div className="flex items-start justify-between mb-1">
        <div>
          <h3 className="text-sm font-semibold text-gray-900">Pooling simulator</h3>
          <p className="text-xs text-gray-400 mt-0.5">Group projects into shared buffer pools and see the combined impact</p>
        </div>
        <button onClick={addPool}
          className="flex items-center gap-1.5 text-xs bg-gray-900 text-white px-3 py-1.5 rounded-lg hover:bg-gray-700 transition-colors">
          <Plus size={11} /> Add pool
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mt-4">

        {/* Unassigned projects */}
        <div className="border border-dashed border-gray-200 rounded-xl p-4 bg-gray-50/50">
          <p className="text-xs font-medium text-gray-500 mb-3">Unassigned ({unassigned.length})</p>
          <div className="space-y-1.5">
            {unassigned.length === 0
              ? <p className="text-xs text-gray-300 text-center py-4">All projects assigned</p>
              : unassigned.map(r => (
                <div key={r.id} className="flex items-center justify-between bg-white rounded-lg px-2.5 py-1.5 border border-gray-100">
                  <div>
                    <span className="text-xs font-medium text-gray-700">{r.name}</span>
                    <span className="text-xs text-gray-400 ml-2">{Math.round(r.buffer * 100)}% buf</span>
                  </div>
                  <div className="flex gap-1">
                    {pools.map(pool => (
                      <button key={pool.id} onClick={() => addToPool(pool.id, r.id)}
                        className="text-xs px-2 py-0.5 bg-gray-100 hover:bg-gray-900 hover:text-white text-gray-600 rounded transition-colors">
                        {pool.name}
                      </button>
                    ))}
                  </div>
                </div>
              ))
            }
          </div>
        </div>

        {/* Pools */}
        {pools.map(pool => {
          const stats = calcPool(pool)
          return (
            <div key={pool.id} className="border border-gray-200 rounded-xl p-4">
              <div className="flex items-center justify-between mb-3">
                <input
                  value={pool.name}
                  onChange={e => setPools(ps => ps.map(p => p.id === pool.id ? { ...p, name: e.target.value } : p))}
                  className="text-xs font-semibold text-gray-800 bg-transparent outline-none border-b border-transparent hover:border-gray-200 focus:border-gray-400 w-24"
                />
                <button onClick={() => removePool(pool.id)} className="text-gray-300 hover:text-red-400 transition-colors">
                  <X size={12} />
                </button>
              </div>

              <div className="space-y-1.5 mb-3 min-h-12">
                {pool.projectIds.length === 0
                  ? <p className="text-xs text-gray-300 text-center py-3">Add projects →</p>
                  : pool.projectIds.map(pid => {
                    const r = activeProjects.find(x => x.id === pid)
                    if (!r) return null
                    return (
                      <div key={pid} className="flex items-center justify-between bg-gray-50 rounded-lg px-2.5 py-1.5">
                        <span className="text-xs text-gray-700">{r.name}</span>
                        <button onClick={() => removeFromPool(pool.id, pid)} className="text-gray-300 hover:text-red-400 ml-2">
                          <X size={10} />
                        </button>
                      </div>
                    )
                  })
                }
              </div>

              {stats ? (
                <div className="border-t border-gray-100 pt-3 space-y-1.5">
                  <div className="flex justify-between text-xs">
                    <span className="text-gray-400">Combined buffer</span>
                    {bufBadge(stats.combinedBuf)}
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-gray-400">Worst individual</span>
                    {bufBadge(stats.worstIndividual)}
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-gray-400">Buffer improvement</span>
                    <span className={`font-medium text-xs ${stats.improvement > 0 ? 'text-green-600' : 'text-gray-400'}`}>
                      {stats.improvement > 0 ? '−' : ''}{Math.abs(Math.round(stats.improvement * 100))}pp
                    </span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-gray-400">Heads (bill/actual)</span>
                    <span className="text-xs text-gray-700">{stats.totalBillable}/{stats.totalActual}</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-gray-400">Combined margin</span>
                    <span className="text-xs font-medium text-gray-800">{Math.round(stats.margin * 100)}%</span>
                  </div>
                </div>
              ) : (
                <div className="border-t border-gray-100 pt-3 text-xs text-gray-300 text-center">Add projects to see stats</div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
