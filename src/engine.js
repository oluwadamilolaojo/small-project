export function calcProject(p, salaries, config) {
  const { fxRate, hours, utilization, ctc, overhead, training, it } = config

  const agentUSD = salaries.agent / fxRate
  const qaUSD    = salaries.qa    / fxRate
  const tlUSD    = salaries.tl    / fxRate
  const pcUSD    = salaries.pc    / fxRate

  const billableHeads = p.billableAgents + p.billableQA + p.billableTL + p.billablePC
  const actualHeads   = p.actualAgents   + p.actualQA   + p.actualTL   + p.actualPC

  const billableHours = billableHeads * hours * (utilization / 100)
  const revenue       = billableHours * p.rate

  const salaryCost =
    p.actualAgents * agentUSD +
    p.actualQA     * qaUSD    +
    p.actualTL     * tlUSD    +
    p.actualPC     * pcUSD

  const ctcCost      = salaryCost * (ctc / 100)
  const trainingCost = actualHeads * training
  const itCost       = actualHeads * it
  const overheadCost = revenue * (overhead / 100)

  const totalCost = salaryCost + ctcCost + trainingCost + itCost + overheadCost

  // Buffer: how much over billable is actual — (actual - billable) / billable
  const buffer  = billableHeads > 0 ? (actualHeads - billableHeads) / billableHeads : 0
  const leakage = (actualHeads - billableHeads) * hours * p.rate

  const grossMargin = revenue - totalCost
  const marginPct   = revenue > 0 ? grossMargin / revenue : 0

  return {
    ...p,
    billableHeads,
    actualHeads,
    billableHours,
    revenue,
    salaryCost,
    ctcCost,
    trainingCost,
    itCost,
    overheadCost,
    totalCost,
    buffer,
    leakage,
    grossMargin,
    marginPct,
  }
}

export function calcPortfolio(projects, salaries, config) {
  const rows = projects.map(p => calcProject(p, salaries, config))

  const totalRevenue      = rows.reduce((s, r) => s + r.revenue,      0)
  const totalCost         = rows.reduce((s, r) => s + r.totalCost,     0)
  const totalLeakage      = rows.reduce((s, r) => s + r.leakage,       0)
  const totalBillable     = rows.reduce((s, r) => s + r.billableHeads, 0)
  const totalActual       = rows.reduce((s, r) => s + r.actualHeads,   0)

  const portfolioBuffer   = totalBillable > 0 ? (totalActual - totalBillable) / totalBillable : 0
  const portfolioMargin   = totalRevenue  > 0 ? (totalRevenue - totalCost) / totalRevenue : 0
  const grossMargin       = totalRevenue - totalCost

  return {
    rows,
    totalRevenue,
    totalCost,
    grossMargin,
    totalLeakage,
    totalBillable,
    totalActual,
    portfolioBuffer,
    portfolioMargin,
  }
}

// Auto-solve: given a target buffer %, what are the options?
export function autoSolve(portfolio, targetBufferPct, salaries, config) {
  const { fxRate, hours } = config
  const agentUSD = salaries.agent / fxRate

  const currentBuffer = portfolio.portfolioBuffer
  const excessHeads   = portfolio.totalActual - portfolio.totalBillable
  const targetActual  = Math.ceil(portfolio.totalBillable * (1 + targetBufferPct / 100))
  const headsToReduce = Math.max(0, portfolio.totalActual - targetActual)

  // Option A: reduce headcount
  const costSavedByReduction = headsToReduce * agentUSD * (1 + config.ctc / 100)

  // Option B: increase rate to bill all actuals
  const totalActualHours  = portfolio.totalActual * hours * (config.utilization / 100)
  const requiredRateForAll = portfolio.totalCost / totalActualHours

  // Option C: convert excess to billable (renegotiate)
  const convertibleHeads = excessHeads - headsToReduce
  const additionalRevenue = convertibleHeads * hours * (config.utilization / 100) *
    (portfolio.totalRevenue / (portfolio.totalBillable * hours * config.utilization / 100) || 0)

  return {
    currentBuffer:      Math.round(currentBuffer * 100),
    targetBuffer:       targetBufferPct,
    excessHeads,
    headsToReduce,
    targetActual,
    costSavedByReduction,
    requiredRateForAll,
    additionalRevenue,
    convertibleHeads,
  }
}
