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

const TAB_DESCRIPTIONS = {
  overview:  'Executive summary, buffer chart, and revenue breakdown',
  projects:  'Edit headcount, rates, and notes per project',
  scenarios: 'Simulate rate changes and headcount reductions',
  charts:    'Visual breakdown of buffer and revenue across projects',
  health:    'Project health scores and client rate benchmarking',
  pooling:   'Simulate shared buffer pools across projects',
  tracker:   'Lock a baseline and track month-over-month changes',
}

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

  const now = new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar
        config={config} setConfig={setConfig}
        salaries={salaries} setSalaries={setSalaries}
        currency={currency} setCurrency={setCurrency}
      />

      <main className="flex-1 overflow-auto flex flex-col">

        {/* Main area header */}
        <div className="bg-white border-b border-gray-100 px-6 py-3 flex items-center justify-between flex-shrink-0">
          <div>
            <h2 className="text-sm font-semibold text-gray-900">Small Projects · {now}</h2>
            <p className="text-xs text-gray-400 mt-0.5">{TAB_DESCRIPTIONS[activeTab]}</p>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs text-gray-400">{projects.length} projects</span>
            <span className="w-1 h-1 rounded-full bg-gray-300"></span>
            <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${
              portfolio.portfolioBuffer > 0.3
                ? 'bg-red-50 text-red-600'
                : portfolio.portfolioBuffer > 0.2
                ? 'bg-amber-50 text-amber-600'
                : 'bg-green-50 text-green-600'
            }`}>
              {Math.round(portfolio.portfolioBuffer * 100)}% buffer
            </span>
          </div>
        </div>

        {/* Tab bar */}
        <div className="bg-white border-b border-gray-100 px-6 flex items-center gap-0 overflow-x-auto flex-shrink-0">
          {TABS.map(t => (
            <button key={t.id} onClick={() => setActiveTab(t.id)}
              className={`px-4 py-3 text-sm font-medium transition-all border-b-2 -mb-px whitespace-nowrap ${
                activeTab === t.id
                  ? 'border-gray-900 text-gray-900'
                  : 'border-transparent text-gray-400 hover:text-gray-600'
              }`}>
              {t.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="px-6 py-5 space-y-4 flex-1">
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
