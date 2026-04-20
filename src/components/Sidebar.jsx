import React from 'react'
import { Settings, DollarSign } from 'lucide-react'

function SliderRow({ label, value, min, max, step = 1, unit = '', onChange }) {
  return (
    <div className="mb-4">
      <div className="flex justify-between items-center mb-1">
        <span className="text-xs text-gray-500">{label}</span>
        <span className="text-xs font-medium text-gray-800">{value}{unit}</span>
      </div>
      <input
        type="range" min={min} max={max} step={step} value={value}
        onChange={e => onChange(Number(e.target.value))}
        className="w-full h-1.5 bg-gray-200 rounded appearance-none cursor-pointer accent-gray-900"
      />
    </div>
  )
}

function NumInput({ label, value, onChange, prefix = '' }) {
  return (
    <div className="mb-3">
      <label className="text-xs text-gray-500 block mb-1">{label}</label>
      <div className="flex items-center border border-gray-200 rounded-lg bg-white px-2 py-1.5">
        {prefix && <span className="text-xs text-gray-400 mr-1">{prefix}</span>}
        <input
          type="number"
          value={value}
          onChange={e => onChange(Number(e.target.value))}
          className="w-full text-sm text-gray-800 outline-none bg-transparent"
        />
      </div>
    </div>
  )
}

export default function Sidebar({ config, setConfig, salaries, setSalaries, currency, setCurrency }) {
  const update = (key, val) => setConfig(c => ({ ...c, [key]: val }))
  const updateSal = (key, val) => setSalaries(s => ({ ...s, [key]: val }))

  return (
    <aside className="w-64 min-h-screen bg-white border-r border-gray-100 flex flex-col">
      <div className="px-5 py-5 border-b border-gray-100">
        <h1 className="text-sm font-semibold text-gray-900 leading-tight">Small Projects<br/>Control Tower</h1>
        <p className="text-xs text-gray-400 mt-1">Hugo · March 2026</p>
      </div>

      {/* Currency */}
      <div className="px-5 pt-5">
        <p className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-3 flex items-center gap-1.5">
          <Settings size={11} /> Global Controls
        </p>
        <div className="flex gap-2 mb-4">
          {['USD', 'NGN'].map(c => (
            <button key={c} onClick={() => setCurrency(c)}
              className={`flex-1 py-1.5 rounded-lg text-xs font-medium transition-all ${
                currency === c ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
              }`}>
              {c}
            </button>
          ))}
        </div>

        <NumInput label="FX Rate (NGN per $1)" value={config.fxRate} onChange={v => update('fxRate', v)} />
        <NumInput label="Billing hours / month" value={config.hours} onChange={v => update('hours', v)} />

        <SliderRow label="Utilization" value={config.utilization} min={50} max={100} unit="%" onChange={v => update('utilization', v)} />
        <SliderRow label="Cost to Company (CTC)" value={config.ctc} min={0} max={60} unit="%" onChange={v => update('ctc', v)} />
        <SliderRow label="Overhead (% of revenue)" value={config.overhead} min={0} max={30} unit="%" onChange={v => update('overhead', v)} />

        <NumInput label="Training cost / head / mo ($)" value={config.training} onChange={v => update('training', v)} prefix="$" />
        <NumInput label="IT / laptop cost / head / mo ($)" value={config.it} onChange={v => update('it', v)} prefix="$" />
      </div>

      {/* Salary bands */}
      <div className="px-5 pt-4 border-t border-gray-100 mt-2">
        <p className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-3 flex items-center gap-1.5">
          <DollarSign size={11} /> Salary Bands (NGN/mo)
        </p>
        <NumInput label="Agent (Band 2)" value={salaries.agent} onChange={v => updateSal('agent', v)} />
        <NumInput label="QA / SME (Band 1)" value={salaries.qa} onChange={v => updateSal('qa', v)} />
        <NumInput label="Team Lead (Band 1)" value={salaries.tl} onChange={v => updateSal('tl', v)} />
        <NumInput label="PC / PM (Band 1)" value={salaries.pc} onChange={v => updateSal('pc', v)} />
      </div>

      <div className="mt-auto px-5 py-4 border-t border-gray-100">
        <p className="text-xs text-gray-300">v1.0 · Internal use only</p>
      </div>
    </aside>
  )
}
