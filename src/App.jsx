import React, { useState, useMemo } from 'react'
import Sidebar from './components/Sidebar'
import ExecutiveSummary from './components/ExecutiveSummary'
import ProjectTable from './components/ProjectTable'
import ScenarioPanel from './components/ScenarioPanel'
import Charts from './components/Charts'
import BufferConcentration from './components/BufferConcentration'
import BreakEvenCalculator from './components/BreakEvenCalculator'
import MoMTracker from './components/MoMTracker'
import HealthAndBenchmark from './components/HealthAndBenchmark'
import PoolingSimulator from './components/PoolingSimulator'
import { INITIAL_PROJECTS, SALARY_BANDS, DEFAULTS } from './data/projects'
import { calcPortfolio } from './engine'

const TABS = [
  { id: 'overview',  label: 'Overview' },
  { id: 'projects',  label: 'Projects' },
  { id: 'scenarios', label: 'Scenarios' },
  { id: 'charts',    label: 'Charts' },
  { id: 'health',    label: 'Health' },
  { id: 'pooling',   label: 'Pooling' },
  { id: 'tracker',   label: 'MoM Tracker' },
]

export default function App() {
  const [projects,  setProjects]  = useState(INITIAL_PROJECTS.map(p => ({ ...p, status: 'active', note: '' })))
  const [salaries,  setSalaries]  = useState(SALARY_BANDS)
  const [config,    setConfig]    = useState(DEFAULTS)
  const [currency,  setCurrency]  = useState('USD')
  const [activeTab, setActiveTab] = useState('overview')

  const portfolio = useMemo(
    () => calcPortfolio(projects, salaries, config),
    [projects, salaries, config]
  )

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar
        config={config} setConfig={setConfig}
        salaries={salaries} setSalaries={setSalaries}
        currency={currency} setCurrency={setCurrency}
      />
      <main className="flex-1 overflow-auto">
        <div className="sticky top-0 z-10 bg-white border-b border-gray-100 px-6 flex items-center gap-0 overflow-x-auto">
          {TABS.map(t => (
            <button key={t.id} onClick={() => setActiveTab(t.id)}
              className={`px-4 py-3.5 text-sm font-medium transition-all border-b-2 -mb-px whitespace-nowrap ${
                activeTab === t.id
                  ? 'border-gray-900 text-gray-900'
                  : 'border-transparent text-gray-400 hover:text-gray-600'
              }`}>
              {t.label}
            </button>
          ))}
        </div>

        <div className="px-6 py-5 space-y-4">
          <ExecutiveSummary portfolio={portfolio} currency={currency} fxRate={config.fxRate} />

          {activeTab === 'overview' && (
            <>
              <Charts computed={portfolio.rows} />
              <BufferConcentration computed={portfolio.rows} />
            </>
          )}

          {activeTab === 'projects' && (
            <ProjectTable
              projects={projects} setProjects={setProjects}
              computed={portfolio.rows} currency={currency} fxRate={config.fxRate}
            />
          )}

          {activeTab === 'scenarios' && (
            <ScenarioPanel
              portfolio={portfolio} salaries={salaries} config={config}
              currency={currency} fxRate={config.fxRate}
            />
          )}

          {activeTab === 'charts' && (
            <>
              <Charts computed={portfolio.rows} />
              <BufferConcentration computed={portfolio.rows} />
            </>
          )}

          {activeTab === 'health' && (
            <>
              <HealthAndBenchmark computed={portfolio.rows} currency={currency} fxRate={config.fxRate} />
              <BreakEvenCalculator computed={portfolio.rows} currency={currency} fxRate={config.fxRate} />
            </>
          )}

          {activeTab === 'pooling' && (
            <PoolingSimulator computed={portfolio.rows} />
          )}

          {activeTab === 'tracker' && (
            <MoMTracker portfolio={portfolio} currency={currency} fxRate={config.fxRate} />
          )}
        </div>
      </main>
    </div>
  )
}
