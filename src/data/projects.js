export const INITIAL_PROJECTS = [
  { id: 1,  name: 'Backroads',       rate: 15, billableAgents: 3,  actualAgents: 4,  billableQA: 0, actualQA: 0, billableTL: 1, actualTL: 1, billablePC: 0, actualPC: 0 },
  { id: 2,  name: 'Bask & Lather',   rate: 11, billableAgents: 12, actualAgents: 13, billableQA: 0, actualQA: 0, billableTL: 0, actualTL: 1, billablePC: 0, actualPC: 0 },
  { id: 3,  name: 'Edhat',           rate: 10, billableAgents: 1,  actualAgents: 1,  billableQA: 0, actualQA: 0, billableTL: 0, actualTL: 0, billablePC: 0, actualPC: 0 },
  { id: 4,  name: 'Fireclay Tiles',  rate: 12, billableAgents: 3,  actualAgents: 5,  billableQA: 0, actualQA: 0, billableTL: 0, actualTL: 0, billablePC: 0, actualPC: 0 },
  { id: 5,  name: 'Kiddom',          rate: 14, billableAgents: 3,  actualAgents: 4,  billableQA: 0, actualQA: 0, billableTL: 1, actualTL: 1, billablePC: 0, actualPC: 0 },
  { id: 6,  name: 'Kings of Neon',   rate: 12, billableAgents: 7,  actualAgents: 8,  billableQA: 0, actualQA: 0, billableTL: 0, actualTL: 0, billablePC: 0, actualPC: 0 },
  { id: 7,  name: 'Main Factor',     rate: 12, billableAgents: 2,  actualAgents: 3,  billableQA: 0, actualQA: 0, billableTL: 0, actualTL: 1, billablePC: 0, actualPC: 0 },
  { id: 8,  name: 'Pinata',          rate: 12, billableAgents: 3,  actualAgents: 4,  billableQA: 0, actualQA: 1, billableTL: 0, actualTL: 0, billablePC: 0, actualPC: 0 },
  { id: 9,  name: 'Rest of World',   rate: 13, billableAgents: 0,  actualAgents: 0,  billableQA: 0, actualQA: 0, billableTL: 1, actualTL: 1, billablePC: 0, actualPC: 0 },
  { id: 10, name: 'SoHookd',         rate: 12, billableAgents: 2,  actualAgents: 2,  billableQA: 0, actualQA: 0, billableTL: 0, actualTL: 0, billablePC: 0, actualPC: 0 },
  { id: 11, name: 'Sonovate',        rate: 11, billableAgents: 5,  actualAgents: 8,  billableQA: 1, actualQA: 0, billableTL: 1, actualTL: 1, billablePC: 0, actualPC: 0 },
  { id: 12, name: 'Stream Hatchet',  rate: 10, billableAgents: 6,  actualAgents: 8,  billableQA: 0, actualQA: 0, billableTL: 0, actualTL: 1, billablePC: 0, actualPC: 1 },
  { id: 13, name: 'Topicals',        rate: 12, billableAgents: 1,  actualAgents: 1,  billableQA: 0, actualQA: 0, billableTL: 0, actualTL: 0, billablePC: 0, actualPC: 0 },
  { id: 14, name: 'TRC',             rate: 11, billableAgents: 1,  actualAgents: 1,  billableQA: 0, actualQA: 0, billableTL: 0, actualTL: 0, billablePC: 0, actualPC: 0 },
  { id: 15, name: 'Userwise',        rate: 12, billableAgents: 3,  actualAgents: 3,  billableQA: 0, actualQA: 0, billableTL: 0, actualTL: 0, billablePC: 0, actualPC: 0 },
  { id: 16, name: 'Visual DX',       rate: 15, billableAgents: 1,  actualAgents: 1,  billableQA: 0, actualQA: 1, billableTL: 0, actualTL: 0, billablePC: 0, actualPC: 0 },
  { id: 17, name: 'Writer',          rate: 14, billableAgents: 3,  actualAgents: 3,  billableQA: 1, actualQA: 1, billableTL: 0, actualTL: 0, billablePC: 0, actualPC: 0 },
  { id: 18, name: 'Gravyty',         rate: 14, billableAgents: 2,  actualAgents: 2,  billableQA: 0, actualQA: 0, billableTL: 0, actualTL: 0, billablePC: 2, actualPC: 2 },
  { id: 19, name: 'Earnest RCM',     rate: 16, billableAgents: 10, actualAgents: 15, billableQA: 0, actualQA: 0, billableTL: 1, actualTL: 1, billablePC: 0, actualPC: 1 },
  { id: 20, name: 'BSG Logistics',   rate: 16, billableAgents: 2,  actualAgents: 4,  billableQA: 0, actualQA: 0, billableTL: 1, actualTL: 1, billablePC: 0, actualPC: 0 },
  { id: 21, name: 'Bearefoot',       rate: 16, billableAgents: 1,  actualAgents: 1,  billableQA: 0, actualQA: 0, billableTL: 1, actualTL: 1, billablePC: 0, actualPC: 0 },
]

export const SALARY_BANDS = {
  agent: 325000,
  qa:    429000,
  tl:    669000,
  pc:    925000,
}

export const DEFAULTS = {
  fxRate:      1400,
  hours:       160,
  utilization: 85,
  ctc:         30,
  overhead:    5,
  training:    0,
  it:          0,
}
