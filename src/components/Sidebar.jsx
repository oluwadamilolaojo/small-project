import React from 'react'
import { Settings, DollarSign, Info } from 'lucide-react'

function SliderRow({ label, value, min, max, step = 1, unit = '', onChange, hint }) {
  return (
    <div className="mb-5">
      <div className="flex justify-between items-center mb-1.5">
        <span className="text-xs text-gray-600">{label}</span>
        <span className="text-xs font-semibold text-gray-900 bg-gray-100 px-2 py-0.5 rounded-md">{value}{unit}</span>
      </div>
      <input
        type="range" min={min} max={max} step={step} value={value}
        onChange={e => onChange(Number(e.target.value))}
        className="w-full h-1.5 bg-gray-200 rounded appearance-none cursor-pointer accent-gray-900"
      />
      {hint && <p className="text-xs text-gray-300 mt-1">{hint}</p>}
    </div>
  )
}

function NumInput({ label, value, onChange, hint }) {
  return (
    <div className="mb-4">
      <div className="flex items-center justify-between mb-1.5">
        <label className="text-xs text-gray-600">{label}</label>
        {hint && <span className="text-xs text-gray-300">{hint}</span>}
      </div>
      <input
        type="number"
        value={value}
        onChange={e => onChange(Number(e.target.value))}
        className="w-full text-sm text-gray-800 border border-gray-150 rounded-lg bg-white px-3 py-2 outline-none focus:border-gray-300 transition-colors"
        style={{ borderColor: 'var(--color-border-tertiary)' }}
      />
    </div>
  )
}

function SectionHeader({ icon: Icon, label }) {
  return (
    <div className="flex items-center gap-2 mt-5 mb-3 pb-2 border-b border-gray-100">
      <Icon size={11} className="text-gray-400" />
      <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">{label}</span>
    </div>
  )
}

export default function Sidebar({ config, setConfig, salaries, setSalaries, currency, setCurrency, onReset }) {
  const update    = (key, val) => setConfig(c => ({ ...c, [key]: val }))
  const updateSal = (key, val) => setSalaries(s => ({ ...s, [key]: val }))

  return (
    <aside className="w-64 min-h-screen bg-white border-r border-gray-100 flex flex-col">

      {/* Branding */}
      <div className="px-5 py-5 border-b border-gray-100">
        <div className="flex items-center gap-2 mb-1">
          <div className="w-6 h-6 rounded-md bg-gray-900 flex items-center justify-center">
            <span className="text-white text-xs font-bold">SP</span>
          </div>
          <h1 className="text-sm font-semibold text-gray-900 leading-tight">Control Tower</h1>
        </div>
        <p className="text-xs text-gray-400 pl-8">Small projects · Hugo</p>
      </div>

      <div className="px-5 py-4 flex-1 overflow-y-auto">

        {/* Currency */}
        <SectionHeader icon={Settings} label="Currency" />
        <div className="flex gap-2 mb-1">
          {['USD', 'NGN'].map(c => (
            <button key={c} onClick={() => setCurrency(c)}
              className={`flex-1 py-2 rounded-lg text-xs font-semibold transition-all ${
                currency === c
                  ? 'bg-gray-900 text-white'
                  : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
              }`}>
              {c === 'USD' ? '$ USD' : '₦ NGN'}
            </button>
          ))}
        </div>

        {/* Global controls */}
        <SectionHeader icon={Settings} label="Global controls" />

        <NumInput
          label="FX rate (NGN per $1)"
          value={config.fxRate}
          onChange={v => update('fxRate', v)}
          hint="e.g. 1400"
        />
        <NumInput
          label="Billing hours / month"
          value={config.hours}
          onChange={v => update('hours', v)}
          hint="default 160"
        />

        <SliderRow label="Utilization" value={config.utilization} min={50} max={100} unit="%" onChange={v => update('utilization', v)} hint="% of hours that are billable" />
        <SliderRow label="Cost to company (CTC)" value={config.ctc} min={0} max={60} unit="%" onChange={v => update('ctc', v)} hint="Added on top of base salary" />
        <SliderRow label="Overhead (% of revenue)" value={config.overhead} min={0} max={30} unit="%" onChange={v => update('overhead', v)} />

        <NumInput label="Training cost / head / mo" value={config.training} onChange={v => update('training', v)} hint="USD" />
        <NumInput label="IT / laptop cost / head / mo" value={config.it} onChange={v => update('it', v)} hint="USD" />

        {/* Salary bands */}
        <SectionHeader icon={DollarSign} label="Salary bands" />
        <p className="text-xs text-gray-400 mb-3 -mt-1">All values in NGN / month</p>

        <NumInput label="Agent (Band 2)"    value={salaries.agent} onChange={v => updateSal('agent', v)} hint="NGN/mo" />
        <NumInput label="QA / SME (Band 1)" value={salaries.qa}    onChange={v => updateSal('qa', v)}    hint="NGN/mo" />
        <NumInput label="Team lead (Band 1)" value={salaries.tl}   onChange={v => updateSal('tl', v)}    hint="NGN/mo" />
        <NumInput label="PC / PM (Band 1)"  value={salaries.pc}    onChange={v => updateSal('pc', v)}    hint="NGN/mo" />
      </div>

      <div className="px-5 py-3 border-t border-gray-100 space-y-2">
        <button onClick={onReset}
          className="w-full text-xs text-gray-300 hover:text-red-400 transition-colors text-left">
          Reset to defaults
        </button>
        <p className="text-xs text-gray-300">v2.3 · Auto-saved locally</p>
      </div>
    </aside>
  )
}
