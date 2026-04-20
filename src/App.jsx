import React, { useState, useMemo } from 'react'
import Sidebar from './components/Sidebar'
import ExecutiveSummary from './components/ExecutiveSummary'
import ProjectTable from './components/ProjectTable'
import ScenarioPanel from './components/ScenarioPanel'
import Charts from './components/Charts'
import { INITIAL_PROJECTS, SALARY_BANDS, DEFAULTS } from './data/projects'
import { calcPortfolio } from './engine'

const TABS = ['Overview', 'Projects', 'Scenarios', 'Charts']

export default function App() {
  const [projects,  setProjects]  = useState(INITIAL_PROJECTS)
  const [salaries,  setSalaries]  = useState(SALARY_BANDS)
  const [config,    setConfig]    = useState(DEFAULTS)
  const [currency,  setCurrency]  = useState('USD')
  const [activeTab, setActiveTab] = useState('Overview')

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
        {/* Top nav */}
        <div className="sticky top-0 z-10 bg-white border-b border-gray-100 px-8 flex items-center gap-1">
          {TABS.map(t => (
            <button key={t} onClick={() => setActiveTab(t)}
              className={`px-4 py-3.5 text-sm font-medium transition-all border-b-2 -mb-px ${
                activeTab === t
                  ? 'border-gray-900 text-gray-900'
                  : 'border-transparent text-gray-400 hover:text-gray-600'
              }`}>
              {t}
            </button>
          ))}
        </div>

        <div className="px-8 py-6 space-y-5">
          {/* Executive summary always visible */}
          <ExecutiveSummary
            portfolio={portfolio}
            currency={currency}
            fxRate={config.fxRate}
          />

          {activeTab === 'Overview' && (
            <>
              <Charts computed={portfolio.rows} />
            </>
          )}

          {activeTab === 'Projects' && (
            <ProjectTable
              projects={projects}
              setProjects={setProjects}
              computed={portfolio.rows}
              currency={currency}
              fxRate={config.fxRate}
            />
          )}

          {activeTab === 'Scenarios' && (
            <ScenarioPanel
              portfolio={portfolio}
              salaries={salaries}
              config={config}
              currency={currency}
              fxRate={config.fxRate}
            />
          )}

          {activeTab === 'Charts' && (
            <Charts computed={portfolio.rows} />
          )}
        </div>
      </main>
    </div>
  )
}
